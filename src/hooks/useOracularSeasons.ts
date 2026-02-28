import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OracularSeason {
  id: string;
  nome_estacao: string;
  simbolo: string | null;
  periodo: string | null;
  foco_travessia: string | null;
  aplicacao_profissional: string | null;
  ordem: number;
}

export interface SeasonBook {
  id: string;
  season_id: string;
  book_id: string;
  tipo: 'eixo' | 'satelite';
  ciclo?: {
    id: string;
    titulo: string;
    autor_livro: string | null;
    capa_url: string | null;
    publicado: boolean;
  };
}

export function useOracularSeasons() {
  return useQuery({
    queryKey: ['oracular-seasons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oracular_seasons')
        .select('*')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as OracularSeason[];
    },
  });
}

export function useSeasonBooks() {
  return useQuery({
    queryKey: ['season-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('season_books')
        .select(`
          id, season_id, book_id, tipo,
          ciclo:clube_livro_ciclos!book_id (id, titulo, autor_livro, capa_url, publicado)
        `)
        .order('tipo', { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as SeasonBook[];
    },
  });
}

export function useSeasonForBook(bookId?: string) {
  const { data: seasonBooks } = useSeasonBooks();
  const { data: seasons } = useOracularSeasons();

  if (!bookId || !seasonBooks || !seasons) return null;

  const link = seasonBooks.find(sb => sb.book_id === bookId);
  if (!link) return null;

  return seasons.find(s => s.id === link.season_id) || null;
}
