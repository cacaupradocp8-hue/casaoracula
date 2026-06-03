import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
import { BootLoadingScreen } from '@/components/shared/BootLoadingScreen';

export default function Onboarding() {
  const navigate = useNavigate();
  const { onboardingCompleted, completeOnboarding, entryArchetype, isLoading } = useOnboarding();

  useEffect(() => {
    const handleNeutralizeOnboarding = async () => {
      if (isLoading) return;

      // Se já completou ou se já tem um arquétipo, vai direto pro dashboard
      if (onboardingCompleted || entryArchetype) {
        navigate('/clube', { replace: true });
        return;
      }

      // Caso contrário, completa o onboarding automaticamente e vai pro dashboard
      // Neutralizando o fluxo legado conforme solicitado
      await completeOnboarding();
      navigate('/clube', { replace: true });
    };

    handleNeutralizeOnboarding();
  }, [isLoading, onboardingCompleted, entryArchetype, completeOnboarding, navigate]);

  return <BootLoadingScreen />;
}
