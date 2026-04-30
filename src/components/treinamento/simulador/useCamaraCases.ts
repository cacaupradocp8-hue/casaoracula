import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CamaraCase {
  id: string;
  titulo: string;
  idade: number | null;
  contexto: string | null;
  fala_inicial: string | null;
  distrito_dominante: string | null;
  torre_provavel: string | null;
  erro_comum: string | null;
  pergunta_ideal: string | null;
  leitura_simbolica: string | null;
  resposta_correta: string | null;
  dificuldade: 'iniciante' | 'intermediario' | 'avancado' | string;
  tipo_cliente: string | null;
  tema_emocional: string | null;
  ativo: boolean;
  ciclo_id: string | null;
  created_at: string;
}

async function fetchCamaraCases(cicloId?: string): Promise<CamaraCase[]> {
  let query = supabase
    .from('co_camara_sussurro_casos')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: false });

  if (cicloId) {
    query = query.eq('ciclo_id', cicloId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export function useCamaraCases(cicloId?: string) {
  return useQuery({
    queryKey: ['camara-cases', cicloId],
    queryFn: () => fetchCamaraCases(cicloId),
    staleTime: 5 * 60 * 1000,
  });
}