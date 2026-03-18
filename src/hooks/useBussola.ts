import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BussolaResult {
  engine_id: string;
  recommendation_id: string;
  distrito_sugerido: string | null;
  tool_principal: { id: string; nome: string; slug: string } | null;
  tool_complementar: { id: string; nome: string; slug: string } | null;
  pergunta_sugerida: string;
  ritual_sugerido: string;
  confianca: number;
  fase_jornada: string;
  modo_sessao: string;
}

interface UseBussolaOptions {
  onResult?: (result: BussolaResult) => void;
}

export function useBussola(options?: UseBussolaOptions) {
  const [result, setResult] = useState<BussolaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const invoke = useCallback(async (params: {
    client_id: string;
    session_id?: string;
    trigger_type: 'ferramenta' | 'tiragem' | 'sessao' | 'manual';
    fase_jornada?: 'inicio' | 'travessia' | 'integracao';
    modo_sessao?: 'oracula' | 'livre';
    last_tool_id?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bussola-cartografa', {
        body: params,
      });

      if (error) throw error;

      setResult(data as BussolaResult);
      setShowPanel(true);
      options?.onResult?.(data as BussolaResult);
    } catch (err) {
      console.error('Bússola error:', err);
      toast.error('Erro ao consultar a Bússola');
    } finally {
      setLoading(false);
    }
  }, [options]);

  const submitFeedback = useCallback(async (
    recommendationId: string,
    aceita: boolean,
    ferramentaEscolhidaId?: string,
    observacao?: string
  ) => {
    await supabase
      .from('cartographer_recommendations' as any)
      .update({
        aceita,
        ferramenta_escolhida_id: ferramentaEscolhidaId || null,
        observacao_feedback: observacao || null,
        respondido_em: new Date().toISOString(),
      })
      .eq('id', recommendationId);
  }, []);

  const dismiss = useCallback(() => {
    setShowPanel(false);
  }, []);

  return { result, loading, showPanel, invoke, submitFeedback, dismiss, setShowPanel };
}
