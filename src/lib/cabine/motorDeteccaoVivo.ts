/**
 * MOTOR DE DETECÇÃO VIVA
 * 
 * Analisa texto digitado em tempo real para detectar padrões clínicos:
 * - repetição
 * - racionalização
 * - conflito
 * - desorganização
 * 
 * Retorna soft updates para estado_campo, direção e risco,
 * além de micro-mensagens contextuais (máx 1 ativa, auto-desaparece).
 */

import type { EstadoCampo, DirecaoConducao, NivelRisco } from './motorOracular';

export type PadraoDetectado = 'repeticao' | 'racionalizacao' | 'conflito' | 'desorganizacao' | null;

export interface SessionUpdateResult {
  padrao: PadraoDetectado;
  /** Soft update — null = manter o atual */
  estado_campo_override: EstadoCampo | null;
  direcao_override: DirecaoConducao | null;
  risco_override: NivelRisco | null;
  /** Micro-mensagem contextual (máx 1, auto-desaparece) */
  micro_mensagem: string | null;
}

// ========================================
// DETECÇÃO DE PADRÕES POR ANÁLISE TEXTUAL
// ========================================

const REPETICAO_MARKERS = [
  'de novo', 'sempre', 'toda vez', 'outra vez', 'mais uma vez',
  'novamente', 'igual', 'mesmo padrão', 'mesma coisa', 'volta',
  'repete', 'repetindo', 'ciclo', 'loop', 'não muda', 'não sai',
];

const RACIONALIZACAO_MARKERS = [
  'porque', 'por isso', 'logicamente', 'na verdade', 'o que faz sentido',
  'racional', 'pensando bem', 'analisando', 'objetivamente', 'eu acho que',
  'eu penso que', 'tecnicamente', 'explicação', 'justificativa',
  'motivo', 'razão', 'entendo que', 'compreendo que',
];

const CONFLITO_MARKERS = [
  'mas ao mesmo tempo', 'não sei se', 'parte de mim', 'dividida',
  'conflito', 'contraditório', 'ambivalente', 'por um lado', 'por outro',
  'quero e não quero', 'sim e não', 'confusa', 'perdida entre',
  'dois lados', 'tensão', 'puxando', 'rasgada',
];

const DESORGANIZACAO_MARKERS = [
  'não sei', 'confusa', 'perdida', 'não consigo', 'caos', 'tudo junto',
  'misturado', 'bagunça', 'não entendo', 'desorganizada', 'muita coisa',
  'não para', 'acelerada', 'sem chão', 'sem rumo', 'sufocada',
  'transbordando', 'demais', 'não aguento',
];

// Strong markers that alone indicate the pattern (threshold=1)
const DESORGANIZACAO_STRONG = [
  'perdida', 'sem chão', 'caos', 'sufocada', 'desorganizada', 'confusa',
  'transbordando', 'não aguento', 'sem rumo',
];

const CONFLITO_STRONG = [
  'dividida', 'em conflito', 'não sabe', 'entre uma coisa e outra',
  'ambivalente', 'rasgada', 'dois lados',
];

function countMarkers(text: string, markers: string[]): number {
  const lower = text.toLowerCase();
  return markers.reduce((count, m) => count + (lower.includes(m) ? 1 : 0), 0);
}

function hasStrongMarker(text: string, strongMarkers: string[]): boolean {
  const lower = text.toLowerCase();
  return strongMarkers.some(m => lower.includes(m));
}

function detectRepeticaoFrases(text: string): boolean {
  const frases = text.split(/[.!?\n]+/).map(f => f.trim().toLowerCase()).filter(f => f.length > 10);
  if (frases.length < 3) return false;
  const unique = new Set(frases);
  return unique.size < frases.length * 0.7;
}

// ========================================
// DERIVAÇÃO PRINCIPAL
// ========================================

