import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SeasonLab {
  id: string;
  season_id: string;
  // Bloco 1 — Essência Simbólica
  nucleo_vivo: string | null;
  tensao_central: string | null;
  essencia_transformadora: string | null;
  arquetipo_central: string | null;
  imagem_organizadora: string | null;
  transformacao_exigida: string | null;
  // Bloco 2 — Tradução Profissional: Aula
  traducao_aula: string | null;
  aula_objetivo: string | null;
  aula_vivencia: string | null;
  aula_pergunta_fechamento: string | null;
  // Bloco 2 — Tradução Profissional: Sessão
  traducao_sessao: string | null;
  sessao_tema: string | null;
  sessao_pergunta_acesso: string | null;
  sessao_cuidado_etico: string | null;
  sessao_resistencia: string | null;
  // Bloco 2 — Tradução Profissional: Palestra / Círculo
  traducao_circulo: string | null;
  palestra_imagem: string | null;
  palestra_narrativa: string | null;
  palestra_chamada: string | null;
  palestra_encerramento: string | null;
  // Perguntas de aplicação (legacy)
  pergunta_aplicacao_1: string | null;
  pergunta_aplicacao_2: string | null;
}

export interface Lab8020Progress {
  id: string;
  user_id: string;
  season_id: string;
  // Legacy fields
  resposta_1: string | null;
  resposta_2: string | null;
  insight_livre: string | null;
  // Bloco 3 — Aplicação Encarnada
  aplicacao_onde: string | null;
  aplicacao_comportamento: string | null;
  aplicacao_gesto: string | null;
  // Bloco 4 — Registro Vivo
  registro_reflexivo: string | null;
  notas_profissionais: string | null;
  concluido: boolean;
  concluido_em: string | null;
  created_at: string;
  updated_at: string;
}

export function useSeasonLab(seasonId: string | undefined) {
  return useQuery({
    queryKey: ['season-lab', seasonId],
    queryFn: async () => {
      if (!seasonId) return null;
      const { data, error } = await supabase
        .from('season_labs')
        .select('*')
        .eq('season_id', seasonId)
        .maybeSingle();
      if (error) throw error;
      return data as SeasonLab | null;
    },
    enabled: !!seasonId,
  });
}

export function useLabProgress(seasonId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['lab-8020-progress', seasonId, user?.id],
    queryFn: async () => {
      if (!seasonId || !user?.id) return null;
      const { data, error } = await supabase
        .from('lab_8020_progress')
        .select('*')
        .eq('season_id', seasonId)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Lab8020Progress | null;
    },
    enabled: !!seasonId && !!user?.id,
  });
}

export function useAllLabProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['lab-8020-progress-all', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('lab_8020_progress')
        .select('*, oracular_seasons(id, nome_estacao, simbolo, periodo)')
        .eq('user_id', user.id)
        .eq('concluido', true)
        .order('concluido_em', { ascending: false });
      if (error) throw error;
      return data as (Lab8020Progress & {
        oracular_seasons: { id: string; nome_estacao: string; simbolo: string | null; periodo: string | null } | null;
      })[];
    },
    enabled: !!user?.id,
  });
}

export interface SaveLabPayload {
  resposta_1?: string;
  resposta_2?: string;
  insight_livre?: string;
  aplicacao_onde?: string;
  aplicacao_comportamento?: string;
  aplicacao_gesto?: string;
  registro_reflexivo?: string;
  notas_profissionais?: string;
  concluido?: boolean;
}

export function useSaveLabProgress(seasonId: string | undefined) {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveLabPayload) => {
      if (!user?.id || !seasonId) throw new Error('Dados incompletos');

      const record: any = {
        ...payload,
        updated_at: new Date().toISOString(),
      };
      if (payload.concluido) {
        record.concluido_em = new Date().toISOString();
      }

      const { data: existing } = await supabase
        .from('lab_8020_progress')
        .select('id')
        .eq('season_id', seasonId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('lab_8020_progress')
          .update(record)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lab_8020_progress')
          .insert({ user_id: user.id, season_id: seasonId, ...record });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lab-8020-progress', seasonId] });
      qc.invalidateQueries({ queryKey: ['lab-8020-progress-all'] });
      qc.invalidateQueries({ queryKey: ['integracao-8020-record'] });
    },
    onError: () => {
      toast.error('Não foi possível salvar o laboratório.');
    },
  });
}
