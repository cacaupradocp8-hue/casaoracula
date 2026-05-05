import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useCallback, useEffect } from "react";

export interface ClubeInsight {
  id: string;
  estacao_id: string | null;
  rota_slug: string | null;
  frase: string;
  intensidade: 'suave' | 'profunda' | 'impactante' | null;
  frequencia: 'diario' | 'por_acesso' | 'sorteio' | null;
  ordem: number;
  status: 'ativo' | 'arquivado';
}

const FALLBACK_INSIGHT: ClubeInsight = {
  id: 'fallback',
  estacao_id: null,
  rota_slug: null,
  frase: "Onde o olhar simbólico pousa, a alma encontra caminho.",
  intensidade: 'suave',
  frequencia: 'diario',
  ordem: 0,
  status: 'ativo'
};

export const useClubeInsights = (context?: { estacao_id?: string; rota_slug?: string }) => {
  const [selectedInsight, setSelectedInsight] = useState<ClubeInsight | null>(null);
  const [tick, setTick] = useState(0);

  const { data: insights, isLoading } = useQuery({
    queryKey: ['clube-portal-insights', context],
    queryFn: async () => {
      let query = supabase
        .from('clube_portal_insights')
        .select('*')
        .eq('status', 'ativo')
        .order('ordem', { ascending: true });

      if (context?.rota_slug) {
        query = query.eq('rota_slug', context.rota_slug);
      } else if (context?.estacao_id) {
        query = query.eq('estacao_id', context.estacao_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ClubeInsight[];
    },
  });

  const selectInsight = useCallback(() => {
    if (!insights || insights.length === 0) {
      setSelectedInsight(FALLBACK_INSIGHT);
      return;
    }

    const mode = insights[0].frequencia || 'diario';
    let index = 0;

    if (mode === 'diario') {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
      const day = Math.floor(diff / (1000 * 60 * 60 * 24));
      index = day % insights.length;
    } else if (mode === 'por_acesso') {
      index = Math.floor(Date.now() / 1000) % insights.length;
    } else {
      // sorteio (avoiding consecutive repeat via localStorage)
      const lastId = localStorage.getItem('last_insight_id');
      const filtered = insights.filter(i => i.id !== lastId);
      const source = filtered.length > 0 ? filtered : insights;
      index = Math.floor(Math.random() * source.length);
      localStorage.setItem('last_insight_id', source[index].id);
      return setSelectedInsight(source[index]);
    }

    setSelectedInsight(insights[index]);
  }, [insights]);

  useEffect(() => {
    if (!isLoading) {
      selectInsight();
    }
  }, [isLoading, insights, selectInsight, tick]);

  const reroll = () => setTick(prev => prev + 1);

  return { insight: selectedInsight, isLoading, reroll };
};
