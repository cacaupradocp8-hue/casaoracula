import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { VisitorRoomScreen } from '@/components/onboarding/VisitorRoomScreen';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

/**
 * SalaDaVisitante - The permanent home for visitors
 * 
 * This page is the central hub for all visitors. After completing the 
 * initial onboarding (selecting archetype), visitors are directed here
 * and this becomes their HOME.
 * 
 * Contains:
 * - Quiz Oracular (inline)
 * - Voz Revelada (inline chat)
 * - Espaço de Silêncio
 * - CTA to become resident (/planos)
 */
export default function SalaDaVisitante() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    onboardingCompleted, 
    entryArchetype,
    isLoading: onboardingLoading,
    error: onboardingError,
    refetch,
  } = useOnboarding();

  // If user has upgraded beyond visitor, redirect to dashboard
  useEffect(() => {
    if (!onboardingLoading && user) {
      // If user is NOT a visitor anymore, they should go to dashboard
      if (user.portal !== 'visitante' && user.portal !== 'admin') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [onboardingLoading, user, navigate]);

  // Handler for "Become Resident" - goes to plans page
  const handleBecomeResident = () => {
    navigate('/planos');
  };

  // Handler for "Continue as Visitor" - stays on this page
  const handleContinueAsVisitor = () => {
    // Already on the visitor room, just stay here
    // Could show a toast or do nothing
  };

  // Loading state
  if (onboardingLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Preparando sua entrada...</p>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (onboardingError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <p className="text-destructive text-sm">{onboardingError}</p>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <VisitorRoomScreen
      onBecomeResident={handleBecomeResident}
      onContinueAsVisitor={handleContinueAsVisitor}
      isLoading={false}
    />
  );
}
