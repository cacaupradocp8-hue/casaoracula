import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ClientCidadelaMap {
  id: string;
  client_id: string;
  therapist_id: string;
  distrito_atual: string | null;
  torres_identificadas: string[];
  portas_cruzadas: string[];
  arquetipos_emergentes: string[];
  labirintos_visitados: string[];
  ferramentas_utilizadas: string[];
  historico_sessoes: any[];
  ultima_sessao: string | null;
  insights_ia: any[];
  created_at: string;
  updated_at: string;
}

export function useCidadelaMap() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchMap = useCallback(async (clientId: string): Promise<ClientCidadelaMap | null> => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('client_cidadela_map' as any)
      .select('*')
      .eq('client_id', clientId)
      .eq('therapist_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching cidadela map:', error);
      return null;
    }
    return data as unknown as ClientCidadelaMap | null;
  }, [user]);

  const updateFromSession = useCallback(async (
    clientId: string,
    data: {
      distrito?: string;
      torre?: string;
      porta?: string;
      arquetipo?: string;
      labirinto?: string;
      ferramenta?: string;
      insight?: string;
    }
  ): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
      const { error } = await supabase.rpc('update_cidadela_from_session' as any, {
        _client_id: clientId,
        _therapist_id: user.id,
        _distrito: data.distrito || null,
        _torre: data.torre || null,
        _porta: data.porta || null,
        _arquetipo: data.arquetipo || null,
        _labirinto: data.labirinto || null,
        _ferramenta: data.ferramenta || null,
        _insight: data.insight || null,
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating cidadela map:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { loading, fetchMap, updateFromSession };
}
