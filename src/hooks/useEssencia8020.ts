import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Essencia8020 {
  id: string;
  book_id: string;
  nucleo_vivo: string | null;
  tensao_central: string | null;
  imagem_organizadora: string | null;
  aplicacao_terapeutica: string | null;
  distorcao_comum: string | null;
  resumo_premium: string | null;
  perguntas_clinicas: string[] | null;
  riscos_eticos: string | null;
  exercicio: string | null;
}

export function useEssencia8020(bookId: string | undefined) {
  return useQuery({
    queryKey: ['essencia-8020', bookId],
    enabled: !!bookId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_obras_essencia_8020')
        .select('*')
        .eq('book_id', bookId!)
        .maybeSingle();
      
      if (error) throw error;
      return data as Essencia8020 | null;
    },
  });
}
