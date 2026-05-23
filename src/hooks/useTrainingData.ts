import { useState, useCallback, useEffect } from "react";
import * as trainingService from "@/services/trainingService";
import { 
  TrainingProgress, 
  TrainingProgressUpdate,
  TrainingSubmission,
  TrainingSubmissionInsert
} from "@/types/training";

/**
 * HOOKS V0.2 - SALA DE TREINAMENTO
 * 
 * Finalidade: Integração React para persistência pedagógica.
 * Estes hooks consomem o trainingService.ts e gerenciam estados de UI.
 * 
 * GUARDRAILS ÉTICOS:
 * 1. Exclusivo para a Sala de Treinamento (Ficção).
 * 2. Dados pedagógicos, não clínicos (Não são prontuários).
 * 3. Sem conexão automática com Atlas ou IA.
 * 4. Isolamento total de dados de clientes reais.
 */

/**
 * Hook para gerenciar o progresso de conclusão de um módulo
 */
export function useTrainingProgress(moduleKey: string) {
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainingService.getModuleProgress(moduleKey);
      setProgress(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar progresso.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [moduleKey]);

  const upsertProgress = useCallback(async (input: Omit<TrainingProgressUpdate, "user_id" | "last_activity_at" | "module_key">) => {
    try {
      setLoading(true);
      setError(null);
      // Injeta o module_key automaticamente para segurança
      const updated = await trainingService.upsertProgress({
        ...input,
        module_key: moduleKey,
        module_title: progress?.module_title || moduleKey // Mantém o título se já existir
      } as any);
      setProgress(updated);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar progresso.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [moduleKey, progress]);

  // Atalhos semânticos para UI
  const markStarted = useCallback(() => upsertProgress({ status: "in_progress", started_at: new Date().toISOString() }), [upsertProgress]);
  const markCompleted = useCallback(() => upsertProgress({ status: "completed", completed_at: new Date().toISOString(), progress_percentage: 100 }), [upsertProgress]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    loading,
    error,
    reload: loadProgress,
    upsertProgress,
    markStarted,
    markCompleted
  };
}

/**
 * Hook para gerenciar submissões/respostas de exercícios simulados
 */
export function useTrainingSubmissions(moduleKey?: string) {
  const [submissions, setSubmissions] = useState<TrainingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainingService.listSubmissions(moduleKey);
      setSubmissions(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar submissões.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [moduleKey]);

  const submitExercise = useCallback(async (input: Omit<TrainingSubmissionInsert, "user_id" | "is_fictional" | "is_archived" | "submitted_at">) => {
    try {
      setLoading(true);
      setError(null);
      const newSubmission = await trainingService.submitExercise(input);
      setSubmissions(prev => [newSubmission, ...prev]);
      return newSubmission;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao enviar resposta.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const archiveSubmission = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await trainingService.archiveSubmission(id);
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao arquivar submissão.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  return {
    submissions,
    loading,
    error,
    reload: loadSubmissions,
    submitExercise,
    archiveSubmission
  };
}
