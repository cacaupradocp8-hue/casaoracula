import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type DistrictState = 'nao_explorado' | 'ativo' | 'em_tensao' | 'integrado';

export interface CartografiaGPSResult {
  leitura_psiquica: {
    titulo: string;
    tracos_dominantes: string;
    padroes_emocionais: string;
    estrutura_funcionamento: string;
    frase_espelho: string;
    conflitos_ativos?: string;
  };
  cidadela: {
    distrito_dominante: string;
    distrito_dominante_descricao: string;
    distritos_ativos: string[];
    distritos_tensao: string[];
    territorio_crescimento: string;
    territorio_crescimento_descricao: string;
    nivel_integracao?: string;
    leitura_integrada: string;
    tensao_simbolica: string;
    direcao_travessia: string;
  };
  direcao_clinica: {
    abordagem?: string;
    risco?: string;
    sugestoes?: string[];
    ferramentas_indicadas?: string[];
    distrito_foco?: string;
    pergunta_clinica?: string;
    estilo_terapeutico?: string;
    zona_seguranca?: string;
    zona_projecao?: string;
    ferramentas_naturais?: string[];
    ferramentas_desafio?: string[];
    orientacao?: string;
  };
}

export interface GPSDistrictState {
  district_id: string;
  district_name: string;
  state: DistrictState;
  sessions_count: number;
  last_session_at: string | null;
}

/**
 * Hook that derives district states from session history and cartografia data.
 * Uses 4 states: nao_explorado, ativo, em_tensao, integrado
 */
export function useCartografiaGPS() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  /**
   * Compute GPS district states from cartografia + session data
   */
  const computeDistrictStates = useCallback((
    districts: Array<{ id: string; nome: string }>,
    journeyDistricts: Array<{ district_id: string; state: string; sessions_count: number; last_session_at: string | null }>,
    cartografia?: CartografiaGPSResult | null,
  ): GPSDistrictState[] => {
    const tensaoSet = new Set(
      cartografia?.cidadela?.distritos_tensao?.map(d => d.toLowerCase()) || []
    );
    const ativoSet = new Set(
      cartografia?.cidadela?.distritos_ativos?.map(d => d.toLowerCase()) || []
    );

    return districts.map(d => {
      const jd = journeyDistricts.find(j => j.district_id === d.id);
      const nameLower = d.nome.toLowerCase();

      let state: DistrictState = 'nao_explorado';

      if (jd?.state === 'integrado') {
        state = 'integrado';
      } else if (tensaoSet.has(nameLower)) {
        state = 'em_tensao';
      } else if (jd?.state === 'ativo' || ativoSet.has(nameLower) || (jd?.sessions_count || 0) > 0) {
        state = 'ativo';
      }

      return {
        district_id: d.id,
        district_name: d.nome,
        state,
        sessions_count: jd?.sessions_count || 0,
        last_session_at: jd?.last_session_at || null,
      };
    });
  }, []);

  /**
   * Save therapist cartografia to profiles.cartografia_base
   */
  const saveTherapistCartografia = useCallback(async (result: CartografiaGPSResult) => {
    if (!user) return false;
    const { error } = await supabase
      .from('profiles')
      .update({ cartografia_base: result as any } as any)
      .eq('id', user.id);
    return !error;
  }, [user]);

  /**
   * Save client cartografia to clientes.cartografia_sessao
   */
  const saveClientCartografia = useCallback(async (clienteId: string, result: CartografiaGPSResult) => {
    const { error } = await supabase
      .from('clientes')
      .update({ cartografia_sessao: result as any } as any)
      .eq('id', clienteId);
    return !error;
  }, []);

  /**
   * Load therapist cartografia from profiles
   */
  const loadTherapistCartografia = useCallback(async (): Promise<CartografiaGPSResult | null> => {
    if (!user) return null;
    const { data } = await supabase
      .from('profiles')
      .select('cartografia_base')
      .eq('id', user.id)
      .single();
    return (data as any)?.cartografia_base || null;
  }, [user]);

  /**
   * Load client cartografia from clientes
   */
  const loadClientCartografia = useCallback(async (clienteId: string): Promise<CartografiaGPSResult | null> => {
    const { data } = await supabase
      .from('clientes')
      .select('cartografia_sessao')
      .eq('id', clienteId)
      .single();
    return (data as any)?.cartografia_sessao || null;
  }, []);

  /**
   * Get GPS direction for a session: loads cartografia and returns recommendations
   */
  const getSessionGPS = useCallback(async (clienteId: string) => {
    setLoading(true);
    try {
      const cartografia = await loadClientCartografia(clienteId);
      return {
        cartografia,
        distrito_foco: cartografia?.direcao_clinica?.distrito_foco || null,
        abordagem: cartografia?.direcao_clinica?.abordagem || null,
        sugestoes: cartografia?.direcao_clinica?.sugestoes || [],
        ferramentas: cartografia?.direcao_clinica?.ferramentas_indicadas || [],
        pergunta_chave: cartografia?.direcao_clinica?.pergunta_clinica || null,
      };
    } finally {
      setLoading(false);
    }
  }, [loadClientCartografia]);

  return {
    loading,
    computeDistrictStates,
    saveTherapistCartografia,
    saveClientCartografia,
    loadTherapistCartografia,
    loadClientCartografia,
    getSessionGPS,
  };
}
