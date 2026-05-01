import { useAuth } from '@/contexts/AuthContext';
import { differenceInMonths } from 'date-fns';

export function useCasaMaquinasAccess() {
  const { user } = useAuth();

  if (!user) return { hasAccess: false, reason: 'unauthenticated' };

  // Admins and subscribers have permanent access
  if (user.portal === 'admin' || user.portal === 'assinante') {
    return { hasAccess: true, reason: 'permanent_access' };
  }

  // Alunas have 3 months of access from their account creation
  if (user.portal === 'aluna' || user.portal === 'aluna_formacao' || user.portal === 'oracula') {
    const monthsSinceCreation = differenceInMonths(new Date(), user.createdAt);
    
    if (monthsSinceCreation < 3) {
      return { 
        hasAccess: true, 
        reason: 'trial_period',
        monthsRemaining: 3 - monthsSinceCreation 
      };
    }
    
    return { hasAccess: false, reason: 'trial_expired' };
  }

  return { hasAccess: false, reason: 'insufficient_portal' };
}
