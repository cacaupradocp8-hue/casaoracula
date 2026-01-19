import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type {
  SessionCase,
  NarrativeMap,
  SessionScript,
  PostSessionClosure,
  SessionOracleDraw,
  SessionCaseStatus,
  OracleMode,
  InterventionType,
} from '@/types/session-room';

interface LinkedClient {
  id: string;
  nome: string;
  email?: string;
}

export function useSessionRoom() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Fetch case quota information
  const fetchCaseQuota = useCallback(async (): Promise<{ used: number; max: number; canCreate: boolean }> => {
    if (!user) return { used: 0, max: -1, canCreate: false };

    try {
      const { data, error } = await supabase.rpc('get_case_quota', { _therapist_id: user.id });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const quota = data[0];
        return {
          used: Number(quota.used_cases) || 0,
          max: Number(quota.max_cases) ?? -1,
          canCreate: Boolean(quota.can_create),
        };
      }
      
      return { used: 0, max: -1, canCreate: true };
    } catch (error) {
      console.error('Error fetching case quota:', error);
      return { used: 0, max: -1, canCreate: true };
    }
  }, [user]);

  // Fetch linked clients for the therapist
  const fetchLinkedClients = useCallback(async (): Promise<LinkedClient[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nome')
      .eq('terapeuta_id', user.id)
      .eq('status', 'ativo')
      .order('nome');

    if (error) {
      console.error('Error fetching linked clients:', error);
      return [];
    }

    return data || [];
  }, [user]);

  // Fetch all cases for the therapist
  const fetchCases = useCallback(async (status?: SessionCaseStatus): Promise<SessionCase[]> => {
    if (!user) return [];
    
    setLoading(true);
    try {
      let query = supabase
        .from('session_cases')
        .select(`
          *,
          client:clientes!session_cases_client_id_fkey(id, nome)
        `)
        .eq('therapist_id', user.id)
        .order('updated_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as SessionCase[];
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os casos.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Create a new case
  const createCase = useCallback(async (clientId: string, title: string): Promise<SessionCase | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('session_cases')
        .insert({
          therapist_id: user.id,
          client_id: clientId,
          title,
          status: 'active',
        })
        .select(`
          *,
          client:clientes!session_cases_client_id_fkey(id, nome)
        `)
        .single();

      if (error) throw error;

      toast({
        title: 'Caso criado',
        description: 'O caso foi criado com sucesso.',
      });

      return data as SessionCase;
    } catch (error) {
      console.error('Error creating case:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o caso.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Update case status
  const updateCaseStatus = useCallback(async (caseId: string, status: SessionCaseStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('session_cases')
        .update({ status })
        .eq('id', caseId);

      if (error) throw error;

      toast({
        title: 'Status atualizado',
        description: `Caso ${status === 'archived' ? 'arquivado' : 'ativado'} com sucesso.`,
      });

      return true;
    } catch (error) {
      console.error('Error updating case status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Fetch narrative map for a case
  const fetchNarrativeMap = useCallback(async (caseId: string): Promise<NarrativeMap | null> => {
    const { data, error } = await supabase
      .from('narrative_maps')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching narrative map:', error);
      return null;
    }

    return data as NarrativeMap | null;
  }, []);

  // Save or update narrative map
  const saveNarrativeMap = useCallback(async (
    caseId: string,
    clientId: string,
    mapData: Partial<NarrativeMap>,
    existingMapId?: string
  ): Promise<NarrativeMap | null> => {
    if (!user) return null;

    try {
      const payload = {
        ...mapData,
        case_id: caseId,
        therapist_id: user.id,
        client_id: clientId,
      };

      let result;
      if (existingMapId) {
        result = await supabase
          .from('narrative_maps')
          .update(payload)
          .eq('id', existingMapId)
          .select()
          .single();
      } else {
        result = await supabase
          .from('narrative_maps')
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: 'Mapa salvo',
        description: 'O mapa narrativo foi salvo com sucesso.',
      });

      return result.data as NarrativeMap;
    } catch (error) {
      console.error('Error saving narrative map:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o mapa narrativo.',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast]);

  // Fetch session script for a case
  const fetchSessionScript = useCallback(async (caseId: string): Promise<SessionScript | null> => {
    const { data, error } = await supabase
      .from('session_scripts')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching session script:', error);
      return null;
    }

    return data as SessionScript | null;
  }, []);

  // Save or update session script
  const saveSessionScript = useCallback(async (
    caseId: string,
    clientId: string,
    scriptData: Partial<SessionScript>,
    existingScriptId?: string,
    narrativeMapId?: string
  ): Promise<SessionScript | null> => {
    if (!user) return null;

    try {
      const payload = {
        ...scriptData,
        case_id: caseId,
        therapist_id: user.id,
        client_id: clientId,
        narrative_map_id: narrativeMapId || null,
      };

      let result;
      if (existingScriptId) {
        result = await supabase
          .from('session_scripts')
          .update(payload)
          .eq('id', existingScriptId)
          .select()
          .single();
      } else {
        result = await supabase
          .from('session_scripts')
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: 'Roteiro salvo',
        description: 'O roteiro de sessão foi salvo com sucesso.',
      });

      return result.data as SessionScript;
    } catch (error) {
      console.error('Error saving session script:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o roteiro.',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast]);

  // Fetch post-session closures
  const fetchClosures = useCallback(async (caseId: string): Promise<PostSessionClosure[]> => {
    const { data, error } = await supabase
      .from('post_session_closures')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching closures:', error);
      return [];
    }

    return (data || []) as PostSessionClosure[];
  }, []);

  // Create post-session closure
  const createClosure = useCallback(async (
    caseId: string,
    clientId: string,
    closureData: { moved: string; left_open: string; do_not_touch: string }
  ): Promise<PostSessionClosure | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('post_session_closures')
        .insert({
          case_id: caseId,
          therapist_id: user.id,
          client_id: clientId,
          ...closureData,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Fechamento registrado',
        description: 'O fechamento pós-sessão foi salvo.',
      });

      return data as PostSessionClosure;
    } catch (error) {
      console.error('Error creating closure:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o fechamento.',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast]);

  // Fetch oracle draws for a case
  const fetchOracleDraws = useCallback(async (caseId: string): Promise<SessionOracleDraw[]> => {
    const { data, error } = await supabase
      .from('session_oracle_draws')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching oracle draws:', error);
      return [];
    }

    return (data || []) as SessionOracleDraw[];
  }, []);

  // Create oracle draw
  const createOracleDraw = useCallback(async (
    caseId: string | null,
    clientId: string | null,
    mode: OracleMode,
    drawData: Partial<SessionOracleDraw>
  ): Promise<SessionOracleDraw | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('session_oracle_draws')
        .insert({
          therapist_id: user.id,
          client_id: clientId,
          case_id: caseId,
          mode,
          ...drawData,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Tiragem salva',
        description: 'A tiragem oracular foi registrada.',
      });

      return data as SessionOracleDraw;
    } catch (error) {
      console.error('Error creating oracle draw:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a tiragem.',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast]);

  // Update oracle draw notes
  const updateOracleNotes = useCallback(async (drawId: string, notes: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('session_oracle_draws')
        .update({ notes })
        .eq('id', drawId);

      if (error) throw error;

      toast({
        title: 'Notas salvas',
        description: 'As notas foram atualizadas.',
      });

      return true;
    } catch (error) {
      console.error('Error updating oracle notes:', error);
      return false;
    }
  }, [toast]);

  return {
    loading,
    fetchCaseQuota,
    fetchLinkedClients,
    fetchCases,
    createCase,
    updateCaseStatus,
    fetchNarrativeMap,
    saveNarrativeMap,
    fetchSessionScript,
    saveSessionScript,
    fetchClosures,
    createClosure,
    fetchOracleDraws,
    createOracleDraw,
    updateOracleNotes,
  };
}
