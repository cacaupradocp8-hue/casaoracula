import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface JardimEntry {
  id: string;
  jardim_id: string;
  client_user_id: string;
  therapist_user_id: string;
  created_by: string;
  entry_type: string;
  content: string | null;
  shared_with_therapist: boolean;
  visibility_to_client: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClienteJardim {
  id: string;
  client_user_id: string;
  therapist_user_id: string;
  created_by: string;
  status: string;
  visibility_scope: string;
  created_at: string;
  updated_at: string;
}

export interface Pratica {
  id: string;
  client_user_id: string;
  therapist_user_id: string;
  titulo: string;
  descricao: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SessaoCompartilhada {
  id: string;
  session_date: string | null;
  status: string;
  created_at: string;
}

export interface TravessiaItem {
  id: string;
  tipo: 'entry' | 'orientacao' | 'pratica' | 'sessao';
  titulo: string;
  subtitulo?: string;
  data: string;
  status?: string;
  icone: string;
}

export function useClienteJardimCompleto() {
  const { user } = useAuth();
  const [jardim, setJardim] = useState<ClienteJardim | null>(null);
  const [entries, setEntries] = useState<JardimEntry[]>([]);
  const [praticas, setPraticas] = useState<Pratica[]>([]);
  const [sessoesCompartilhadas, setSessoesCompartilhadas] = useState<SessaoCompartilhada[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Get jardim
      const { data: jardimData } = await supabase
        .from('co_jardins')
        .select('*')
        .eq('client_user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setJardim(jardimData);

      if (!jardimData) {
        setEntries([]);
        setPraticas([]);
        setSessoesCompartilhadas([]);
        setLoading(false);
        return;
      }

      // 2. Parallel: entries, praticas, sessoes
      const [entriesRes, praticasRes, sessoesRes] = await Promise.all([
        supabase
          .from('co_jardim_entries')
          .select('*')
          .eq('jardim_id', jardimData.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('co_praticas')
          .select('*')
          .eq('client_user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('co_sessoes')
          .select('id, session_date, status, created_at')
          .eq('client_user_id', user.id)
          .eq('shared_with_client', true)
          .order('session_date', { ascending: false }),
      ]);

      // Filter entries: mine + therapist visible
      const filtered = (entriesRes.data || []).filter(
        (e) => e.created_by === user.id || e.visibility_to_client === true
      );
      setEntries(filtered);
      setPraticas(praticasRes.data || []);
      setSessoesCompartilhadas(sessoesRes.data || []);
    } catch (err) {
      console.error('Erro ao carregar jardim completo:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Entries da cliente
  const minhasEntries = useMemo(
    () => entries.filter((e) => e.created_by === user?.id),
    [entries, user]
  );

  // Entries da terapeuta visíveis
  const entriesTerapeuta = useMemo(
    () => entries.filter((e) => e.created_by !== user?.id && e.visibility_to_client),
    [entries, user]
  );

  // Práticas pendentes
  const praticasPendentes = useMemo(
    () => praticas.filter((p) => p.status !== 'concluida'),
    [praticas]
  );

  const praticasConcluidas = useMemo(
    () => praticas.filter((p) => p.status === 'concluida'),
    [praticas]
  );

  // Travessia (timeline unificada)
  const travessia = useMemo((): TravessiaItem[] => {
    const items: TravessiaItem[] = [];

    entries.forEach((e) => {
      const isOwn = e.created_by === user?.id;
      items.push({
        id: e.id,
        tipo: 'entry',
        titulo: isOwn
          ? e.entry_type === 'reflexao' ? 'Você registrou uma reflexão'
            : e.entry_type === 'sensacao' ? 'Você registrou uma sensação'
            : e.entry_type === 'sonho' ? 'Você registrou um sonho'
            : 'Você fez um registro'
          : 'Sua terapeuta deixou uma mensagem',
        subtitulo: e.content?.slice(0, 80) || undefined,
        data: e.created_at,
        icone: isOwn ? '📝' : '🌿',
      });
    });

    praticas.forEach((p) => {
      items.push({
        id: p.id,
        tipo: 'pratica',
        titulo: p.status === 'concluida' ? `Prática concluída: ${p.titulo}` : `Prática: ${p.titulo}`,
        subtitulo: p.descricao?.slice(0, 80) || undefined,
        data: p.updated_at,
        status: p.status,
        icone: p.status === 'concluida' ? '✅' : '🌱',
      });
    });

    sessoesCompartilhadas.forEach((s) => {
      items.push({
        id: s.id,
        tipo: 'sessao',
        titulo: 'Sessão registrada',
        data: s.session_date || s.created_at,
        icone: '💜',
      });
    });

    return items.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [entries, praticas, sessoesCompartilhadas, user]);

  // Contadores
  const contadores = useMemo(() => ({
    totalEntries: minhasEntries.length,
    totalPraticas: praticas.length,
    praticasConcluidas: praticasConcluidas.length,
    praticasPendentes: praticasPendentes.length,
    sessoesCompartilhadas: sessoesCompartilhadas.length,
    itensTerapeuta: entriesTerapeuta.length,
  }), [minhasEntries, praticas, praticasConcluidas, praticasPendentes, sessoesCompartilhadas, entriesTerapeuta]);

  // Criar entry
  const criarEntry = async (content: string, entryType: string = 'reflexao', sharedWithTherapist = false) => {
    if (!user || !jardim) return false;
    setSaving(true);
    try {
      const { error } = await supabase.from('co_jardim_entries').insert({
        jardim_id: jardim.id,
        client_user_id: user.id,
        therapist_user_id: jardim.therapist_user_id,
        created_by: user.id,
        entry_type: entryType,
        content,
        shared_with_therapist: sharedWithTherapist,
        visibility_to_client: true,
      });
      if (error) throw error;
      await fetchAll();
      return true;
    } catch (err) {
      console.error('Erro ao criar entry:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleSharedWithTherapist = async (entryId: string, currentValue: boolean) => {
    if (!user) return;
    try {
      await supabase
        .from('co_jardim_entries')
        .update({ shared_with_therapist: !currentValue })
        .eq('id', entryId)
        .eq('created_by', user.id);
      await fetchAll();
    } catch (err) {
      console.error('Erro ao atualizar compartilhamento:', err);
    }
  };

  return {
    jardim,
    entries,
    minhasEntries,
    entriesTerapeuta,
    praticas,
    praticasPendentes,
    praticasConcluidas,
    sessoesCompartilhadas,
    travessia,
    contadores,
    loading,
    saving,
    criarEntry,
    toggleSharedWithTherapist,
    refetch: fetchAll,
  };
}