export function deriveSessionUpdate(
  checkinTexto: string,
  anotacoes: string,
  currentRisco: NivelRisco,
): SessionUpdateResult {
  const combined = `${checkinTexto} ${anotacoes}`;
  
  // Lowered minimum text to catch brief but critical observations
  if (combined.trim().length < 10) {
    return { padrao: null, estado_campo_override: null, direcao_override: null, risco_override: null, micro_mensagem: null };
  }

  // Score each pattern
  const scores = {
    repeticao: countMarkers(combined, REPETICAO_MARKERS) + (detectRepeticaoFrases(combined) ? 3 : 0),
    racionalizacao: countMarkers(combined, RACIONALIZACAO_MARKERS),
    conflito: countMarkers(combined, CONFLITO_MARKERS),
    desorganizacao: countMarkers(combined, DESORGANIZACAO_MARKERS),
  };

  // Dynamic thresholds: strong markers lower the bar to 1
  const thresholds: Record<string, number> = {
    repeticao: 2, // keep high — needs recurrence
    racionalizacao: 2,
    conflito: hasStrongMarker(combined, CONFLITO_STRONG) ? 1 : 2,
    desorganizacao: hasStrongMarker(combined, DESORGANIZACAO_STRONG) ? 1 : 2,
  };

  let padrao: PadraoDetectado = null;
  let maxScore = 0;

  for (const [key, score] of Object.entries(scores)) {
    const th = thresholds[key] ?? 2;
    if (score >= th && score > maxScore) {
      maxScore = score;
      padrao = key as PadraoDetectado;
    }
  }

  if (!padrao) {
    return { padrao: null, estado_campo_override: null, direcao_override: null, risco_override: null, micro_mensagem: null };
  }

  // Derive soft updates based on pattern + current risk
  return deriveUpdatesForPattern(padrao, currentRisco, maxScore);
}

function deriveUpdatesForPattern(
  padrao: PadraoDetectado,
  currentRisco: NivelRisco,
  intensity: number,
): SessionUpdateResult {
  const riscoElevado = currentRisco === 'elevado';

  switch (padrao) {
    case 'repeticao':
      return {
        padrao,
        estado_campo_override: 'repeticao_de_padrao',
        direcao_override: riscoElevado ? 'espelho_contencao' : 'espelho',
        risco_override: intensity >= 4 ? escalateRisco(currentRisco) : null,
        micro_mensagem: riscoElevado
          ? 'Permaneça mais — sustente sem aprofundar'
          : 'Padrão se repetindo — espelhe, não interprete',
      };

    case 'racionalizacao':
      return {
        padrao,
        estado_campo_override: 'excesso_de_mente',
        direcao_override: riscoElevado ? 'contencao' : 'dialogo',
        risco_override: null,
        micro_mensagem: 'Ainda não intervenha — ela está racionalizando',
      };

    case 'conflito':
      return {
        padrao,
        estado_campo_override: 'divisao_interna',
        direcao_override: riscoElevado ? 'contencao' : 'sustentacao',
        risco_override: intensity >= 4 ? escalateRisco(currentRisco) : null,
        micro_mensagem: 'Ela está organizando — sustente a tensão',
      };

    case 'desorganizacao':
      return {
        padrao,
        estado_campo_override: 'desorganizacao_leve',
        direcao_override: 'contencao',
        risco_override: intensity >= 3 ? escalateRisco(currentRisco) : null,
        micro_mensagem: riscoElevado
          ? 'Contenha — não abra mais campo agora'
          : 'Ela está se desorganizando — reduza estímulos',
      };

    default:
      return {
        padrao: null,
        estado_campo_override: null,
        direcao_override: null,
        risco_override: null,
        micro_mensagem: null,
      };
  }
}

function escalateRisco(current: NivelRisco): NivelRisco | null {
  if (current === 'baixo') return 'moderado';
  if (current === 'moderado') return 'elevado';
  return null; // already elevated
}
