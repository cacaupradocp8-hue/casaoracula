import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StationProgress {
  id: string;
  user_id: string;
  station_id: string;
  status: 'latente' | 'em_travessia' | 'integrado';
  last_activity_at: string;
}

export interface PortalProgress {
  id: string;
  user_id: string;
  portal_id: string;
  state: 'nao_iniciado' | 'em_andamento' | 'integrado';
  last_position: number;
  has_minimum_record: boolean;
  last_activity_at: string;
}

// Fetch all portal progress for portals belonging to a station
export function useStationPortalProgress(estacaoId: string | undefined, portalIds: string[]) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['portal-progress', estacaoId, user?.id],
    enabled: !!user?.id && portalIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portal_progress')
        .select('*')
        .eq('user_id', user!.id)
        .in('portal_id', portalIds);
      if (error) throw error;
      return data as PortalProgress[];
    },
  });
}

// Fetch station progress for a user
export function useStationProgress(stationId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['station-progress', stationId, user?.id],
    enabled: !!user?.id && !!stationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('station_progress')
        .select('*')
        .eq('user_id', user!.id)
        .eq('station_id', stationId!)
        .maybeSingle();
      if (error) throw error;
      return data as StationProgress | null;
    },
  });
}

// Upsert portal progress (mark as em_andamento or integrado)
export function useUpdatePortalProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ portal_id, state, has_minimum_record }: { portal_id: string; state: string; has_minimum_record?: boolean }) => {
      if (!user?.id) throw new Error('Não autenticado');
      const payload: Record<string, unknown> = {
        user_id: user.id,
        portal_id,
        state,
        last_activity_at: new Date().toISOString(),
      };
      if (has_minimum_record !== undefined) payload.has_minimum_record = has_minimum_record;

      const { error } = await supabase
        .from('portal_progress')
        .upsert(payload as any, { onConflict: 'user_id,portal_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-progress'] });
      queryClient.invalidateQueries({ queryKey: ['station-progress'] });
    },
  });
}

// Upsert station progress
export function useUpdateStationProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ station_id, status }: { station_id: string; status: string }) => {
      if (!user?.id) throw new Error('Não autenticado');
      const { error } = await supabase
        .from('station_progress')
        .upsert({
          user_id: user.id,
          station_id,
          status,
          last_activity_at: new Date().toISOString(),
        } as any, { onConflict: 'user_id,station_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['station-progress'] });
    },
  });
}

// Derive station status from portal progress
export function deriveStationStatus(
  portalProgress: PortalProgress[],
  totalPortals: number
): 'latente' | 'em_travessia' | 'integrado' {
  if (totalPortals === 0) return 'latente';
  const integrados = portalProgress.filter(p => p.state === 'integrado').length;
  if (integrados === totalPortals) return 'integrado';
  const ativos = portalProgress.filter(p => p.state !== 'nao_iniciado').length;
  if (ativos > 0) return 'em_travessia';
  return 'latente';
}

// Status labels and icons
export const STATUS_CONFIG = {
  latente: { label: 'Latente', icon: '○', className: 'text-muted-foreground' },
  em_travessia: { label: 'Em travessia', icon: '◐', className: 'text-primary' },
  integrado: { label: 'Integrado', icon: '●', className: 'text-primary' },
  nao_iniciado: { label: 'Não iniciado', icon: '○', className: 'text-muted-foreground' },
  em_andamento: { label: 'Em andamento', icon: '◐', className: 'text-primary' },
} as const;
