import { useAuth } from '@/contexts/AuthContext';
import { differenceInMonths, differenceInWeeks, differenceInDays, addMonths } from 'date-fns';

export interface CasaMaquinasAccessResult {
  hasAccess: boolean;
  reason: string;
  /** End-of-trial date (only present when in trial) */
  trialEndsAt?: Date;
  /** Whole months remaining (rounded down) */
  monthsRemaining?: number;
  /** Whole weeks remaining (rounded down) */
  weeksRemaining?: number;
  /** Whole days remaining (rounded down) */
  daysRemaining?: number;
  /** True when within the final 14 days of the trial */
  isExpiringSoon?: boolean;
  /** Friendly Portuguese label like "faltam 3 semanas" or "faltam 5 dias" */
  remainingLabel?: string;
}

const TRIAL_MONTHS = 3;
const SOON_THRESHOLD_DAYS = 14;

function formatRemaining(days: number, weeks: number, months: number): string {
  if (days <= 0) return 'expira hoje';
  if (days === 1) return 'falta 1 dia';
  if (days <= 14) return `faltam ${days} dias`;
  if (weeks === 1) return 'falta 1 semana';
  if (weeks < 8) return `faltam ${weeks} semanas`;
  if (months === 1) return 'falta 1 mês';
  return `faltam ${months} meses`;
}

export function useCasaMaquinasAccess(): CasaMaquinasAccessResult {
  const { user } = useAuth();

  if (!user) return { hasAccess: false, reason: 'unauthenticated' };

  if (user.portal === 'admin' || user.portal === 'assinante') {
    return { hasAccess: true, reason: 'permanent_access' };
  }

  if (user.portal === 'aluna' || user.portal === 'aluna_formacao' || user.portal === 'oracula') {
    const startDate = user.matriculadaAt || user.createdAt;
    const trialEndsAt = addMonths(startDate, TRIAL_MONTHS);
    const now = new Date();

    if (now < trialEndsAt) {
      const daysRemaining = Math.max(0, differenceInDays(trialEndsAt, now));
      const weeksRemaining = Math.max(0, differenceInWeeks(trialEndsAt, now));
      const monthsRemaining = Math.max(0, differenceInMonths(trialEndsAt, now));

      return {
        hasAccess: true,
        reason: 'trial_period',
        trialEndsAt,
        daysRemaining,
        weeksRemaining,
        monthsRemaining,
        isExpiringSoon: daysRemaining <= SOON_THRESHOLD_DAYS,
        remainingLabel: formatRemaining(daysRemaining, weeksRemaining, monthsRemaining),
      };
    }

    return { hasAccess: false, reason: 'trial_expired', trialEndsAt };
  }

  return { hasAccess: false, reason: 'insufficient_portal' };
}
