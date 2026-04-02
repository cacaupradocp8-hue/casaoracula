import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SimCase {
  id: string;
  titulo: string;
  descricao: string | null;
  nivel: number;
  tipo: string;
  ativo: boolean;
  ordem: number;
  leitura_mentora: string | null;
  ferramenta_sugerida: string | null;
}

export interface SimStep {
  id: string;
  case_id: string;
  ordem: number;
  situacao_texto: string;
  pergunta: string;
  objetivo_oculto: string | null;
}

export interface SimOption {
  id: string;
  step_id: string;
  texto_opcao: string;
  tipo_resultado: 'correto' | 'erro' | 'parcial';
  feedback_texto: string | null;
  explicacao_simbolica: string | null;
  proximo_step_id: string | null;
  ordem: number;
}

export interface SimProgress {
  id: string;
  user_id: string;
  case_id: string;
  step_id: string;
  escolha_id: string;
  created_at: string;
}

export function useSimCases() {
  return useQuery({
    queryKey: ['sim-cases'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('co_sim_cases')
        .select('*')
        .eq('ativo', true)
        .order('ordem');
      if (error) throw error;
      return data as SimCase[];
    },
  });
}

export function useSimSteps(caseId: string | undefined) {
  return useQuery({
    queryKey: ['sim-steps', caseId],
    queryFn: async () => {
      if (!caseId) return [];
      const { data, error } = await (supabase as any)
        .from('co_sim_steps')
        .select('*')
        .eq('case_id', caseId)
        .order('ordem');
      if (error) throw error;
      return data as SimStep[];
    },
    enabled: !!caseId,
  });
}

export function useSimOptions(stepId: string | undefined) {
  return useQuery({
    queryKey: ['sim-options', stepId],
    queryFn: async () => {
      if (!stepId) return [];
      const { data, error } = await (supabase as any)
        .from('co_sim_options')
        .select('*')
        .eq('step_id', stepId)
        .order('ordem');
      if (error) throw error;
      return data as SimOption[];
    },
    enabled: !!stepId,
  });
}

export function useSimProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['sim-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await (supabase as any)
        .from('co_sim_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');
      if (error) throw error;
      return data as SimProgress[];
    },
    enabled: !!user?.id,
  });
}

export function useSimCaseProgress(caseId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['sim-progress', user?.id, caseId],
    queryFn: async () => {
      if (!user?.id || !caseId) return [];
      const { data, error } = await (supabase as any)
        .from('co_sim_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('case_id', caseId)
        .order('created_at');
      if (error) throw error;
      return data as SimProgress[];
    },
    enabled: !!user?.id && !!caseId,
  });
}

export function useSaveSimChoice() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ caseId, stepId, escolhaId }: { caseId: string; stepId: string; escolhaId: string }) => {
      if (!user?.id) throw new Error('Não autenticada');
      const { error } = await (supabase as any)
        .from('co_sim_progress')
        .insert({ user_id: user.id, case_id: caseId, step_id: stepId, escolha_id: escolhaId });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['sim-progress'] });
    },
  });
}

// Helper: get case status from progress
export function getCaseStatus(progress: SimProgress[], caseId: string, totalSteps: number): 'not_started' | 'in_progress' | 'completed' {
  const caseProgress = progress.filter(p => p.case_id === caseId);
  if (caseProgress.length === 0) return 'not_started';
  if (caseProgress.length >= totalSteps) return 'completed';
  return 'in_progress';
}
