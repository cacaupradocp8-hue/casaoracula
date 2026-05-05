import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ClubeSlide {
  id: string;
  estacao_id: string | null;
  rota_slug: string | null;
  titulo: string | null;
  subtitulo: string | null;
  texto: string | null;
  ordem: number;
  icone: string | null;
  status: 'rascunho' | 'publicado';
}

export const useClubeCarrosselSlides = (context?: { estacao_id?: string; rota_slug?: string }) => {
  return useQuery({
    queryKey: ['clube-carrossel-slides', context],
    queryFn: async () => {
      let query = supabase
        .from('clube_carrossel_slides')
        .select('*')
        .eq('status', 'publicado')
        .order('ordem', { ascending: true });

      if (context?.rota_slug) {
        query = query.eq('rota_slug', context.rota_slug);
      } else if (context?.estacao_id) {
        query = query.eq('estacao_id', context.estacao_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ClubeSlide[];
    },
  });
};
