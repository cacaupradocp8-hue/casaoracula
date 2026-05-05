import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Types alinhados com V3
export interface ClubeCiclo {
  id: string;
  titulo: string;
  subtitulo?: string;
  publicado: boolean;
  ativo: boolean;
}

export interface ClubeFase {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao?: string;
  status?: string;
}

export interface ClubeEscuta {
  id: string;
  station_id: string;
  titulo: string;
  audio_url?: string;
}

// Hook principal usando V3
export function useClubeLivro() {
  const { user } = useAuth();

  const { data: ciclos, isLoading: loadingCiclos } = useQuery({
    queryKey: ['clube-v3-routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_v3_routes')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        titulo: r.title,
        subtitulo: r.subtitle,
        publicado: r.status === 'active',
        ativo: r.status === 'active',
      })) as unknown as ClubeCiclo[];
    },
    enabled: !!user,
  });

  const cicloAtual = ciclos?.find(c => c.ativo) || null;

  return {
    ciclos,
    cicloAtual,
    ciclosProximos: [],
    ciclosAnteriores: ciclos?.filter(c => !c.ativo) || [],
    loadingCiclos,
  };
}

export function useClubeCicloDetalhe(cicloId: string | undefined) {
  const { user } = useAuth();

  const { data: ciclo, isLoading: loadingCiclo } = useQuery({
    queryKey: ['clube-v3-route', cicloId],
    queryFn: async () => {
      if (!cicloId) return null;
      const { data, error } = await supabase
        .from('clube_v3_routes')
        .select('*')
        .eq('id', cicloId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return {
        id: data.id,
        titulo: data.title,
        subtitulo: data.subtitle,
      } as unknown as ClubeCiclo;
    },
    enabled: !!cicloId && !!user,
  });

  const { data: fases, isLoading: loadingFases } = useQuery({
    queryKey: ['clube-v3-stations', cicloId],
    queryFn: async () => {
      if (!cicloId) return [];
      const { data, error } = await supabase
        .from('clube_v3_stations')
        .select('*')
        .eq('route_id', cicloId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return (data || []).map(s => ({
        id: s.id,
        ciclo_id: s.route_id,
        titulo: s.title,
        descricao: s.description,
      })) as unknown as ClubeFase[];
    },
    enabled: !!cicloId && !!user,
  });

  const { data: escutas, isLoading: loadingEscutas } = useQuery({
    queryKey: ['clube-v3-audios', cicloId],
    queryFn: async () => {
      if (!cicloId) return [];
      const { data: stations } = await supabase.from('clube_v3_stations').select('id').eq('route_id', cicloId);
      const stationIds = (stations || []).map(s => s.id);
      
      const { data, error } = await supabase
        .from('clube_v3_station_audios')
        .select('*')
        .in('station_id', stationIds.length > 0 ? stationIds : ['00000000-0000-0000-0000-000000000000'])
        .order('display_order', { ascending: true });

      if (error) throw error;
      return (data || []).map(a => ({
        id: a.id,
        station_id: a.station_id,
        titulo: a.title,
        audio_url: a.audio_url,
      })) as unknown as ClubeEscuta[];
    },
    enabled: !!cicloId && !!user,
  });

  return {
    ciclo,
    fases,
    escutas,
    encontros: [],
    aulas: [],
    isLoading: loadingCiclo || loadingFases || loadingEscutas,
  };
}

export function useRitualAceite(cicloId: string | undefined) {
  return { hasAccepted: true, aceite: null, isLoading: false, acceptRitual: { mutate: () => {} } };
}

export function useClubeFasePerguntas(faseId: string | undefined, cicloId: string | undefined) {
  return { perguntas: [], respostas: [], isLoading: false, salvarResposta: { mutate: () => {} } };
}
