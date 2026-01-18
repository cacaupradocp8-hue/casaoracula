import { useNavigate } from 'react-router-dom';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { ProfessionalOnboarding } from '@/components/onboarding/ProfessionalOnboarding';
import { useEffect } from 'react';

export default function ConfirmarProfissional() {
  const navigate = useNavigate();
  const { isProfessional, isLoading } = useProfessionalStatus();

  useEffect(() => {
    if (!isLoading && isProfessional) {
      navigate('/ferramentas');
    }
  }, [isProfessional, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <ProfessionalOnboarding
      onComplete={() => navigate('/ferramentas')}
      onWaitingList={() => navigate('/dashboard')}
    />
  );
}
