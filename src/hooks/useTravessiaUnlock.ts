import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { differenceInHours, addHours } from 'date-fns';

export interface DayUnlockStatus {
  aulaId: string;
  ordem: number;
  isUnlocked: boolean;
  unlockDate: Date | null;
  hoursRemaining: number | null;
}

interface UnlockRecord {
  aula_id: string;
  first_accessed_at: string;
}

interface AulaWithOrdem {
  id: string;
  ordem: number;
}

export function useTravessiaUnlock(travessiaId: string | undefined) {
  const { user } = useAuth();
  const [dayStatuses, setDayStatuses] = useState<DayUnlockStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unlocks, setUnlocks] = useState<Map<string, Date>>(new Map());

  // Fetch aulas and unlocks
  useEffect(() => {
    const fetchData = async () => {
      if (!travessiaId || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch aulas ordenadas
        const { data: aulasData, error: aulasError } = await supabase
          .from('conteudo_aulas')
          .select('id, ordem')
          .eq('travessia_id', travessiaId)
          .eq('publicado', true)
          .order('ordem', { ascending: true });

        if (aulasError) throw aulasError;

        const aulas = (aulasData || []) as AulaWithOrdem[];

        // Fetch user unlocks
        const { data: unlocksData, error: unlocksError } = await supabase
          .from('travessia_day_unlocks')
          .select('aula_id, first_accessed_at')
          .eq('user_id', user.id);

        if (unlocksError) throw unlocksError;

        // Build unlock map
        const unlockMap = new Map<string, Date>();
        (unlocksData || []).forEach((record: UnlockRecord) => {
          unlockMap.set(record.aula_id, new Date(record.first_accessed_at));
        });
        setUnlocks(unlockMap);

        // Build aula order map
        const aulaOrderMap = new Map<string, number>();
        aulas.forEach((aula) => {
          aulaOrderMap.set(aula.id, aula.ordem);
        });

        // Calculate status for each day
        const statuses: DayUnlockStatus[] = aulas.map((aula, index) => {
          const ordem = aula.ordem;

          // Day 1 is always unlocked
          if (ordem === 1) {
            return {
              aulaId: aula.id,
              ordem,
              isUnlocked: true,
              unlockDate: null,
              hoursRemaining: null,
            };
          }

          // Find previous day's aula
          const prevAula = aulas[index - 1];
          if (!prevAula) {
            return {
              aulaId: aula.id,
              ordem,
              isUnlocked: false,
              unlockDate: null,
              hoursRemaining: null,
            };
          }

          const prevUnlock = unlockMap.get(prevAula.id);
          if (!prevUnlock) {
            return {
              aulaId: aula.id,
              ordem,
              isUnlocked: false,
              unlockDate: null,
              hoursRemaining: null,
            };
          }

          const hoursSincePrevAccess = differenceInHours(new Date(), prevUnlock);

          if (hoursSincePrevAccess >= 24) {
            return {
              aulaId: aula.id,
              ordem,
              isUnlocked: true,
              unlockDate: null,
              hoursRemaining: null,
            };
          }

          const unlockDate = addHours(prevUnlock, 24);
          return {
            aulaId: aula.id,
            ordem,
            isUnlocked: false,
            unlockDate,
            hoursRemaining: 24 - hoursSincePrevAccess,
          };
        });

        setDayStatuses(statuses);
      } catch (error) {
        console.error('Erro ao buscar unlocks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [travessiaId, user]);

  // Register access to a day
  const registerAccess = useCallback(async (aulaId: string): Promise<boolean> => {
    if (!user) return false;

    // Check if already registered
    if (unlocks.has(aulaId)) {
      return true;
    }

    try {
      const { error } = await supabase
        .from('travessia_day_unlocks')
        .insert({
          user_id: user.id,
          aula_id: aulaId,
        });

      if (error) {
        // Ignore unique constraint violations (already registered)
        if (error.code === '23505') return true;
        throw error;
      }

      // Update local state
      setUnlocks(prev => new Map(prev).set(aulaId, new Date()));
      return true;
    } catch (error) {
      console.error('Erro ao registrar acesso:', error);
      return false;
    }
  }, [user, unlocks]);

  // Check if specific day is unlocked
  const isDayUnlocked = useCallback((aulaId: string): boolean => {
    const status = dayStatuses.find(s => s.aulaId === aulaId);
    return status?.isUnlocked ?? false;
  }, [dayStatuses]);

  // Get status for specific day
  const getDayStatus = useCallback((aulaId: string): DayUnlockStatus | undefined => {
    return dayStatuses.find(s => s.aulaId === aulaId);
  }, [dayStatuses]);

  return {
    dayStatuses,
    isLoading,
    registerAccess,
    isDayUnlocked,
    getDayStatus,
  };
}
