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

      const bed = data as Record<string, any>;
      let cicloNome: string | null = null;
      if (bed.ciclo_id) {
        const { data: ciclo } = await supabase
          .from('clube_livro_ciclos')
          .select('titulo')
          .eq('id', bed.ciclo_id)
          .maybeSingle();
        cicloNome = ciclo?.titulo || null;
      }

      return {
        id: bed.id,
        season_id: bed.season_id,
        ciclo_id: bed.ciclo_id || null,
        status: bed.status,
        aberto_em: bed.aberto_em,
        encerrado_em: bed.encerrado_em,
        ciclo_nome: cicloNome,
      } as CollectiveBed & { ciclo_nome: string | null };
    },
  });
}
