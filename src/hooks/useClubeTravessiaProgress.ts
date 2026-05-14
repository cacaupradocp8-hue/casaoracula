import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAudioProgress } from './useAudioProgress';
import { useJardimPsique } from './useJardimPsique';
import { useMemo } from 'react';
import { StepStatus } from '@/components/clube/ClubeTravessiaProgress';

export function useClubeTravessiaProgress(ponto: any, estacaoId?: string) {
  const { user } = useAuth();
  
  // 1. Audio Progress
  const audioIds = useMemo(() => {
    const audios = Array.isArray(ponto?.metadata?.audios) ? ponto.metadata.audios : [];
    return audios.map((a: any) => a.id).filter(Boolean);
  }, [ponto?.metadata?.audios]);
  
  const { progressMap: audioProgress } = useAudioProgress(audioIds);
  
  // 2. Jardim Progress
  const { registros: jardimRegistros } = useJardimPsique({
    ferramenta_chave: ponto?.slug,
  });

  // 3. Lab 80/20 Progress
  const { data: labProgress } = useQuery({
    queryKey: ['clube-lab-progress', user?.id, ponto?.id],
    queryFn: async () => {
      if (!user?.id || !ponto?.id) return null;
      const { data } = await supabase
        .from('clube_livro_integracao_8020')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id && !!ponto?.id,
  });

  // 4. Chat Interactions
  const { data: chatInteractions } = useQuery({
    queryKey: ['clube-chat-interactions', user?.id, ponto?.id],
    queryFn: async () => {
      if (!user?.id || !ponto?.id) return [];
      const { data } = await supabase
        .from('clube_livro_chat_interactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('rota_id', ponto.id) // Assuming rota_id matches ponto.id
        .limit(1);
      return data || [];
    },
    enabled: !!user?.id && !!ponto?.id,
  });

  const steps = useMemo(() => {
    if (!ponto) return [];

    const hasAudios = audioIds.length > 0;
    const hasLab = !!ponto.metadata?.simulacao_texto || !!ponto.cenario_treinamento;
    const hasJardim = !!ponto.jardim_prompt || !!ponto.metadata?.jardim_prompt;
    const hasChat = ponto.tipo === 'chat_livro' || (Array.isArray(ponto.metadata?.perguntas_sugeridas) && ponto.metadata.perguntas_sugeridas.length > 0);

    const checkAudioStatus = (): StepStatus => {
      if (!hasAudios) return 'not_started';
      const allCompleted = audioIds.every(id => audioProgress[id]?.concluido);
      if (allCompleted) return 'completed';
      const someStarted = audioIds.some(id => audioProgress[id]);
      return someStarted ? 'in_progress' : 'recommended';
    };

    const checkJardimStatus = (): StepStatus => {
      if (!hasJardim) return 'not_started';
      return jardimRegistros.length > 0 ? 'completed' : 'not_started';
    };

    const checkLabStatus = (): StepStatus => {
      if (!hasLab) return 'not_started';
      return labProgress ? 'completed' : 'not_started';
    };

    const checkChatStatus = (): StepStatus => {
      if (!hasChat) return 'not_started';
      return chatInteractions.length > 0 ? 'completed' : 'not_started';
    };

    const rawSteps = [
      { id: 'abertura', label: 'Abertura do Campo', status: 'completed' as StepStatus },
      { id: 'audio', label: 'Áudio Principal', status: checkAudioStatus() },
      { id: 'simbolo', label: 'Símbolo Central', status: 'in_progress' as StepStatus },
      { id: 'lab', label: 'Laboratório 80/20', status: checkLabStatus() },
      { id: 'jardim', label: 'Jardim da Psique', status: checkJardimStatus() },
      { id: 'chat', label: 'Converse com o Livro', status: checkChatStatus() },
      { id: 'integracao', label: 'Integração Final', status: 'recommended' as StepStatus },
    ];

    // Refine recommended status based on sequence
    let foundFirstIncomplete = false;
    return rawSteps.map(step => {
      if (step.status === 'completed') return step;
      if (!foundFirstIncomplete) {
        foundFirstIncomplete = true;
        return { ...step, status: 'recommended' as StepStatus };
      }
      return step;
    });
  }, [ponto, audioIds, audioProgress, jardimRegistros, labProgress, chatInteractions]);

  return {
    steps,
    isLoading: false,
  };
}
