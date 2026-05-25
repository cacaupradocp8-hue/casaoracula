import { supabase } from "@/integrations/supabase/client";
import { 
  TrainingProgress, 
  TrainingProgressInsert, 
  TrainingProgressUpdate,
  TrainingSubmission,
  TrainingSubmissionInsert
} from "@/types/training";

/**
 * TRAINING SERVICE V0.2 - SALA DE TREINAMENTO
 * 
 * Finalidade: Camada de persistência pedagógica para a Sala de Treinamento.
 * 
 * GUARDRAILS ÉTICOS:
 * 1. Exclusivo para treino pedagógico e simulações.
 * 2. Dados não são prontuários e casos são fictícios.
 * 3. Proibido guardar dados de clientes reais ou diagnósticos.
 * 4. Sem integração automática com Atlas ou IA Syntheia.
 * 5. Remoção de dados via arquivamento lógico (is_archived).
 */

/**
 * Erros customizados para o serviço de treinamento
 */
export const TRAINING_ERRORS = {
  AUTH_REQUIRED: "Usuária deve estar autenticada para acessar a persistência pedagógica.",
  VALIDATION_FAILED: "Dados fornecidos são inválidos ou violam guardrails éticos.",
  PERMISSION_DENIED: "Permissão negada via políticas de segurança (RLS).",
  FICTIONAL_ONLY: "Apenas dados marcados como fictícios (is_fictional: true) são permitidos.",
  UNKNOWN: "Ocorreu um erro inesperado na persistência pedagógica."
};

/**
 * Obtém o ID da usuária autenticada de forma segura
 */
async function getAuthenticatedUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error(TRAINING_ERRORS.AUTH_REQUIRED);
  return user.id;
}

/**
 * Carrega o progresso de um módulo específico para a usuária atual
 */
export async function getModuleProgress(moduleKey: string): Promise<TrainingProgress | null> {
  try {
    const userId = await getAuthenticatedUserId();
    
    const { data, error } = await supabase
      .from('training_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_key', moduleKey)
      .maybeSingle();

    if (error) throw error;
    return data as TrainingProgress | null;
  } catch (error) {
    console.error(`[TrainingService] Erro ao buscar progresso do módulo ${moduleKey}:`, error);
    throw error;
  }
}

/**
 * Lista todo o progresso de treinamento da usuária
 */
export async function listAllProgress(): Promise<TrainingProgress[]> {
  try {
    const userId = await getAuthenticatedUserId();
    
    const { data, error } = await supabase
      .from('training_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_activity_at', { ascending: false });

    if (error) throw error;
    return data as TrainingProgress[];
  } catch (error) {
    console.error(`[TrainingService] Erro ao listar todo o progresso:`, error);
    throw error;
  }
}

/**
 * Cria ou atualiza o progresso de um módulo

 * Garante que o user_id venha da sessão autenticada
 */
export async function upsertProgress(
  input: Omit<TrainingProgressInsert, "user_id" | "last_activity_at">
): Promise<TrainingProgress> {
  try {
    const userId = await getAuthenticatedUserId();
    
    const upsertData = {
      ...input,
      user_id: userId,
      last_activity_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('training_progress')
      .upsert(upsertData, { 
        onConflict: 'user_id,module_key' 
      })
      .select()
      .single();

    if (error) throw error;
    return data as TrainingProgress;
  } catch (error) {
    console.error(`[TrainingService] Erro ao salvar progresso:`, error);
    throw error;
  }
}

/**
 * Lista submissões pedagógicas (não arquivadas) da usuária
 */
export async function listSubmissions(moduleKey?: string): Promise<TrainingSubmission[]> {
  try {
    const userId = await getAuthenticatedUserId();
    
    let query = supabase
      .from('training_submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('submitted_at', { ascending: false });

    if (moduleKey) {
      query = query.eq('module_key', moduleKey);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as TrainingSubmission[];
  } catch (error) {
    console.error(`[TrainingService] Erro ao listar submissões:`, error);
    throw error;
  }
}

/**
 * Salva uma nova resposta pedagógica
 * REGRA CRÍTICA: Força is_fictional: true
 */
export async function submitExercise(
  input: Omit<TrainingSubmissionInsert, "user_id" | "is_fictional" | "is_archived" | "submitted_at">
): Promise<TrainingSubmission> {
  try {
    const userId = await getAuthenticatedUserId();
    
    const submissionData = {
      ...input,
      user_id: userId,
      is_fictional: true, // Forçado via service (Guardrail Ético)
      is_archived: false,
      submitted_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('training_submissions')
      .insert(submissionData)
      .select()
      .single();

    if (error) throw error;
    return data as TrainingSubmission;
  } catch (error) {
    console.error(`[TrainingService] Erro ao submeter exercício:`, error);
    throw error;
  }
}

/**
 * Arquiva uma submissão de forma lógica
 * Não permite exclusão física na V0.2
 */
export async function archiveSubmission(submissionId: string): Promise<void> {
  try {
    const userId = await getAuthenticatedUserId();
    
    const { error } = await supabase
      .from('training_submissions')
      .update({ is_archived: true })
      .eq('id', submissionId)
      .eq('user_id', userId); // Reforço de segurança além do RLS

    if (error) throw error;
  } catch (error) {
    console.error(`[TrainingService] Erro ao arquivar submissão ${submissionId}:`, error);
    throw error;
  }
}
