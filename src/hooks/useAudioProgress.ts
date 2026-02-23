// ============================================
// Hook: Audio Progress per user
// ============================================

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AudioProgress {
  id: string;
  user_id: string;
  track_id: string;
  posicao_segundos: number;
  concluido: boolean;
  updated_at: string;
}

export function useAudioProgress(trackIds: string[]) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['audio-progress', user?.id, trackIds],
    enabled: !!user?.id && trackIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_audio_progress')
        .select('*')
        .eq('user_id', user!.id)
        .in('track_id', trackIds);
      if (error) throw error;
      return data as AudioProgress[];
    },
    refetchInterval: 15000, // refresh to catch auto-saved progress
  });
}
