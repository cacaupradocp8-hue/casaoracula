import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// ─────────────────────────────────────────────────────────────
// useLabOracular — Laboratório Oracular (3 fases)
// Origem: estação (season_id) OU livro do acervo (book_id).
// Reaproveita as tabelas season_labs (config autoral) e
// lab_8020_progress (progresso da usuária).
// ─────────────────────────────────────────────────────────────

export type LabOrigem =
  | { kind: 'season'; seasonId: string }
  | { kind: 'book'; bookId: string };

export interface LabOracularProgress {
  id: string;
  user_id: string;
  season_id: string | null;
  book_id: string | null;

  // Fase 1 — Cartografia
  cart_torre: string | null;
  cart_porta: string | null;
  cart_labirinto: string | null;
  cart_distrito: string | null;
  cart_arquetipos: string[] | null;
  cart_observacoes: string | null;
  cart_analise_ia: any | null;
  cart_status: 'not_started' | 'in_progress' | 'completed';

  // Fase 2 — Espelho Clínico
  esp_onde_ve: string | null;
  esp_manifestacao: string | null;
  esp_risco: string | null;
  esp_nao_fazer: string | null;
  esp_categorias_selecionadas: string[] | null;
  esp_analise_ia: any | null;
  esp_status: 'not_started' | 'in_progress' | 'completed';

  // Fase 3 — Forja Narrativa
  forja_objetivo: string | null;
  forja_estrategia: string | null;
  forja_perguntas: string | null;
  forja_intervencao: string | null;
  forja_fechamento: string | null;
  forja_riscos: string | null;
  forja_respostas_cliente: string | null;
  forja_ajustes_rota: string | null;
  forja_plano_ia: any | null;
  forja_status: 'not_started' | 'in_progress' | 'completed';

  concluido: boolean;
  concluido_em: string | null;
}

function originFilter(origem: LabOrigem) {
  return origem.kind === 'season'
    ? { col: 'season_id' as const, val: origem.seasonId }
    : { col: 'book_id' as const, val: origem.bookId };
}

export function useLabOracularConfig(origem: LabOrigem | null) {
  return useQuery({
    queryKey: ['lab-oracular-config', origem],
    enabled: !!origem,
    queryFn: async () => {
      if (!origem) return null;
      // Config autoral: vem de season_labs. Para origem 'book',
      // tentamos achar uma season ligada ao livro (season_books) — opcional.
      if (origem.kind === 'season') {
        const { data, error } = await supabase
          .from('season_labs')
          .select('*')
          .eq('season_id', origem.seasonId)
          .maybeSingle();
        if (error) throw error;
        return data;
      }
      const { data: link } = await supabase
        .from('season_books')
        .select('season_id')
        .eq('book_id', origem.bookId)
        .maybeSingle();
      if (!link?.season_id) return null;
      const { data, error } = await supabase
        .from('season_labs')
        .select('*')
        .eq('season_id', link.season_id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useLabOracularProgress(origem: LabOrigem | null) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['lab-oracular-progress', origem, user?.id],
    enabled: !!origem && !!user?.id,
    queryFn: async () => {
      if (!origem || !user?.id) return null;
      const f = originFilter(origem);
      const { data, error } = await supabase
        .from('lab_8020_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq(f.col, f.val)
        .maybeSingle();
      if (error) throw error;
      return data as LabOracularProgress | null;
    },
  });
}

export function useSaveLabOracular(origem: LabOrigem | null) {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (patch: Partial<LabOracularProgress>) => {
      if (!user?.id || !origem) throw new Error('Sem origem');
      const f = originFilter(origem);

      // Tenta achar registro existente
      const { data: existing } = await supabase
        .from('lab_8020_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq(f.col, f.val)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await supabase
          .from('lab_8020_progress')
          .update({ ...patch, updated_at: new Date().toISOString() } as any)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const insertRecord: any = {
          user_id: user.id,
          season_id: origem.kind === 'season' ? origem.seasonId : null,
          book_id: origem.kind === 'book' ? origem.bookId : null,
          ...patch,
        };
        const { error } = await supabase
          .from('lab_8020_progress')
          .insert(insertRecord);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lab-oracular-progress'] });
    },
    onError: (e: Error) => {
      toast.error(e.message || 'Falha ao salvar');
    },
  });
}

export type LabIaModo = 'cartografia' | 'espelho' | 'forja';

export async function callLabOracularIa(args: {
  modo: LabIaModo;
  obra: { titulo: string; autor?: string | null };
  contexto_autoral?: any;
  inputs: Record<string, unknown>;
}): Promise<any> {
  const { data, error } = await supabase.functions.invoke('lab-oracular-ia', { body: args });
  if (error) throw error;
  if ((data as any)?.error) throw new Error((data as any).error);
  return (data as any)?.analise;
}
