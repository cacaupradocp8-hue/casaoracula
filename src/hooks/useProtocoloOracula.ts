import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ProtocoloOracula {
  id: string;
  session_case_id: string;
  terapeuta_id: string;
  cliente_id: string;
  status: 'iniciado' | 'em_andamento' | 'concluido' | 'pausado';
  mapa_registro_id: string | null;
  oraculo_registro_id: string | null;
  caminho_registro_id: string | null;
  objetivo_terapeutico: string | null;
  sintese_narrativa: string | null;
  proximos_passos: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProtocoloStatus {
  mapa: 'pendente' | 'em_andamento' | 'concluido';
  oraculo: 'pendente' | 'em_andamento' | 'concluido';
  caminho: 'pendente' | 'em_andamento' | 'concluido';
}

export function useProtocoloOracula(sessionCaseId: string | null) {
  const { user } = useAuth();
  const [protocolo, setProtocolo] = useState<ProtocoloOracula | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ProtocoloStatus>({
    mapa: 'pendente',
    oraculo: 'pendente',
    caminho: 'pendente',
  });

  const fetchProtocolo = useCallback(async () => {
    if (!sessionCaseId || !user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('protocolo_oracula')
        .select('*')
        .eq('session_case_id', sessionCaseId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProtocolo(data as ProtocoloOracula);
        setStatus({
          mapa: data.mapa_registro_id ? 'concluido' : 'pendente',
          oraculo: data.oraculo_registro_id ? 'concluido' : 'pendente',
          caminho: data.caminho_registro_id ? 'concluido' : 'pendente',
        });
      }
    } catch (error: any) {
      console.error('Error fetching protocolo:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionCaseId, user]);

  useEffect(() => {
    fetchProtocolo();
  }, [fetchProtocolo]);

  const createProtocolo = async (clienteId: string, objetivoTerapeutico?: string) => {
    if (!sessionCaseId || !user) return null;

    try {
      const { data, error } = await supabase
        .from('protocolo_oracula')
        .insert({
          session_case_id: sessionCaseId,
          terapeuta_id: user.id,
          cliente_id: clienteId,
          objetivo_terapeutico: objetivoTerapeutico || null,
          status: 'iniciado',
        })
        .select()
        .single();

      if (error) throw error;

      setProtocolo(data as ProtocoloOracula);
      toast.success('Protocolo Oracular iniciado');
      return data;
    } catch (error: any) {
      console.error('Error creating protocolo:', error);
      toast.error('Erro ao criar protocolo: ' + error.message);
      return null;
    }
  };

  const updateProtocolo = async (updates: Partial<ProtocoloOracula>) => {
    if (!protocolo) return false;

    try {
      const { error } = await supabase
        .from('protocolo_oracula')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', protocolo.id);

      if (error) throw error;

      await fetchProtocolo();
      return true;
    } catch (error: any) {
      console.error('Error updating protocolo:', error);
      toast.error('Erro ao atualizar protocolo');
      return false;
    }
  };

  const linkMapa = async (mapaRegistroId: string) => {
    return updateProtocolo({ 
      mapa_registro_id: mapaRegistroId,
      status: 'em_andamento'
    });
  };

  const linkOraculo = async (oraculoRegistroId: string) => {
    return updateProtocolo({ 
      oraculo_registro_id: oraculoRegistroId,
      status: 'em_andamento'
    });
  };

  const linkCaminho = async (caminhoRegistroId: string) => {
    const newStatus = protocolo?.mapa_registro_id && protocolo?.oraculo_registro_id 
      ? 'concluido' 
      : 'em_andamento';
    return updateProtocolo({ 
      caminho_registro_id: caminhoRegistroId,
      status: newStatus
    });
  };

  const completeProtocolo = async (sintese: string, proximosPassos: string) => {
    return updateProtocolo({
      sintese_narrativa: sintese,
      proximos_passos: proximosPassos,
      status: 'concluido'
    });
  };

  return {
    protocolo,
    loading,
    status,
    createProtocolo,
    updateProtocolo,
    linkMapa,
    linkOraculo,
    linkCaminho,
    completeProtocolo,
    refetch: fetchProtocolo,
  };
}
