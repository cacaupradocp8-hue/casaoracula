import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingCase, RespostaAluna } from './types';
import { toast } from 'sonner';

export interface AvaliacaoIA {
  score_total: number;
  score_distrito: number;
  score_hipotese: number;
  score_ferramenta: number;
  nivel_coerencia: string;
  feedback: {
    leitura_do_padrao: string;
    analise_do_distrito: string;
    analise_da_ferramenta: string;
    erro_comum: string;
    direcao_sugerida: string;
  };
  perfil_simbolico_emergente: {
    padrao_dominante: string;
    estado_atual: string;
    vetor_crescimento: string;
  };
}

export function useAvaliacaoIA() {
  const [avaliacao, setAvaliacao] = useState<AvaliacaoIA | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const avaliar = async (caso: TrainingCase, resposta: RespostaAluna) => {
    setIsLoading(true);
    setAvaliacao(null);

    try {
      const { data, error } = await supabase.functions.invoke('avaliar-treinamento', {
        body: { caso, resposta },
      });

      if (error) {
        console.error('Erro na avaliação IA:', error);
        toast.error('Não foi possível obter avaliação IA. O feedback local será exibido.');
        return null;
      }

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      setAvaliacao(data);
      return data as AvaliacaoIA;
    } catch (e) {
      console.error('Erro inesperado:', e);
      toast.error('Erro ao conectar com avaliação IA.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { avaliacao, isLoading, avaliar, reset: () => setAvaliacao(null) };
}
