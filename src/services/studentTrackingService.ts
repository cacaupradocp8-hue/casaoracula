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
  | 'entered_cycle'
  | 'opened_lesson'
  | 'requested_practice'
  | 'requested_reflection'
  | 'requested_audio'
  | 'opened_case'
  | 'submitted_response'
  | 'repeated_case'
  | 'received_feedback'
  | 'created_entry'
  | 'returned'
  | 'shared_to_canteiro'
  | 'revoked_canteiro';

export type ObjectType =
  | 'livro'
  | 'ciclo'
  | 'estacao'
  | 'pratica'
  | 'audio'
  | 'aula'
  | 'modulo'
  | 'ferramenta'
  | 'converse_com_livro'
  | 'sala_treinamento'
  | 'caso_treinamento'
  | 'jardim_psique'
  | 'registro_jardim';

interface TrackEventParams {
  /** If provided, skips the supabase.auth.getUser() call */
  userId?: string;
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
    let uid = params.userId;
    if (!uid) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      uid = user.id;
    }

    await supabase.from('student_learning_events').insert([{
      user_id: uid,
      context_area: params.contextArea,
      action_type: params.actionType,
      object_type: params.objectType || null,
      object_id: params.objectId || null,
      metadata_short: (params.metadata || {}) as any,
    }]);
  } catch (err) {
    console.warn('[StudentTracking] Failed to track event:', err);
  }
}
