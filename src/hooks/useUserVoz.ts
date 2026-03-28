import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserVozData {
  voz_primaria: string | null;
  voz_apoio: string | null;
  voz_ativa: string | null;
}

export function useUserVoz() {
  const { user } = useAuth();
  const [vozData, setVozData] = useState<UserVozData>({
    voz_primaria: null,
    voz_apoio: null,
    voz_ativa: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchVoz = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data } = await supabase
        .from('profiles')
        .select('voz_primaria, voz_apoio, voz_ativa')
        .eq('id', user.id)
        .single();
      if (data) {
        setVozData({
          voz_primaria: (data as any).voz_primaria ?? null,
          voz_apoio: (data as any).voz_apoio ?? null,
          voz_ativa: (data as any).voz_ativa ?? null,
        });
      }
    } catch (e) {
      console.error('Error fetching voz data:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchVoz(); }, [fetchVoz]);

  const saveVozes = useCallback(async (primaria: string, apoio: string | null) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ voz_primaria: primaria, voz_apoio: apoio } as any)
        .eq('id', user.id);
      if (error) throw error;

      // Save to history
      await (supabase.from('voz_historico' as any) as any).insert({
        user_id: user.id,
        voz_primaria: primaria,
        voz_apoio: apoio,
      });

      setVozData(prev => ({ ...prev, voz_primaria: primaria, voz_apoio: apoio }));
      return true;
    } catch (e) {
      console.error('Error saving vozes:', e);
      return false;
    }
  }, [user]);

  const setVozAtiva = useCallback(async (vozId: string) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ voz_ativa: vozId } as any)
        .eq('id', user.id);
      if (error) throw error;
      setVozData(prev => ({ ...prev, voz_ativa: vozId }));
      return true;
    } catch (e) {
      console.error('Error setting voz ativa:', e);
      return false;
    }
  }, [user]);

  return { ...vozData, loading, saveVozes, setVozAtiva, refetch: fetchVoz };
}
