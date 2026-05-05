import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProgressaoStep {
  key: string;
  label: string;
  emoji: string;
  concluido: boolean;
  desbloqueado: boolean;
}

export function useCirculoProgressao(cicloId: string | undefined) {
  const { user } = useAuth();
  const userId = user?.id;

  // Total de áudios V3
  const { data: totalEscutas } = useQuery({
    queryKey: ['progressao-v3-total-audios', cicloId],
    queryFn: async () => {
      const { data: stations } = await supabase.from('clube_v3_stations').select('id').eq('route_id', cicloId!);
      const stationIds = (stations || []).map(s => s.id);
      const { count } = await supabase.from('clube_v3_station_audios').select('*', { count: 'exact', head: true })
        .in('station_id', stationIds.length > 0 ? stationIds : ['00000000-0000-0000-0000-000000000000']);
      return count || 0;
    },
    enabled: !!cicloId,
  });

  // Progresso do usuário V3
  const { data: v3Progress } = useQuery({
    queryKey: ['progressao-v3-status', cicloId, userId],
    queryFn: async () => {
      if (!userId || !cicloId) return [];
      const { data: stations } = await supabase.from('clube_v3_stations').select('id').eq('route_id', cicloId);
      const stationIds = (stations || []).map(s => s.id);
      const { data } = await supabase.from('clube_v3_user_progress').select('*').eq('user_id', userId)
        .in('station_id', stationIds.length > 0 ? stationIds : ['00000000-0000-0000-0000-000000000000']);
      return data || [];
    },
    enabled: !!userId && !!cicloId,
  });

  const completedAudios = v3Progress?.filter(p => (p as any).audio_completed).length || 0;
  const travessiaPercent = totalEscutas && totalEscutas > 0 ? (completedAudios / totalEscutas) * 100 : 0;
  const lab8020Done = v3Progress?.some(p => (p as any).practice_completed);
  const hasRegistro = v3Progress?.some(p => (p as any).letter_completed);
  const integracaoDone = v3Progress?.some(p => (p as any).reflection_completed);

  const steps: ProgressaoStep[] = [
    { key: 'portal', label: 'Portal', emoji: '🌑', concluido: true, desbloqueado: true },
    { key: 'travessia', label: 'Travessia', emoji: '🌒', concluido: travessiaPercent >= 70, desbloqueado: true },
    { key: 'converse', label: 'Escuta', emoji: '🌓', concluido: true, desbloqueado: true },
    { key: 'lab8020', label: 'Laboratório', emoji: '🌔', concluido: !!lab8020Done, desbloqueado: true },
    { key: 'registros', label: 'Registro', emoji: '🌕', concluido: !!hasRegistro, desbloqueado: true },
    { key: 'integracao', label: 'Integração', emoji: '✨', concluido: !!integracaoDone, desbloqueado: true },
  ];

  return {
    steps,
    isTabUnlocked: () => true,
    currentStepIndex: steps.findIndex(s => !s.concluido),
  };
}
