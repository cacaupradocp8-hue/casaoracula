import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding, ArchetypeType } from '@/hooks/useOnboarding';
import { CallScreen } from '@/components/onboarding/CallScreen';
import { KeyDeliveryScreen } from '@/components/onboarding/KeyDeliveryScreen';
import { VisitorRoomScreen } from '@/components/onboarding/VisitorRoomScreen';
import { RiteOfPassageModal } from '@/components/onboarding/RiteOfPassageModal';
import { supabase } from '@/integrations/supabase/client';

type OnboardingStep = 'call' | 'key' | 'visitor_room' | 'rite';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, refreshUserPortal } = useAuth();
  const { 
    entryArchetype, 
    onboardingCompleted, 
    isLoading: onboardingLoading,
    saveArchetype,
    completeOnboarding,
  } = useOnboarding();

  const [step, setStep] = useState<OnboardingStep>('call');
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRiteModal, setShowRiteModal] = useState(false);

  // Check if user already completed onboarding
  useEffect(() => {
    if (!onboardingLoading && onboardingCompleted) {
      navigate('/dashboard', { replace: true });
    }
  }, [onboardingLoading, onboardingCompleted, navigate]);

  // Check if user already has an archetype (resuming onboarding)
  useEffect(() => {
    if (!onboardingLoading && entryArchetype && !onboardingCompleted) {
      setSelectedArchetype(entryArchetype);
      // If they have an archetype, go to visitor room (they already saw the key)
      setStep('visitor_room');
    }
  }, [onboardingLoading, entryArchetype, onboardingCompleted]);

  const handleSelectArchetype = async (archetype: ArchetypeType) => {
    setIsProcessing(true);
    const success = await saveArchetype(archetype);
    setIsProcessing(false);

    if (success) {
      setSelectedArchetype(archetype);
      setStep('key');
    }
  };

  const handleKeyReceived = () => {
    setStep('visitor_room');
  };

  const handleBecomeResident = () => {
    setShowRiteModal(true);
  };

  const handleContinueAsVisitor = async () => {
    setIsProcessing(true);
    
    // Mark onboarding as complete but keep as visitante
    await completeOnboarding();
    
    navigate('/dashboard', { replace: true });
  };

  const handleAcceptRite = async () => {
    setIsProcessing(true);

    try {
      // Update user portal to initiated (pre_iniciada)
      if (user) {
        const { error } = await supabase
          .from('user_roles')
          .upsert({
            user_id: user.id,
            portal: 'pre_iniciada',
          }, {
            onConflict: 'user_id',
          });

        if (error) throw error;

        // Refresh portal in context
        await refreshUserPortal();
      }

      // Mark onboarding as complete
      await completeOnboarding();

      setShowRiteModal(false);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error accepting rite:', error);
      setIsProcessing(false);
    }
  };

  const handleDeclineRite = async () => {
    setShowRiteModal(false);
    // They can stay in visitor room and try again later
  };

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
