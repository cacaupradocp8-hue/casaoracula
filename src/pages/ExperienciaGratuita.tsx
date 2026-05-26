import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BootLoadingScreen } from '@/components/shared/BootLoadingScreen';

export default function ExperienciaGratuita() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona o fluxo antigo para o novo Limiar público
    navigate('/primeira-leitura', { replace: true });
  }, [navigate]);

  return <BootLoadingScreen />;
}

