import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackLearningEvent, ContextArea, ActionType, ObjectType } from '@/services/studentTrackingService';

/**
 * Hook para registrar eventos de aprendizagem de forma declarativa.
 * Resolve o userId uma vez e o repassa ao service, evitando chamadas redundantes.
 */
export function useStudentTracking() {
  const { user } = useAuth();

  const track = useCallback((
    contextArea: ContextArea,
    actionType: ActionType,
    objectType?: ObjectType,
    objectId?: string,
    metadata?: Record<string, unknown>
  ) => {
    trackLearningEvent({ userId: user?.id, contextArea, actionType, objectType, objectId, metadata });
  }, [user?.id]);

  return { track };
}
