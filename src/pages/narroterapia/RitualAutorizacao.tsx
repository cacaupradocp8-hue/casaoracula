import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNarroterapiaAutorizacao } from '@/hooks/useNarroterapiaAutorizacao';
import RitualMovimento1 from '@/components/narroterapia/RitualMovimento1';
import RitualMovimento2 from '@/components/narroterapia/RitualMovimento2';
import RitualMovimento3 from '@/components/narroterapia/RitualMovimento3';
import RitualMovimento4 from '@/components/narroterapia/RitualMovimento4';
import { Loader2 } from 'lucide-react';

export default function RitualAutorizacao() {
  const navigate = useNavigate();
  const {
    isLoading,
    ritualIniciado,
    movimentoAtual,
    autorizado,
    autorizacao,
    completarMovimento1,
    completarMovimento2,
    iniciarPausaMovimento3,
    completarMovimento3,
    selarAutorizacao,
    podeIniciarRitual,
    iniciarRitual,
  } = useNarroterapiaAutorizacao();

  // Se já está autorizado, redireciona para a página principal
  useEffect(() => {
    if (!isLoading && autorizado) {
      navigate('/narroterapia');
    }
  }, [isLoading, autorizado, navigate]);

  // Se não iniciou o ritual e pode iniciar, inicia automaticamente
  useEffect(() => {
    if (!isLoading && !ritualIniciado && podeIniciarRitual) {
      iniciarRitual();
    }
  }, [isLoading, ritualIniciado, podeIniciarRitual, iniciarRitual]);

  // Se não pode iniciar o ritual, volta para a página de narroterapia
  useEffect(() => {
    if (!isLoading && !podeIniciarRitual && !ritualIniciado) {
      navigate('/narroterapia');
    }
  }, [isLoading, podeIniciarRitual, ritualIniciado, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Renderizar o movimento atual
  switch (movimentoAtual) {
    case 1:
      return <RitualMovimento1 onComplete={completarMovimento1} />;
    
    case 2:
      return <RitualMovimento2 onComplete={completarMovimento2} />;
    
    case 3:
      return (
        <RitualMovimento3 
          onIniciarPausa={iniciarPausaMovimento3}
          onComplete={completarMovimento3}
          pausaJaIniciada={!!autorizacao?.movimento_3_pausa_iniciada_em}
        />
      );
    
    case 4:
      return <RitualMovimento4 onSelar={selarAutorizacao} />;
    
    default:
      // Se não há movimento definido (ritual não iniciado ou já completo)
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      );
  }
}
