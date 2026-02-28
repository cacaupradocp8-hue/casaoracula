// ============================================
// AUDIO PROGRESS HOOK
// Tracks listening position and completion
// Works with clube_audio_tracks via clube_audio_progress
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCallback, useRef } from 'react';

interface AudioProgress {
  id: string;
  track_id: string;
  user_id: string;
  posicao_segundos: number;
  concluido: boolean;
  updated_at: string;
}

/**
 * Hook for tracking audio progress for a list of track IDs.
 * Saves position periodically and marks as completed when >90% listened.
 */
export function useAudioProgress(trackIds: string[]) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const lastSavedRef = useRef<number>(0);

  const { data: progressMap, isLoading } = useQuery({
    queryKey: ['audio-progress', user?.id, trackIds],
    queryFn: async () => {
      if (!user?.id || trackIds.length === 0) return {};
      const { data, error } = await supabase
        .from('clube_audio_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('track_id', trackIds);
      if (error) throw error;
      const map: Record<string, AudioProgress> = {};
      (data || []).forEach((p: AudioProgress) => { map[p.track_id] = p; });
      return map;
    },
    enabled: !!user?.id && trackIds.length > 0,
  });

  const upsertProgress = useMutation({
    mutationFn: async ({ trackId, posicao, concluido }: { trackId: string; posicao: number; concluido: boolean }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('clube_audio_progress')
        .upsert({
          track_id: trackId,
          user_id: user.id,
          posicao_segundos: Math.floor(posicao),
          concluido,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'track_id,user_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audio-progress', user?.id] });
    },
  });

  /**
   * Save current position (throttled — saves at most every 10s)
   */
  const savePosition = useCallback((trackId: string, currentTime: number, duration: number) => {
    const now = Date.now();
    if (now - lastSavedRef.current < 10000) return;
    lastSavedRef.current = now;

    const concluido = duration > 0 && currentTime / duration > 0.9;
    upsertProgress.mutate({ trackId, posicao: currentTime, concluido });
  }, [upsertProgress]);

  /**
   * Force-save (e.g. on pause or track change)
   */
  const forceSave = useCallback((trackId: string, currentTime: number, duration: number) => {
    lastSavedRef.current = Date.now();
    const concluido = duration > 0 && currentTime / duration > 0.9;
    upsertProgress.mutate({ trackId, posicao: currentTime, concluido });
  }, [upsertProgress]);

  /**
   * Mark a track as completed manually
   */
  const markCompleted = useCallback((trackId: string) => {
    upsertProgress.mutate({ trackId, posicao: 0, concluido: true });
  }, [upsertProgress]);

  /**
   * Get saved position for a track
   */
  const getSavedPosition = useCallback((trackId: string): number => {
    return progressMap?.[trackId]?.posicao_segundos || 0;
  }, [progressMap]);

  /**
   * Check if a track is completed
   */
  const isCompleted = useCallback((trackId: string): boolean => {
    return progressMap?.[trackId]?.concluido || false;
  }, [progressMap]);

  return {
    progressMap: progressMap || {},
    isLoading,
    savePosition,
    forceSave,
    markCompleted,
    getSavedPosition,
    isCompleted,
  };
}
