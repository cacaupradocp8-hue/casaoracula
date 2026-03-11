import { format, formatDistanceToNow, isValid, parseISO, type FormatOptions } from 'date-fns';

type DateInput = string | number | Date | null | undefined;

const LOG_PREFIX = '[boot-debug][dates]';

function normalizeDateString(value: string): string {
  return value.includes(' ') ? value.replace(' ', 'T') : value;
}

export function parseDateSafe(value: DateInput, context = 'unknown'): Date | null {
  if (value === null || value === undefined) {
    console.warn(`${LOG_PREFIX} valor de data ausente`, { context, value });
    return null;
  }

  try {
    if (value instanceof Date) {
      if (isValid(value)) return value;
      console.warn(`${LOG_PREFIX} Date inválida`, { context, value });
      return null;
    }

    if (typeof value === 'number') {
      const parsedFromNumber = new Date(value);
      if (isValid(parsedFromNumber)) return parsedFromNumber;
      console.warn(`${LOG_PREFIX} timestamp inválido`, { context, value });
      return null;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        console.warn(`${LOG_PREFIX} string de data vazia`, { context });
        return null;
      }

      const normalized = normalizeDateString(trimmed);
      const parsedIso = parseISO(normalized);
      if (isValid(parsedIso)) return parsedIso;

      const parsedNative = new Date(trimmed);
      if (isValid(parsedNative)) return parsedNative;

      console.warn(`${LOG_PREFIX} string de data malformada`, { context, value: trimmed });
      return null;
    }

    console.warn(`${LOG_PREFIX} tipo de data não suportado`, { context, valueType: typeof value });
    return null;
  } catch (error) {
    console.error(`${LOG_PREFIX} erro ao interpretar data`, { context, value, error });
    return null;
  }
}

export function formatDateSafe(
  value: DateInput,
  pattern: string,
  options?: FormatOptions,
  fallback = 'Data indisponível',
  context = 'formatDateSafe'
): string {
  const parsedDate = parseDateSafe(value, context);
  if (!parsedDate) return fallback;

  try {
    return format(parsedDate, pattern, options);
  } catch (error) {
    console.error(`${LOG_PREFIX} erro ao formatar data`, { context, value, error });
    return fallback;
  }
}

export function formatDistanceToNowSafe(
  value: DateInput,
  options?: Parameters<typeof formatDistanceToNow>[1],
  fallback = 'Agora há pouco',
  context = 'formatDistanceToNowSafe'
): string {
  const parsedDate = parseDateSafe(value, context);
  if (!parsedDate) return fallback;

  try {
    return formatDistanceToNow(parsedDate, options);
  } catch (error) {
    console.error(`${LOG_PREFIX} erro ao calcular distância da data`, { context, value, error });
    return fallback;
  }
}
