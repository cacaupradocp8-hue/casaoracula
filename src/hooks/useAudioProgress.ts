// ============================================
// AUDIO PROGRESS HOOK
// Tracks listening position and completion
// Uses clube_livro_escuta_progress table
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCallback, useRef } from 'react';

interface EscutaProgress {
  id: string;
  escuta_id: string;
  user_id: string;
  posicao_segundos: number;
  concluido: boolean;
  updated_at: string;
}

/**
 * Hook for tracking audio listening progress.
 * Auto-saves position every 10s and marks >90% as completed.
 */
export function useAudioProgress(escutaIds: string[]) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const lastSavedRef = useRef<number>(0);

  const { data: progressMap, isLoading } = useQuery({
    queryKey: ['escuta-progress', user?.id, escutaIds],
    queryFn: async () => {
      if (!user?.id || escutaIds.length === 0) return {};
      const { data, error } = await supabase
        .from('clube_livro_escuta_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('escuta_id', escutaIds);
      if (error) throw error;
      const map: Record<string, EscutaProgress> = {};
      (data || []).forEach((p) => { map[p.escuta_id] = p as EscutaProgress; });
      return map;
    },
    enabled: !!user?.id && escutaIds.length > 0,
  });

  const upsertProgress = useMutation({
    mutationFn: async ({ escutaId, posicao, concluido }: { escutaId: string; posicao: number; concluido: boolean }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('clube_livro_escuta_progress')
        .upsert({
          escuta_id: escutaId,
          user_id: user.id,
          posicao_segundos: Math.floor(posicao),
          concluido,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,escuta_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escuta-progress', user?.id] });
    },
  });

  /** Save position (throttled — max every 10s) */
  const savePosition = useCallback((escutaId: string, currentTime: number, duration: number) => {
    const now = Date.now();
    if (now - lastSavedRef.current < 10000) return;
    lastSavedRef.current = now;
    const concluido = duration > 0 && currentTime / duration > 0.9;
    upsertProgress.mutate({ escutaId, posicao: currentTime, concluido });
  }, [upsertProgress]);

  /** Force-save (on pause, track change, or unmount) */
  const forceSave = useCallback((escutaId: string, currentTime: number, duration: number) => {
    lastSavedRef.current = Date.now();
    const concluido = duration > 0 && currentTime / duration > 0.9;
    upsertProgress.mutate({ escutaId, posicao: currentTime, concluido });
  }, [upsertProgress]);

  /** Get saved position for a track */
  const getSavedPosition = useCallback((escutaId: string): number => {
    return progressMap?.[escutaId]?.posicao_segundos || 0;
  }, [progressMap]);

  /** Check if a track is completed */
  const isCompleted = useCallback((escutaId: string): boolean => {
    return progressMap?.[escutaId]?.concluido || false;
  }, [progressMap]);

  return {
    progressMap: progressMap || {},
    isLoading,
    savePosition,
    forceSave,
    getSavedPosition,
    isCompleted,
  };
}
