import { useCallback } from 'react';
import { trackLearningEvent, ContextArea, ActionType, ObjectType } from '@/services/studentTrackingService';

/**
 * Hook para registrar eventos de aprendizagem de forma declarativa.
 */
export function useStudentTracking() {
  const track = useCallback((
    contextArea: ContextArea,
    actionType: ActionType,
    objectType?: ObjectType,
    objectId?: string,
    metadata?: Record<string, unknown>
  ) => {
    // Fire-and-forget
    trackLearningEvent({ contextArea, actionType, objectType, objectId, metadata });
  }, []);

  return { track };
}
