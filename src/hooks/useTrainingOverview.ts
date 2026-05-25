import { useState, useCallback, useEffect } from "react";
import * as trainingService from "@/services/trainingService";
import { TrainingProgress, TrainingSubmission } from "@/types/training";

/**
 * HOOK V0.3 - SALA DE TREINAMENTO (Overview)
 * 
 * Finalidade: Agregador de progresso global para a Cidadela.
 * Fornece métricas consolidadas sem exigir uma moduleKey específica.
 */
export function useTrainingOverview() {
  const [progressList, setProgressList] = useState<TrainingProgress[]>([]);
  const [submissions, setSubmissions] = useState<TrainingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Busca paralela para eficiência
      const [pData, sData] = await Promise.all([
        trainingService.listAllProgress(),
        trainingService.listSubmissions()
      ]);
      
      setProgressList(pData);
      setSubmissions(sData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar visão geral de treino.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cálculos derivados
  const stats = {
    modulosIniciados: progressList.filter(p => p.status !== 'not_started').length,
    exerciciosConcluidos: submissions.length,
    proximoTreino: progressList.find(p => p.status === 'in_progress') || null
  };

  return {
    ...stats,
    loading,
    error,
    reload: loadData
  };
}
