import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RouteV3 {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  status: string;
  display_order: number;
}

export interface StationV3 {
  id: string;
  route_id: string;
  title: string;
  subtitle: string;
  description: string;
  display_order: number;
  status: string;
  progress?: UserProgressV3;
}

export interface StationAudioV3 {
  id: string;
  station_id: string;
  title: string;
  audio_url: string;
  display_order: number;
  status: string;
}

export interface StationContentV3 {
  id: string;
  station_id: string;
  letter_content: string;
  jungian_reflection: string;
  contemplative_question: string;
  therapeutic_practice: string;
  support_material: string;
}

export interface UserProgressV3 {
  id: string;
  user_id: string;
  station_id: string;
  audio_completed: boolean;
  letter_completed: boolean;
  reflection_completed: boolean;
  question_completed: boolean;
  practice_completed: boolean;
}

export function useClubeRoutes() {
  return useQuery({
    queryKey: ['clube_v3_routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_v3_routes')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as RouteV3[];
    }
  });
}

export function useClubeStations(routeId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['clube_v3_stations', routeId],
    enabled: !!routeId,
    queryFn: async () => {
      const { data: stations, error: sError } = await supabase
        .from('clube_v3_stations')
        .select('*')
        .eq('route_id', routeId!)
        .eq('status', 'published')
        .order('display_order', { ascending: true });
      
      if (sError) throw sError;

      if (user?.id) {
        const { data: progress, error: pError } = await supabase
          .from('clube_v3_user_progress')
          .select('*')
          .eq('user_id', user.id);
        
        if (pError) throw pError;

        return stations.map(s => ({
          ...s,
          progress: progress.find(p => p.station_id === s.id)
        })) as StationV3[];
      }

      return stations as StationV3[];
    }
  });
}

export function useStationDetail(stationId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['clube_v3_station_detail', stationId],
    enabled: !!stationId,
    queryFn: async () => {
      // Fetch station
      const { data: station, error: sError } = await supabase
        .from('clube_v3_stations')
        .select('*')
        .eq('id', stationId!)
        .single();
      
      if (sError) throw sError;

      // Fetch audios
      const { data: audios, error: aError } = await supabase
        .from('clube_v3_station_audios')
        .select('*')
        .eq('station_id', stationId!)
        .order('display_order', { ascending: true });
      
      if (aError) throw aError;

      // Fetch content
      const { data: content, error: cError } = await supabase
        .from('clube_v3_station_content')
        .select('*')
        .eq('station_id', stationId!)
        .single();
      
      if (cError && cError.code !== 'PGRST116') throw cError;

      // Fetch progress
      let progress = null;
      if (user?.id) {
        const { data: pData, error: pError } = await supabase
          .from('clube_v3_user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('station_id', stationId!)
          .maybeSingle();
        
        if (pError) throw pError;
        progress = pData;
      }

      return {
        station: station as StationV3,
        audios: audios as StationAudioV3[],
        content: content as StationContentV3,
        progress: progress as UserProgressV3 | null
      };
    }
  });
}

export function useUpdateProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stationId, field, value }: { stationId: string, field: keyof UserProgressV3, value: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('clube_v3_user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('station_id', stationId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('clube_v3_user_progress')
          .update({ [field]: value })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_v3_user_progress')
          .insert({
            user_id: user.id,
            station_id: stationId,
            [field]: value
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clube_v3_stations'] });
      queryClient.invalidateQueries({ queryKey: ['clube_v3_station_detail'] });
    }
  });
}
