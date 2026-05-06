/**
 * Definições de tipos para o domínio de Travessia.
 */

export type TravessiaEvent = 
  | 'audio_started'
  | 'audio_completed'
  | 'card_opened'
  | 'reflection_opened'
  | 'reflection_submitted'
  | 'practice_completed'
  | 'station_completed'
  | 'route_completed'
  | 'manual_unlock';

export interface ProgressEvent {
  type: TravessiaEvent;
  resourceId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TravessiaState {
  currentStep: string;
  completedSteps: string[];
  unlockedRoutes: string[];
}
