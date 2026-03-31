import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrainingCase, TrainingCaseSignal, TrainingCaseReading, TrainingCaseFeedback } from './types';

async function fetchTrainingCases(): Promise<TrainingCase[]> {
  const { data: casesData, error } = await supabase
    .from('co_training_cases')
    .select('*')
    .eq('ativo', true)
    .order('ordem');

  if (error) throw error;
  if (!casesData || casesData.length === 0) return [];

  const caseIds = casesData.map(c => c.id);

  const [signalsRes, readingsRes, feedbacksRes] = await Promise.all([
    supabase.from('co_training_case_signals').select('*').in('case_id', caseIds).order('ordem'),
    supabase.from('co_training_case_possible_readings').select('*').in('case_id', caseIds),
    supabase.from('co_training_case_feedbacks').select('*').in('case_id', caseIds),
  ]);

  const signals = (signalsRes.data || []) as TrainingCaseSignal[];
  const readings = (readingsRes.data || []) as TrainingCaseReading[];
  const feedbacks = (feedbacksRes.data || []) as TrainingCaseFeedback[];

  return casesData.map(c => ({
    ...c,
    nivel: c.nivel as TrainingCase['nivel'],
    signals: signals.filter(s => s.case_id === c.id),
    readings: readings.filter(r => r.case_id === c.id),
    feedbacks: feedbacks.filter(f => f.case_id === c.id),
  }));
}

export function useTrainingCases() {
  return useQuery({
    queryKey: ['training-cases'],
    queryFn: fetchTrainingCases,
    staleTime: 5 * 60 * 1000,
  });
}
