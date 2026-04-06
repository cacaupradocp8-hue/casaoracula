import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { MapaVivoHeroina, MapaVivoHistorico, FaseJornada } from '@/types/mapa-vivo';

export function useMapaVivo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Fetch mapa for a case — scoped by therapist
  const fetchMapa = useCallback(async (caseId: string): Promise<MapaVivoHeroina | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('mapa_vivo_heroina')
      .select('*')
      .eq('session_case_id', caseId)
      .eq('therapist_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching mapa vivo:', error);
      return null;
    }

    return data as MapaVivoHeroina | null;
  }, [user]);

  // Create or update mapa
  const saveMapa = useCallback(async (
    caseId: string,
    clientId: string,
    mapaData: Partial<MapaVivoHeroina>,
    existingMapaId?: string
  ): Promise<MapaVivoHeroina | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      const payload = {
        ...mapaData,
        session_case_id: caseId,
        therapist_id: user.id,
        client_id: clientId,
      };

      let result;
      if (existingMapaId) {
        result = await supabase
          .from('mapa_vivo_heroina')
          .update(payload)
          .eq('id', existingMapaId)
          .select()
          .single();
      } else {
        result = await supabase
          .from('mapa_vivo_heroina')
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: 'Mapa salvo',
        description: 'O Mapa Vivo foi atualizado com sucesso.',
      });

      return result.data as MapaVivoHeroina;
    } catch (error) {
      console.error('Error saving mapa vivo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o mapa.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Register phase change in history
  const registrarMudancaFase = useCallback(async (
    mapaId: string,
    caseId: string,
    faseAnterior: FaseJornada | null,
    faseNova: FaseJornada,
    movimento: string | null,
    observacao?: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('mapa_vivo_historico')
        .insert({
          mapa_id: mapaId,
          session_case_id: caseId,
          therapist_id: user.id,
          fase_anterior: faseAnterior,
          fase_nova: faseNova,
          movimento,
          observacao,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error registering phase change:', error);
      return false;
    }
  }, [user]);

  // Update gesto jardim reference
  const atualizarGestoJardimRef = useCallback(async (
    mapaId: string,
    jardimRegistroId: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('mapa_vivo_heroina')
        .update({ gesto_jardim_registro_id: jardimRegistroId })
        .eq('id', mapaId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating gesto jardim ref:', error);
      return false;
    }
  }, []);

  // Fetch history for a mapa
  const fetchHistorico = useCallback(async (mapaId: string): Promise<MapaVivoHistorico[]> => {
    const { data, error } = await supabase
      .from('mapa_vivo_historico')
      .select('*')
      .eq('mapa_id', mapaId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching historico:', error);
      return [];
    }

    return (data || []) as MapaVivoHistorico[];
  }, []);

  return {
    loading,
    fetchMapa,
    saveMapa,
    registrarMudancaFase,
    fetchHistorico,
    atualizarGestoJardimRef,
  };
}
