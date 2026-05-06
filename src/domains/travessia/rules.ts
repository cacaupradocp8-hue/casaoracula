/**
 * Regras de negócio puras para o domínio de Travessia.
 * Isoladas de efeitos colaterais ou hooks do React.
 */

import { TravessiaEvent, TravessiaState } from './types';

export const canUnlockRoute = (state: TravessiaState, routeId: string): boolean => {
  // Implementação futura das regras de desbloqueio
  return state.unlockedRoutes.includes(routeId);
};

export const isStepCompleted = (state: TravessiaState, stepId: string): boolean => {
  return state.completedSteps.includes(stepId);
};

export const calculateNextStep = (state: TravessiaState, currentEvent: TravessiaEvent): string | null => {
  // Lógica para determinar o próximo passo baseado no evento
  return null;
};
