import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type ArchetypeType = 'therapist' | 'mentor' | 'seeker';

export interface OnboardingData {
  entryArchetype: ArchetypeType | null;
  entrySymbol: string | null;
  onboardingCompleted: boolean;
  isLoading: boolean;
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

export function useOnboarding() {
  const { user } = useAuth();
  const [data, setData] = useState<OnboardingData>({
    entryArchetype: null,
    entrySymbol: null,
    onboardingCompleted: false,
    isLoading: true,
  });

  useEffect(() => {
    if (!user) {
      setData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    fetchOnboardingStatus();
  }, [user?.id]);

  const fetchOnboardingStatus = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('entry_archetype, entry_symbol, onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setData({
        entryArchetype: profile?.entry_archetype as ArchetypeType | null,
        entrySymbol: profile?.entry_symbol || null,
        onboardingCompleted: profile?.onboarding_completed || false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      setData(prev => ({ ...prev, isLoading: false }));
    }
  };

  const saveArchetype = async (archetype: ArchetypeType): Promise<boolean> => {
    if (!user) return false;

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
  };

  const completeOnboarding = async (): Promise<boolean> => {
    if (!user) return false;

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
  };

  const getSymbolData = (archetype: ArchetypeType) => ARCHETYPE_SYMBOLS[archetype];

  return {
    ...data,
    saveArchetype,
    completeOnboarding,
    getSymbolData,
    refetch: fetchOnboardingStatus,
  };
}
