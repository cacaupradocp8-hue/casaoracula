import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding, ArchetypeType } from '@/hooks/useOnboarding';
import { CallScreen } from '@/components/onboarding/CallScreen';
import { KeyDeliveryScreen } from '@/components/onboarding/KeyDeliveryScreen';
import { VisitorRoomScreen } from '@/components/onboarding/VisitorRoomScreen';
import { RiteOfPassageModal } from '@/components/onboarding/RiteOfPassageModal';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

type OnboardingStep = 'call' | 'key' | 'visitor_room' | 'rite';

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
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRiteModal, setShowRiteModal] = useState(false);

  // Compute initial step based on onboarding state - only run once when data is loaded
  const initialStep = useMemo<OnboardingStep>(() => {
    if (onboardingLoading) return 'call';
    if (entryArchetype && !onboardingCompleted) return 'visitor_room';
    return 'call';
  }, [onboardingLoading, entryArchetype, onboardingCompleted]);

  // Set initial step and archetype when data loads
  useEffect(() => {
    if (onboardingLoading) return;
    
    // If already completed onboarding, redirect to Sala da Visitante (visitor home)
    // NOT to /welcome or /dashboard - visitors stay in the visitor room
    if (onboardingCompleted) {
      navigate('/sala-da-visitante', { replace: true });
      return;
    }

    // Set initial state based on saved progress
    if (entryArchetype) {
      setSelectedArchetype(entryArchetype);
      setStep('visitor_room');
    }
  }, [onboardingLoading, onboardingCompleted, entryArchetype, navigate]);

  const handleSelectArchetype = useCallback(async (archetype: ArchetypeType) => {
    setIsProcessing(true);
    const success = await saveArchetype(archetype);
    setIsProcessing(false);

    if (success) {
      setSelectedArchetype(archetype);
      setStep('key');
    }
  }, [saveArchetype]);

  const handleKeyReceived = useCallback(() => {
    setStep('visitor_room');
  }, []);

  const handleBecomeResident = useCallback(() => {
    setShowRiteModal(true);
  }, []);

  const handleContinueAsVisitor = useCallback(async () => {
    setIsProcessing(true);
    
    // Mark onboarding as complete but keep as visitante
    await completeOnboarding();
    
    // Go to Sala da Visitante - this is the visitor's HOME
    // NOT /welcome or /dashboard - the visitor room IS the home
    navigate('/sala-da-visitante', { replace: true });
  }, [completeOnboarding, navigate]);

  const handleAcceptRite = useCallback(() => {
    // Redirect to plans page - the actual portal upgrade happens after purchase
    setShowRiteModal(false);
    navigate('/planos');
  }, [navigate]);

  const handleDeclineRite = useCallback(() => {
    setShowRiteModal(false);
    // They can stay in visitor room and try again later
  }, []);

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
    <>
      {step === 'call' && (
        <CallScreen
          onSelectArchetype={handleSelectArchetype}
          isLoading={isProcessing}
        />
      )}

      {step === 'key' && selectedArchetype && (
        <KeyDeliveryScreen
          archetype={selectedArchetype}
          onContinue={handleKeyReceived}
        />
      )}

      {step === 'visitor_room' && (
        <VisitorRoomScreen
          onBecomeResident={handleBecomeResident}
          onContinueAsVisitor={handleContinueAsVisitor}
          isLoading={isProcessing}
        />
      )}

      <RiteOfPassageModal
        open={showRiteModal}
        onAccept={handleAcceptRite}
        onDecline={handleDeclineRite}
        isLoading={isProcessing}
      />
    </>
  );
}
