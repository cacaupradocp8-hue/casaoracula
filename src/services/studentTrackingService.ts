import { supabase } from '@/integrations/supabase/client';

export type ContextArea = 'clube' | 'treinamento' | 'biblioteca' | 'jardim-da-psique' | 'formacao';

export type ActionType =
  | 'opened'
  | 'completed'
  | 'asked_question'
  | 'played_audio'
  | 'saved_reflection'
  | 'started_practice'
  | 'finished_practice'
  // Clube do Livro
  | 'entered_cycle'
  | 'opened_lesson'
  // Converse com o Livro
  | 'requested_practice'
  | 'requested_reflection'
  | 'requested_audio'
  // Sala de Treinamento
  | 'opened_case'
  | 'submitted_response'
  | 'repeated_case'
  | 'received_feedback'
  // Jardim da Psique
  | 'created_entry'
  | 'returned';

export type ObjectType =
  | 'livro'
  | 'ciclo'
  | 'estacao'
  | 'pratica'
  | 'audio'
  | 'aula'
  | 'modulo'
  | 'ferramenta'
  // Converse com o Livro
  | 'converse_com_livro'
  // Sala de Treinamento
  | 'sala_treinamento'
  | 'caso_treinamento'
  // Jardim da Psique
  | 'jardim_psique'
  | 'registro_jardim';

interface TrackEventParams {
  contextArea: ContextArea;
  actionType: ActionType;
  objectType?: ObjectType;
  objectId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Registra um evento leve de aprendizagem da aluna.
 * Usa fire-and-forget para não bloquear a UX.
 */
export async function trackLearningEvent(params: TrackEventParams) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('student_learning_events').insert([{
      user_id: user.id,
      context_area: params.contextArea,
      action_type: params.actionType,
      object_type: params.objectType || null,
      object_id: params.objectId || null,
      metadata_short: (params.metadata || {}) as any,
    }]);
  } catch (err) {
    // Silently fail — tracking should never break UX
    console.warn('[StudentTracking] Failed to track event:', err);
  }
}
