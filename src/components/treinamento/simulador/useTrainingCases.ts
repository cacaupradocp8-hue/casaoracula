import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TrainingCase, TrainingCaseSignal, TrainingCaseFeedback, TrainingCaseReading } from './types';

export function useTrainingCases() {
  const [cases, setCases] = useState<TrainingCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Fetch cases
      const { data: casesData, error: casesErr } = await supabase
        .from('co_training_cases')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (casesErr) {
        console.error(casesErr);
        toast.error('Erro ao carregar casos');
        setLoading(false);
        return;
      }

      if (!casesData || casesData.length === 0) {
        setCases([]);
        setLoading(false);
        return;
      }

      const caseIds = casesData.map(c => c.id);

      // Fetch related data in parallel
      const [signalsRes, readingsRes, feedbacksRes] = await Promise.all([
        supabase.from('co_training_case_signals').select('*').in('case_id', caseIds).order('ordem'),
        supabase.from('co_training_case_possible_readings').select('*').in('case_id', caseIds),
        supabase.from('co_training_case_feedbacks').select('*').in('case_id', caseIds),
      ]);

      const signals = (signalsRes.data || []) as TrainingCaseSignal[];
      const readings = (readingsRes.data || []) as TrainingCaseReading[];
      const feedbacks = (feedbacksRes.data || []) as TrainingCaseFeedback[];

      const enriched: TrainingCase[] = casesData.map(c => ({
        ...c,
        nivel: c.nivel as TrainingCase['nivel'],
        signals: signals.filter(s => s.case_id === c.id),
        readings: readings.filter(r => r.case_id === c.id),
        feedbacks: feedbacks.filter(f => f.case_id === c.id),
      }));

      setCases(enriched);
      setLoading(false);
    }

    load();
  }, []);

  return { cases, loading };
}
