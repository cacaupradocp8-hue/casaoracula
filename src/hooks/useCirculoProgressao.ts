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

/**
 * Hook que calcula a progressão obrigatória do Círculo de Leitura.
 * 
 * Ordem:
 * 1. Portal (sempre livre)
 * 2. Travessia (mínimo 70% escutas concluídas)
 * 3. Converse (mínimo 1 interação)
 * 4. Lab 80/20 (concluído)
 * 5. Registros / Jardim da Psique (mínimo 1 registro)
 * 6. Integração Oracular (ritual concluído)
 */
export function useCirculoProgressao(cicloId: string | undefined) {
  const { user } = useAuth();
  const userId = user?.id;
  const isAdmin = user?.portal === 'admin';

  // 1. Count total escutas for this ciclo
  const { data: totalEscutas } = useQuery({
    queryKey: ['progressao-total-escutas', cicloId],
    queryFn: async () => {
      const { count } = await supabase
        .from('clube_livro_escutas')
        .select('*', { count: 'exact', head: true })
        .eq('ciclo_id', cicloId!)
        .eq('ativo', true);
      return count || 0;
    },
    enabled: !!cicloId,
  });

  // 2. Count user's completed audio progress for this ciclo's tracks
  const { data: completedTracks } = useQuery({
    queryKey: ['progressao-completed-tracks', cicloId, userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { data: escutas } = await supabase
        .from('clube_livro_escutas')
        .select('id')
        .eq('ciclo_id', cicloId!)
        .eq('ativo', true);
      if (!escutas?.length) return 0;
      const { count } = await supabase
        .from('clube_audio_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('concluido', true)
        .in('track_id', escutas.map(e => e.id));
      return count || 0;
    },
    enabled: !!cicloId && !!userId,
  });

  // 3. Check if user has any chat interaction
  const { data: hasConversation } = useQuery({
    queryKey: ['progressao-conversation', userId],
    queryFn: async () => {
      if (!userId) return false;
      const { count } = await supabase
        .from('agente_conversas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      return (count || 0) > 0;
    },
    enabled: !!userId,
  });

  // 4. Check Lab 80/20 completion (uses season_id, so we check broadly)
  const { data: lab8020Done } = useQuery({
    queryKey: ['progressao-lab8020', userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data } = await supabase
        .from('lab_8020_progress')
        .select('concluido')
        .eq('user_id', userId)
        .eq('concluido', true)
        .limit(1);
      return (data?.length || 0) > 0;
    },
    enabled: !!userId,
  });

  // 5. Check if user has registros
  const { data: hasRegistro } = useQuery({
    queryKey: ['progressao-registro', cicloId, userId],
    queryFn: async () => {
      if (!userId) return false;
      const { count } = await supabase
        .from('clube_estacao_registros')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      return (count || 0) > 0;
    },
    enabled: !!userId,
  });

  // 6. Check integration completion
  const { data: integracaoDone } = useQuery({
    queryKey: ['progressao-integracao', cicloId, userId],
    queryFn: async () => {
      if (!userId || !cicloId) return false;
      const { data } = await supabase
        .from('clube_livro_integracoes')
        .select('status')
        .eq('user_id', userId)
        .eq('ciclo_id', cicloId)
        .eq('status', 'concluida')
        .maybeSingle();
      return !!data;
    },
    enabled: !!cicloId && !!userId,
  });

  // Calculate progression
  const travessiaPercent = totalEscutas && totalEscutas > 0
    ? ((completedTracks || 0) / totalEscutas) * 100
    : 0;

  const steps: ProgressaoStep[] = [
    {
      key: 'portal',
      label: 'Portal',
      emoji: '🌑',
      concluido: true,
      desbloqueado: true,
    },
    {
      key: 'travessia',
      label: 'Travessia',
      emoji: '🌒',
      concluido: travessiaPercent >= 70,
      desbloqueado: true,
    },
    {
      key: 'converse',
      label: 'Escuta',
      emoji: '🌓',
      concluido: !!hasConversation,
      desbloqueado: isAdmin || travessiaPercent >= 30,
    },
    {
      key: 'lab8020',
      label: 'Laboratório',
      emoji: '🌔',
      concluido: !!lab8020Done,
      desbloqueado: isAdmin || travessiaPercent >= 70,
    },
    {
      key: 'registros',
      label: 'Registro',
      emoji: '🌕',
      concluido: !!hasRegistro,
      desbloqueado: isAdmin || !!lab8020Done,
    },
    {
      key: 'integracao',
      label: 'Integração',
      emoji: '✨',
      concluido: !!integracaoDone,
      desbloqueado: isAdmin || !!hasRegistro,
    },
  ];

  if (isAdmin) {
    steps.forEach(s => { s.desbloqueado = true; });
  }

  return {
    steps,
    isTabUnlocked: (tabKey: string) => {
      const step = steps.find(s => s.key === tabKey);
      return step?.desbloqueado ?? true;
    },
    currentStepIndex: steps.findIndex(s => !s.concluido),
  };
}
