import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para buscar e interpretar dados de progresso da formação
 * Utiliza a view v_formation_progress para dados consolidados
 */

interface TravessiaProgress {
  id: string;
  titulo: string;
  ordem: number;
  sala_id: string | null;
  completed_at?: string;
  aulas_done?: number;
  aulas_total?: number;
}

interface RitualCompleted {
  id: string;
  nome: string;
  tipo: string;
  context: string | null;
  completed_at: string;
}

interface FormationProgress {
  user_id: string;
  current_portal: string | null;
  nome_exibicao: string | null;
  role: string | null;
  joined_at: string;
  completed_travessias: TravessiaProgress[];
  active_travessias: TravessiaProgress[];
  completed_rituals: RitualCompleted[];
}

interface MapNode {
  id: string;
  node_type: 'sala' | 'portal' | 'travessia' | 'ritual';
  reference_id: string | null;
  label: string;
  description_locked: string | null;
  description_unlocked: string | null;
  position_ring: number;
  position_angle: number;
  icon: string | null;
  color: string | null;
  ordem: number;
  status: 'locked' | 'active' | 'completed';
}

interface Sala {
  id: string;
  nome_exibicao: string | null;
  ordem: number | null;
}

export function useFormationProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<FormationProgress | null>(null);
  const [mapNodes, setMapNodes] = useState<MapNode[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetchFormationData();
  }, [user]);

  const fetchFormationData = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch progress from view - use type assertion for view
      const { data: progressData, error: progressError } = await supabase
        .from('v_formation_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError;
      }

      // Fetch map nodes
      const { data: nodesData, error: nodesError } = await supabase
        .from('formation_map_nodes')
        .select('*')
        .eq('ativo', true)
        .order('position_ring', { ascending: true })
        .order('position_angle', { ascending: true });

      if (nodesError) throw nodesError;

      // Fetch salas for context
      const { data: salasData, error: salasError } = await supabase
        .from('salas')
        .select('id, nome_exibicao, ordem')
        .eq('ativa', true)
        .order('ordem', { ascending: true });

      if (salasError) throw salasError;

      // Process progress data with proper type casting
      if (progressData) {
        const rawData = progressData as Record<string, unknown>;
        
        const parseJsonArray = <T>(data: unknown): T[] => {
          if (Array.isArray(data)) return data as T[];
          return [];
        };

        const formattedProgress: FormationProgress = {
          user_id: rawData.user_id as string,
          current_portal: rawData.current_portal as string | null,
          nome_exibicao: rawData.nome_exibicao as string | null,
          role: rawData.role as string | null,
          joined_at: rawData.joined_at as string,
          completed_travessias: parseJsonArray<TravessiaProgress>(rawData.completed_travessias),
          active_travessias: parseJsonArray<TravessiaProgress>(rawData.active_travessias),
          completed_rituals: parseJsonArray<RitualCompleted>(rawData.completed_rituals),
        };
        setProgress(formattedProgress);

        // Process nodes with status based on progress
        if (nodesData) {
          const completedIds = new Set(
            formattedProgress.completed_travessias.map((t) => t.id)
          );
          const activeIds = new Set(
            formattedProgress.active_travessias.map((t) => t.id)
          );
          const ritualIds = new Set(
            formattedProgress.completed_rituals.map((r) => r.id)
          );

          const processedNodes: MapNode[] = nodesData.map((node) => {
            let status: 'locked' | 'active' | 'completed' = 'locked';

            if (node.node_type === 'travessia' && node.reference_id) {
              if (completedIds.has(node.reference_id)) {
                status = 'completed';
              } else if (activeIds.has(node.reference_id)) {
                status = 'active';
              }
            } else if (node.node_type === 'ritual' && node.reference_id) {
              if (ritualIds.has(node.reference_id)) {
                status = 'completed';
              }
            } else if (node.node_type === 'sala') {
              status = 'active';
            }

            return {
              id: node.id,
              node_type: node.node_type as 'sala' | 'portal' | 'travessia' | 'ritual',
              reference_id: node.reference_id,
              label: node.label,
              description_locked: node.description_locked,
              description_unlocked: node.description_unlocked,
              position_ring: node.position_ring ?? 1,
              position_angle: Number(node.position_angle) || 0,
              icon: node.icon,
              color: node.color,
              ordem: node.ordem ?? 0,
              status,
            };
          });

          setMapNodes(processedNodes);
        }
      } else {
        setMapNodes([]);
      }

      setSalas(salasData || []);
    } catch (err) {
      console.error('Error fetching formation progress:', err);
      setError('Não foi possível carregar o mapa da formação.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary stats (without percentages per spec)
  const getSummary = () => {
    if (!progress) return null;

    return {
      travessiasCompletas: progress.completed_travessias.length,
      travessiasEmAndamento: progress.active_travessias.length,
      rituaisCompletos: progress.completed_rituals.length,
      tempoNaCasa: progress.joined_at 
        ? Math.floor((Date.now() - new Date(progress.joined_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    };
  };

  return {
    progress,
    mapNodes,
    salas,
    isLoading,
    error,
    getSummary,
    refetch: fetchFormationData,
  };
}
