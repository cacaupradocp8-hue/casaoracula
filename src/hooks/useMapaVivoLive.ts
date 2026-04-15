/**
 * Hook — Mapa Vivo Live (client_live_map_entries + client_live_map_state)
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  recalcularEstado,
  type MapaVivoEntry,
  type MapaVivoState,
} from '@/lib/cabine/motorMapaVivo';

export function useMapaVivoLive() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<MapaVivoEntry[]>([]);
  const [state, setState] = useState<MapaVivoState | null>(null);

  /** Fetch entries + state for a client */
  const fetchMapaVivo = useCallback(async (clientUserIdOrClienteId: string) => {
    if (!user) return;
    setLoading(true);

    try {
      // First try to get the client_user_id from clientes table
      const { data: clienteData } = await supabase
        .from('clientes')
        .select('client_user_id')
        .eq('id', clientUserIdOrClienteId)
        .eq('terapeuta_id', user.id)
        .maybeSingle();

      const clientUserId = clienteData?.client_user_id || clientUserIdOrClienteId;

      const [entriesRes, stateRes] = await Promise.all([
        supabase
          .from('client_live_map_entries')
          .select('*')
          .eq('client_user_id', clientUserId)
          .eq('therapist_user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('client_live_map_state')
          .select('*')
          .eq('client_user_id', clientUserId)
          .eq('therapist_user_id', user.id)
          .maybeSingle(),
      ]);

      const fetchedEntries = (entriesRes.data || []) as unknown as MapaVivoEntry[];
      setEntries(fetchedEntries);

      if (stateRes.data) {
        setState(stateRes.data as unknown as MapaVivoState);
      } else if (fetchedEntries.length > 0) {
        // Derive state from entries if no state row exists
        setState(recalcularEstado(fetchedEntries));
      } else {
        setState(null);
      }
    } catch (err) {
      console.error('Error fetching mapa vivo live:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /** Save a new entry and recalculate state */
  const salvarSnapshot = useCallback(async (
    clientUserId: string,
    entry: Omit<MapaVivoEntry, 'id' | 'created_at'>,
  ) => {
    if (!user) return false;
    setLoading(true);

    try {
      // Insert entry
      const { error: entryErr } = await supabase
        .from('client_live_map_entries')
        .insert({
          client_user_id: clientUserId,
          therapist_user_id: user.id,
          ...entry,
        });

      if (entryErr) throw entryErr;

      // Fetch updated entries to recalculate
      const { data: updatedEntries } = await supabase
        .from('client_live_map_entries')
        .select('*')
        .eq('client_user_id', clientUserId)
        .eq('therapist_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      const allEntries = (updatedEntries || []) as unknown as MapaVivoEntry[];
      const newState = recalcularEstado(allEntries);

      // Upsert state
      const { error: stateErr } = await supabase
        .from('client_live_map_state')
        .upsert({
          client_user_id: clientUserId,
          therapist_user_id: user.id,
          estado_atual: newState.estado_atual,
          direcao_atual: newState.direcao_atual,
          risco_atual: newState.risco_atual,
          tensao_principal: newState.tensao_principal,
          ritmo_atual: newState.ritmo_atual,
          repeticao_detectada: newState.repeticao_detectada,
          travessia_travada: newState.travessia_travada,
          integracao_em_curso: newState.integracao_em_curso,
          metadata_json: newState.metadata_json,
          ultimo_update: new Date().toISOString(),
        }, {
          onConflict: 'client_user_id',
        });

      if (stateErr) throw stateErr;

      setEntries(allEntries);
      setState(newState);

      toast({ title: 'Mapa Vivo atualizado' });
      return true;
    } catch (err) {
      console.error('Error saving mapa vivo snapshot:', err);
      toast({ title: 'Erro ao salvar snapshot', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  /** Update mensagem_terapeuta on state */
  const salvarMensagemTerapeuta = useCallback(async (
    clientUserId: string,
    mensagem: string,
  ) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('client_live_map_state')
        .upsert({
          client_user_id: clientUserId,
          therapist_user_id: user.id,
          mensagem_terapeuta: mensagem,
          ultimo_update: new Date().toISOString(),
        }, {
          onConflict: 'client_user_id',
        });

      if (error) throw error;
      toast({ title: 'Mensagem salva' });
      return true;
    } catch (err) {
      console.error('Error saving mensagem:', err);
      return false;
    }
  }, [user, toast]);

  return {
    loading,
    entries,
    state,
    fetchMapaVivo,
    salvarSnapshot,
    salvarMensagemTerapeuta,
  };
}
