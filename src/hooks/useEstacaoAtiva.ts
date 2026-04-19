import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ================================================
// useEstacaoAtiva — Fonte única de verdade
// Retorna a estação publicada + ativa mais recente.
// Toda query do Clube de Leitura deve derivar desta.
// ================================================

export interface EstacaoAtiva {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string | null;
  livro_titulo: string;
  livro_autor: string | null;
  livro_capa_url: string | null;
}

export function useEstacaoAtiva() {
  return useQuery({
    queryKey: ['estacao-ativa'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('id, numero, titulo, subtitulo, livro_titulo, livro_autor, livro_capa_url')
        .eq('publicada', true)
        .eq('ativa', true)
        .order('numero', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as EstacaoAtiva | null;
    },
    staleTime: 60_000,
  });
}
