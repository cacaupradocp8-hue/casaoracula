import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Orientacao {
  id: string;
  cliente_id: string;
  terapeuta_id: string;
  session_id: string | null;
  tipo: 'pratica' | 'escuta' | 'reflexao' | 'territorio' | 'foco_semana';
  titulo: string | null;
  mensagem: string;
  conteudo_id: string | null;
  status: 'pending' | 'viewed' | 'completed';
  resposta_cliente: string | null;
  completada_em: string | null;
  created_at: string;
  updated_at: string;
}

// Hook for THERAPIST side
export function useOrientacoesTerapeuta(clienteId: string) {
  const { user } = useAuth();
  const [orientacoes, setOrientacoes] = useState<Orientacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    if (!user || !clienteId) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('co_orientacoes')
        .select('*')
        .eq('cliente_id', clienteId)
        .eq('terapeuta_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrientacoes(data || []);
    } catch (err) {
      console.error('Erro ao carregar orientações:', err);
    } finally {
      setLoading(false);
    }
  }, [user, clienteId]);

  useEffect(() => { fetch(); }, [fetch]);

  const criar = async (dados: {
    tipo: string;
    titulo?: string;
    mensagem: string;
    conteudo_id?: string;
    session_id?: string;
  }) => {
    if (!user || !clienteId) return false;
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('co_orientacoes')
        .insert({
          cliente_id: clienteId,
          terapeuta_id: user.id,
          tipo: dados.tipo,
          titulo: dados.titulo || null,
          mensagem: dados.mensagem,
          conteudo_id: dados.conteudo_id || null,
          session_id: dados.session_id || null,
        });

      if (error) throw error;
      toast.success('🌿 Orientação enviada ao Jardim');
      await fetch();
      return true;
    } catch (err) {
      console.error('Erro ao criar orientação:', err);
      toast.error('Erro ao enviar orientação');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { orientacoes, loading, saving, criar, refetch: fetch };
}

// Hook for CLIENT side
export function useOrientacoesCliente() {
  const { user } = useAuth();
  const [orientacoes, setOrientacoes] = useState<Orientacao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Get client records linked to this user
      const { data: clientes } = await supabase
        .from('clientes')
        .select('id')
        .eq('client_user_id', user.id);

      if (!clientes || clientes.length === 0) {
        setOrientacoes([]);
        setLoading(false);
        return;
      }

      const clienteIds = clientes.map(c => c.id);

      const { data, error } = await (supabase as any)
        .from('co_orientacoes')
        .select('*')
        .in('cliente_id', clienteIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrientacoes(data || []);
    } catch (err) {
      console.error('Erro ao carregar orientações:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const marcarVista = async (id: string) => {
    try {
      await (supabase as any)
        .from('co_orientacoes')
        .update({ status: 'viewed' })
        .eq('id', id)
        .eq('status', 'pending');
      await fetch();
    } catch (err) {
      console.error('Erro ao marcar orientação:', err);
    }
  };

  const completar = async (id: string, resposta?: string) => {
    try {
      await (supabase as any)
        .from('co_orientacoes')
        .update({
          status: 'completed',
          completada_em: new Date().toISOString(),
          resposta_cliente: resposta || null,
        })
        .eq('id', id);

      toast.success('🌿 Prática concluída');
      await fetch();
      return true;
    } catch (err) {
      console.error('Erro ao completar orientação:', err);
      toast.error('Erro ao salvar');
      return false;
    }
  };

  const responder = async (id: string, resposta: string) => {
    try {
      await (supabase as any)
        .from('co_orientacoes')
        .update({ resposta_cliente: resposta })
        .eq('id', id);

      toast.success('Reflexão salva');
      await fetch();
      return true;
    } catch (err) {
      console.error('Erro ao responder:', err);
      toast.error('Erro ao salvar');
      return false;
    }
  };

  return { orientacoes, loading, marcarVista, completar, responder, refetch: fetch };
}
