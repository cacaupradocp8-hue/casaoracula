import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding, ArchetypeType } from '@/hooks/useOnboarding';
import { CallScreen } from '@/components/onboarding/CallScreen';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

// ID da Sala da Visitante no banco de dados
const SALA_VISITANTE_ID = 'be626211-4608-4232-b678-8c3edfac2798';

type OnboardingStep = 'call' | 'complete';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, refreshUserPortal } = useAuth();
  const { 
    entryArchetype, 
    onboardingCompleted, 
    isLoading: onboardingLoading,
    error: onboardingError,
    saveArchetype,
    completeOnboarding,
    refetch,
  } = useOnboarding();

  const [step, setStep] = useState<OnboardingStep>('call');
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if onboarding already completed
  useEffect(() => {
    if (onboardingLoading) return;
    
    // If already completed onboarding, go to dashboard
    if (onboardingCompleted) {
      navigate('/dashboard-membro', { replace: true });
      return;
    }

    // If archetype already saved but not completed, complete and redirect to quiz
    if (entryArchetype) {
      completeOnboarding().then(() => {
        navigate('/quiz/descubra-seu-eixo', { replace: true });
      });
    }
  }, [onboardingLoading, onboardingCompleted, entryArchetype, navigate, completeOnboarding]);

  // After archetype selection, save and go to Quiz da Voz
  const handleSelectArchetype = useCallback(async (archetype: ArchetypeType) => {
    setIsProcessing(true);
    const success = await saveArchetype(archetype);

    if (success) {
      await completeOnboarding();
      navigate('/quiz/descubra-seu-eixo', { replace: true });
    }
    setIsProcessing(false);
  }, [saveArchetype, completeOnboarding, navigate]);

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
    <CallScreen
      onSelectArchetype={handleSelectArchetype}
      isLoading={isProcessing}
    />
  );
}
