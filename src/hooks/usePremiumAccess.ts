import { useEffectivePortal } from './useEffectivePortal';

/**
 * Hook that determines if the current user has premium access.
 * Premium = any portal level above 'visitante' (aluna, oracula, assinante, admin).
 * Free = visitante or unauthenticated.
 */
export function usePremiumAccess() {
  const { effectivePortal, isAdmin, canAccess } = useEffectivePortal();

  const isPremium = canAccess('aluna');
  const isFree = !isPremium;

  return {
    isPremium,
    isFree,
    effectivePortal,
    isAdmin,
  };
}
