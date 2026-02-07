import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProfileSelectionStep, ProfileTag } from './ProfileSelectionStep';
import { WaitingListStep } from './WaitingListStep';

interface ProfessionalOnboardingProps {
  onComplete: () => void;
  onWaitingList?: () => void;
}

type Step = 'profile' | 'waiting-list';

/**
 * ProfessionalOnboarding - Fluxo de entrada para novos usuários
 * 
 * Estrutura:
 * 1. Seleção de perfil (3 opções com tags)
 * 2. Convite opcional para lista de espera
 * 3. Continua para próxima etapa (sempre)
 * 
 * Nenhuma opção bloqueia — todas seguem adiante.
 */
export function ProfessionalOnboarding({ onComplete, onWaitingList }: ProfessionalOnboardingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('profile');
  const [selectedTag, setSelectedTag] = useState<ProfileTag | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save profile tag to database
  const saveProfileTag = async (tag: ProfileTag) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ entry_archetype: tag })
        .eq('id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving profile tag:', error);
      return false;
    }
  };

  // Handle profile selection
  const handleProfileSelect = async (tag: ProfileTag) => {
    setSelectedTag(tag);
    await saveProfileTag(tag);
    setStep('waiting-list');
  };

  // Handle waiting list acceptance
  const handleAcceptWaitingList = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Add to waiting list with specific tag
      const { error } = await supabase
        .from('lista_espera')
        .upsert({
          user_id: user.id,
          email: user.email,
          nome: user.name,
          interesse: 'lista_espera_eventos',
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: 'Você está na lista!',
        description: 'Avisaremos quando houver eventos ou novos ciclos.',
      });

      onComplete();
    } catch (error: any) {
      console.error('Error joining waiting list:', error);
      toast({
        title: 'Erro ao entrar na lista',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle skip waiting list
  const handleSkipWaitingList = () => {
    onComplete();
  };

  // Render current step
  if (step === 'profile') {
    return <ProfileSelectionStep onSelect={handleProfileSelect} />;
  }

  return (
    <WaitingListStep
      onAccept={handleAcceptWaitingList}
      onSkip={handleSkipWaitingList}
      isLoading={isSubmitting}
    />
  );
}
