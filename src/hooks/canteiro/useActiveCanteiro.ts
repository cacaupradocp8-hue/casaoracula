import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CollectiveBed } from './types';

export type { CollectiveBed };

export function useActiveCanteiro() {
  return useQuery({
    queryKey: ['canteiro-ativo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collective_beds')
        .select('*')
        .eq('status', 'ativo')
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;

      let cicloNome: string | null = null;
      if (data.ciclo_id) {
        const { data: ciclo } = await supabase
          .from('clube_livro_ciclos')
          .select('titulo')
          .eq('id', data.ciclo_id)
          .maybeSingle();
        cicloNome = ciclo?.titulo || null;
      }

      return {
        id: data.id,
        season_id: data.season_id,
        ciclo_id: data.ciclo_id || null,
        status: data.status,
        aberto_em: data.aberto_em,
        encerrado_em: data.encerrado_em,
        ciclo_nome: cicloNome,
      } as CollectiveBed & { ciclo_nome: string | null };
    },
  });
}
