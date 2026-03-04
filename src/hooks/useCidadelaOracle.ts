import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CidadelaCard {
  id: string;
  name: string;
  family: string;
  district_id: string | null;
  keyword: string | null;
  description: string | null;
  base_question: string | null;
  suggested_tool: string | null;
  suggested_tool_id: string | null;
  suggested_intervention_id: string | null;
  color_hex: string | null;
  image_url: string | null;
  is_active: boolean;
  ordem: number;
}

const TABLE = 'cidadela_oracle_cards' as any;
const USAGE_TABLE = 'cidadela_oracle_usage' as any;

export function useCidadelaOracle() {
  const [cards, setCards] = useState<CidadelaCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    setIsLoading(true);
    const { data } = await (supabase.from(TABLE) as any)
      .select('*')
      .eq('is_active', true)
      .order('ordem');
    setCards((data || []) as CidadelaCard[]);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const drawRandom = useCallback((districtFilter?: string): CidadelaCard | null => {
    let pool = cards;
    if (districtFilter) pool = cards.filter(c => c.district_id === districtFilter);
    if (pool.length === 0) pool = cards;
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [cards]);

  const drawThree = useCallback((districtFilter?: string): CidadelaCard[] => {
    let pool = [...cards];
    if (districtFilter) {
      const filtered = pool.filter(c => c.district_id === districtFilter);
      if (filtered.length >= 3) pool = filtered;
    }
    const result: CidadelaCard[] = [];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      result.push(pool.splice(idx, 1)[0]);
    }
    return result;
  }, [cards]);

  const suggestContextual = useCallback((context: {
    districtId?: string;
    checkinState?: string;
  }): { card: CidadelaCard; reason: string } | null => {
    if (cards.length === 0) return null;
    
    // Priority: match district first
    if (context.districtId) {
      const districtCards = cards.filter(c => c.district_id === context.districtId);
      if (districtCards.length > 0) {
        const card = districtCards[Math.floor(Math.random() * districtCards.length)];
        return { card, reason: 'Carta alinhada ao distrito atual da sessão' };
      }
    }

    // If client is contracted/unstable, prioritize PORTAS/TRANSFORMAÇÕES
    if (context.checkinState === 'contraida' || context.checkinState === 'instavel') {
      const priority = cards.filter(c => c.family === 'PORTAS' || c.family === 'TRANSFORMAÇÕES');
      if (priority.length > 0) {
        const card = priority[Math.floor(Math.random() * priority.length)];
        return { card, reason: 'Carta sugerida com base no estado de presença' };
      }
    }

    const card = cards[Math.floor(Math.random() * cards.length)];
    return { card, reason: 'Sugestão do campo simbólico' };
  }, [cards]);

  const recordUsage = async (clientId: string, cardId: string) => {
    const { data: existing } = await (supabase.from(USAGE_TABLE) as any)
      .select('id, count')
      .eq('client_id', clientId)
      .eq('card_id', cardId)
      .maybeSingle();

    if (existing) {
      await (supabase.from(USAGE_TABLE) as any)
        .update({ count: existing.count + 1, last_used_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await (supabase.from(USAGE_TABLE) as any)
        .insert({ client_id: clientId, card_id: cardId });
    }
  };

  const getClientRecurrences = async (clientId: string): Promise<{ card: CidadelaCard; count: number }[]> => {
    const { data } = await (supabase.from(USAGE_TABLE) as any)
      .select('card_id, count')
      .eq('client_id', clientId)
      .gte('count', 3)
      .order('count', { ascending: false });

    if (!data || data.length === 0) return [];
    return data.map((u: any) => ({
      card: cards.find(c => c.id === u.card_id)!,
      count: u.count,
    })).filter((r: any) => r.card);
  };

  return {
    cards,
    isLoading,
    drawRandom,
    drawThree,
    suggestContextual,
    recordUsage,
    getClientRecurrences,
    refresh: fetchCards,
  };
}

export const FAMILY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  TORRES: { bg: 'bg-[#C9A24A]/10', border: 'border-[#C9A24A]/40', text: 'text-[#C9A24A]' },
  PORTAS: { bg: 'bg-[#8B2252]/10', border: 'border-[#8B2252]/40', text: 'text-[#8B2252]' },
  ARQUÉTIPOS: { bg: 'bg-[#556B57]/10', border: 'border-[#556B57]/40', text: 'text-[#556B57]' },
  SONHOS: { bg: 'bg-[#1B3A5C]/20', border: 'border-[#1B3A5C]/40', text: 'text-[#4A8BC2]' },
  LABIRINTOS: { bg: 'bg-[#4A2563]/10', border: 'border-[#4A2563]/40', text: 'text-[#9B59B6]' },
  TRANSFORMAÇÕES: { bg: 'bg-[#F5F1E8]/5', border: 'border-[#C9A24A]/30', text: 'text-[#F5F1E8]' },
};

export const FAMILY_ICONS: Record<string, string> = {
  TORRES: '🏰',
  PORTAS: '🚪',
  ARQUÉTIPOS: '👁',
  SONHOS: '🌙',
  LABIRINTOS: '🌀',
  TRANSFORMAÇÕES: '✦',
};
