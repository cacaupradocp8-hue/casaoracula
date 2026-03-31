import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TrainingProgressData {
  nivel_atual: string | null;
  casos_concluidos: number;
  ultimo_case_id: string | null;
}

interface AttemptStatus {
  case_id: string;
  status: string;
}

export function useTrainingProgress() {
  const { user } = useAuth();

  const progressQuery = useQuery({
    queryKey: ['training-progress', user?.id],
    queryFn: async (): Promise<TrainingProgressData | null> => {
      if (!user) return null;
      const { data } = await supabase
        .from('co_training_progress')
        .select('nivel_atual, casos_concluidos, ultimo_case_id')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const attemptsQuery = useQuery({
    queryKey: ['training-attempts', user?.id],
    queryFn: async (): Promise<AttemptStatus[]> => {
      if (!user) return [];
      const { data } = await supabase
        .from('co_training_attempts')
        .select('case_id, status')
        .eq('user_id', user.id);
      return (data || []) as AttemptStatus[];
    },
    enabled: !!user,
  });

  const getCaseStatus = (caseId: string): 'nao_iniciado' | 'em_andamento' | 'concluido' => {
    const attempts = attemptsQuery.data || [];
    const caseAttempts = attempts.filter(a => a.case_id === caseId);
    if (caseAttempts.length === 0) return 'nao_iniciado';
    if (caseAttempts.some(a => a.status === 'concluido')) return 'concluido';
    return 'em_andamento';
  };

  return {
    progress: progressQuery.data,
    isLoading: progressQuery.isLoading || attemptsQuery.isLoading,
    getCaseStatus,
    completedCount: attemptsQuery.data?.filter(a => a.status === 'concluido')
      .reduce((acc, a) => { acc.add(a.case_id); return acc; }, new Set<string>()).size || 0,
  };
}
