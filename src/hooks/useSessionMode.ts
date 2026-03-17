import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SessionMode = 'oracula' | 'livre';

export interface NextStepSuggestion {
  ferramenta_nome: string;
  ferramenta_rota: string;
  categoria: string | null;
  motivo: string;
}

export function useSessionMode() {
  const [mode, setMode] = useState<SessionMode | null>(null);
  const [nextStep, setNextStep] = useState<NextStepSuggestion | null>(null);
  const [loadingNext, setLoadingNext] = useState(false);

  const selectMode = useCallback((m: SessionMode) => {
    setMode(m);
    setNextStep(null);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'oracula' ? 'livre' : 'oracula');
    setNextStep(null);
  }, []);

  const fetchNextStep = useCallback(async (currentToolRoute?: string, currentToolId?: string) => {
    if (!currentToolRoute && !currentToolId) return;
    setLoadingNext(true);
    try {
      let query = supabase
        .from('sala_ferramentas')
        .select('proximo_passo, ferramenta_nome, categoria_metodo');

      if (currentToolId) {
        query = query.eq('id', currentToolId);
      } else if (currentToolRoute) {
        query = query.eq('rota', currentToolRoute);
      }

      const { data: currentTool } = await query.limit(1).maybeSingle();

      if (!currentTool?.proximo_passo) {
        setNextStep(null);
        return;
      }

      const { data: nextTool } = await supabase
        .from('sala_ferramentas')
        .select('ferramenta_nome, rota, categoria_metodo')
        .eq('rota', currentTool.proximo_passo)
        .eq('ativa', true)
        .limit(1)
        .maybeSingle();

      if (nextTool) {
        setNextStep({
          ferramenta_nome: nextTool.ferramenta_nome,
          ferramenta_rota: nextTool.rota || '',
          categoria: nextTool.categoria_metodo,
          motivo: `Sugestão baseada no fluxo do método após "${currentTool.ferramenta_nome}"`,
        });
      } else {
        setNextStep(null);
      }
    } catch (err) {
      console.error('Error fetching next step:', err);
      setNextStep(null);
    } finally {
      setLoadingNext(false);
    }
  }, []);

  const fetchInitialSuggestion = useCallback(async () => {
    setLoadingNext(true);
    try {
      const { data } = await supabase
        .from('sala_ferramentas')
        .select('ferramenta_nome, rota, categoria_metodo')
        .eq('ativa', true)
        .eq('categoria_metodo', 'diagnostico')
        .order('ordem', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (data) {
        setNextStep({
          ferramenta_nome: data.ferramenta_nome,
          ferramenta_rota: data.rota || '',
          categoria: data.categoria_metodo,
          motivo: 'Primeira ferramenta sugerida para iniciar o diagnóstico simbólico.',
        });
      }
    } catch (err) {
      console.error('Error fetching initial suggestion:', err);
    } finally {
      setLoadingNext(false);
    }
  }, []);

  return {
    mode,
    selectMode,
    toggleMode,
    nextStep,
    loadingNext,
    fetchNextStep,
    fetchInitialSuggestion,
    clearNextStep: () => setNextStep(null),
  };
}
