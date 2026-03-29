import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { withTimeout } from '@/lib/withTimeout';

export type ArchetypeType = 'therapist' | 'mentor' | 'seeker';

export interface OnboardingData {
  entryArchetype: ArchetypeType | null;
  entrySymbol: string | null;
  onboardingCompleted: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseOnboardingOptions {
  enabled?: boolean;
}

const ARCHETYPE_SYMBOLS: Record<ArchetypeType, { symbol: string; phrase: string }> = {
  therapist: {
    symbol: 'ouroboros',
    phrase: 'Os ciclos não terminam. Eles se tornam linguagem.',
  },
  mentor: {
    symbol: 'fire_serpent',
    phrase: 'Todo guia precisa morrer para renascer.',
  },
  seeker: {
    symbol: 'eye_of_night',
    phrase: 'A alma vê no escuro antes de falar.',
  },
};

const ONBOARDING_STATUS_TIMEOUT_MS = 6000;

export function useOnboarding({ enabled = true }: UseOnboardingOptions = {}) {
  const { user, isAuthReady, isAuthenticated } = useAuth();
  const [data, setData] = useState<OnboardingData>({
    entryArchetype: null,
    entrySymbol: null,
    onboardingCompleted: false,
    isLoading: enabled,
    error: null,
  });

  const hasFetchedRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  const fetchOnboardingStatus = useCallback(async () => {
    if (!enabled) {
      setData(prev => ({ ...prev, isLoading: false, error: null }));
      return;
    }

    if (!isAuthReady) {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      return;
    }

    if (!isAuthenticated || !user?.id) {
      setData(prev => ({
        ...prev,
        entryArchetype: null,
        entrySymbol: null,
        onboardingCompleted: false,
        isLoading: false,
        error: null,
      }));
      return;
    }

    if (hasFetchedRef.current && currentUserIdRef.current === user.id) {
      return;
    }

    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: profile, error } = await withTimeout(
        Promise.resolve(
          supabase
            .from('profiles')
            .select('entry_archetype, entry_symbol, onboarding_completed')
            .eq('id', user.id)
            .maybeSingle()
        ),
        ONBOARDING_STATUS_TIMEOUT_MS,
        'Tempo limite ao carregar o onboarding.'
      );

      if (error) throw error;

      hasFetchedRef.current = true;
      currentUserIdRef.current = user.id;

      setData({
        entryArchetype: profile?.entry_archetype as ArchetypeType | null,
        entrySymbol: profile?.entry_symbol || null,
        onboardingCompleted: profile?.onboarding_completed || false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar o onboarding. Recarregue para tentar novamente.',
      }));
    }
  }, [enabled, isAuthReady, isAuthenticated, user?.id]);

  useEffect(() => {
    if (!enabled) {
      hasFetchedRef.current = false;
      currentUserIdRef.current = null;
      setData(prev => ({ ...prev, isLoading: false, error: null }));
      return;
    }

    if (user?.id !== currentUserIdRef.current) {
      hasFetchedRef.current = false;
    }

    void fetchOnboardingStatus();
  }, [enabled, user?.id, isAuthReady, isAuthenticated, fetchOnboardingStatus]);

  const saveArchetype = useCallback(async (archetype: ArchetypeType): Promise<boolean> => {
    if (!user?.id) return false;

    const symbolData = ARCHETYPE_SYMBOLS[archetype];

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          entry_archetype: archetype,
          entry_symbol: symbolData.symbol,
        })
        .eq('id', user.id);

      if (error) throw error;

      setData(prev => ({
        ...prev,
        entryArchetype: archetype,
        entrySymbol: symbolData.symbol,
      }));

      return true;
    } catch (error) {
      console.error('Error saving archetype:', error);
      return false;
    }
  }, [user?.id]);

  const completeOnboarding = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) throw error;

      setData(prev => ({ ...prev, onboardingCompleted: true }));
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }, [user?.id]);

  const getSymbolData = useCallback((archetype: ArchetypeType) => ARCHETYPE_SYMBOLS[archetype], []);

  return {
    ...data,
    saveArchetype,
    completeOnboarding,
    getSymbolData,
    refetch: fetchOnboardingStatus,
  };
}
