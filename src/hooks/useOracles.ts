import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { OracleDeck, OracleCard, OracleSpread, OracleCategory, OracleDraw, DrawnCard } from '@/types/oracle';

export function useOracles() {
  const { user } = useAuth();
  const [oracles, setOracles] = useState<OracleDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOracles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('oracle_decks')
        .select('*')
        .order('ordem');

      if (fetchError) throw fetchError;
      setOracles((data || []) as unknown as OracleDeck[]);
    } catch (err) {
      console.error('Error fetching oracles:', err);
      setError('Erro ao carregar oráculos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOracles();
  }, [fetchOracles]);

  const hasAccess = useCallback((oracle: OracleDeck): boolean => {
    const userPortal = user?.portal || 'visitante';
    
    // Admin always has access
    if (userPortal === 'admin') return true;

    const portalOrder: Record<string, number> = {
      visitante: 0,
      pre_iniciada: 1,
      iniciada: 2,
      admin: 3,
    };

    return portalOrder[userPortal] >= portalOrder[oracle.minimum_portal];
  }, [user]);

  return {
    oracles,
    isLoading,
    error,
    refetch: fetchOracles,
    hasAccess,
  };
}

export function useOracleBySlug(slug: string) {
  const { user } = useAuth();
  const [oracle, setOracle] = useState<OracleDeck | null>(null);
  const [cards, setCards] = useState<OracleCard[]>([]);
  const [spreads, setSpreads] = useState<OracleSpread[]>([]);
  const [categories, setCategories] = useState<OracleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOracleData() {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch oracle deck
        const { data: oracleData, error: oracleError } = await supabase
          .from('oracle_decks')
          .select('*')
          .eq('slug', slug)
          .single();

        if (oracleError) throw oracleError;
        if (!oracleData) {
          setError('Oráculo não encontrado');
          return;
        }

        setOracle(oracleData as unknown as OracleDeck);

        // Fetch cards, spreads, categories in parallel
        const [cardsRes, spreadsRes, categoriesRes] = await Promise.all([
          supabase
            .from('oracle_cards')
            .select('*')
            .eq('oracle_id', oracleData.id)
            .order('ordem'),
          supabase
            .from('oracle_spreads')
            .select('*')
            .eq('oracle_id', oracleData.id)
            .order('ordem'),
          supabase
            .from('oracle_categories')
            .select('*')
            .eq('oracle_id', oracleData.id)
            .order('ordem'),
        ]);

        setCards((cardsRes.data || []) as unknown as OracleCard[]);
        setSpreads((spreadsRes.data || []) as unknown as OracleSpread[]);
        setCategories((categoriesRes.data || []) as unknown as OracleCategory[]);
      } catch (err) {
        console.error('Error fetching oracle:', err);
        setError('Erro ao carregar oráculo');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOracleData();
  }, [slug]);

  const hasAccess = useCallback((): boolean => {
    if (!oracle) return false;
    const userPortal = user?.portal || 'visitante';
    
    if (userPortal === 'admin') return true;

    const portalOrder: Record<string, number> = {
      visitante: 0,
      pre_iniciada: 1,
      iniciada: 2,
      admin: 3,
    };

    return portalOrder[userPortal] >= portalOrder[oracle.minimum_portal];
  }, [oracle, user]);

  return {
    oracle,
    cards,
    spreads,
    categories,
    isLoading,
    error,
    hasAccess,
  };
}

export function useOracleDraws(oracleId?: string) {
  const { user } = useAuth();
  const [draws, setDraws] = useState<OracleDraw[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDraws() {
      if (!user) return;
      
      setIsLoading(true);
      try {
        let query = supabase
          .from('oracle_draws')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (oracleId) {
          query = query.eq('oracle_id', oracleId);
        }

        const { data } = await query;
        setDraws((data || []) as unknown as OracleDraw[]);
      } catch (err) {
        console.error('Error fetching draws:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDraws();
  }, [user, oracleId]);

  const saveDraw = useCallback(async (drawData: {
    oracle_id: string;
    spread_id: string;
    user_id: string;
    drawn_cards_json: DrawnCard[];
    user_notes: string | null;
    is_professional_session: boolean;
    client_id: string | null;
  }) => {
    const { data, error } = await supabase
      .from('oracle_draws')
      .insert({
        oracle_id: drawData.oracle_id,
        spread_id: drawData.spread_id,
        user_id: drawData.user_id,
        drawn_cards_json: drawData.drawn_cards_json as unknown as any,
        user_notes: drawData.user_notes,
        is_professional_session: drawData.is_professional_session,
        client_id: drawData.client_id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as unknown as OracleDraw;
  }, []);

  return {
    draws,
    isLoading,
    saveDraw,
  };
}
