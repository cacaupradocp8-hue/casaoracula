import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface QaFilters {
  therapistId?: string;
  clientId?: string;
  jardimId?: string;
  dateFrom?: string;
  dateTo?: string;
  entryType?: string;
  onlySharedWithTherapist?: boolean;
  onlyVisibleToClient?: boolean;
  onlySharedWithClient?: boolean;
}

export function useQaTherapists() {
  return useQuery({
    queryKey: ['qa-therapists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .in('id', (
          await supabase.from('user_roles').select('user_id').in('portal', ['oracula', 'admin'])
        ).data?.map(r => r.user_id) || []);
      if (error) throw error;
      return data || [];
    },
  });
}

export function useQaClients(therapistId?: string) {
  return useQuery({
    queryKey: ['qa-clients', therapistId],
    queryFn: async () => {
      let q = supabase.from('clientes').select('id, nome, email, client_user_id, terapeuta_id, status');
      if (therapistId) q = q.eq('terapeuta_id', therapistId);
      const { data, error } = await q.order('nome');
      if (error) throw error;
      return data || [];
    },
  });
}

export function useQaJardins(filters: QaFilters) {
  return useQuery({
    queryKey: ['qa-jardins', filters],
    queryFn: async () => {
      let q = supabase.from('co_jardins').select('*');
      if (filters.clientId) {
        // Find client_user_id from clientes table
        const { data: cliente } = await supabase.from('clientes').select('client_user_id').eq('id', filters.clientId).single();
        if (cliente?.client_user_id) q = q.eq('client_user_id', cliente.client_user_id);
      }
      if (filters.therapistId) q = q.eq('therapist_user_id', filters.therapistId);
      if (filters.jardimId) q = q.eq('id', filters.jardimId);
      const { data, error } = await q.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: true,
  });
}

export function useQaEntries(filters: QaFilters) {
  return useQuery({
    queryKey: ['qa-entries', filters],
    queryFn: async () => {
      let q = supabase.from('co_jardim_entries').select('*');
      if (filters.jardimId) q = q.eq('jardim_id', filters.jardimId);
      if (filters.therapistId) q = q.eq('therapist_user_id', filters.therapistId);
      if (filters.entryType) q = q.eq('entry_type', filters.entryType);
      if (filters.onlySharedWithTherapist) q = q.eq('shared_with_therapist', true);
      if (filters.onlyVisibleToClient) q = q.eq('visibility_to_client', true);
      if (filters.dateFrom) q = q.gte('created_at', filters.dateFrom);
      if (filters.dateTo) q = q.lte('created_at', filters.dateTo);
      if (filters.clientId) {
        const { data: cliente } = await supabase.from('clientes').select('client_user_id').eq('id', filters.clientId).single();
        if (cliente?.client_user_id) q = q.eq('client_user_id', cliente.client_user_id);
      }
      const { data, error } = await q.order('created_at', { ascending: false }).limit(200);
      if (error) throw error;
      return data || [];
    },
    enabled: true,
  });
}

export function useQaSessoes(filters: QaFilters) {
  return useQuery({
    queryKey: ['qa-sessoes', filters],
    queryFn: async () => {
      let q = supabase.from('co_sessoes').select('*');
      if (filters.therapistId) q = q.eq('therapist_user_id', filters.therapistId);
      if (filters.onlySharedWithClient) q = q.eq('shared_with_client', true);
      if (filters.dateFrom) q = q.gte('created_at', filters.dateFrom);
      if (filters.dateTo) q = q.lte('created_at', filters.dateTo);
      if (filters.clientId) {
        const { data: cliente } = await supabase.from('clientes').select('client_user_id').eq('id', filters.clientId).single();
        if (cliente?.client_user_id) q = q.eq('client_user_id', cliente.client_user_id);
      }
      const { data, error } = await q.order('created_at', { ascending: false }).limit(200);
      if (error) throw error;
      return data || [];
    },
    enabled: true,
  });
}

export interface ConsistencyAlert {
  type: 'warning' | 'error';
  message: string;
  relatedId?: string;
}

export function computeConsistencyAlerts(
  jardins: any[],
  entries: any[],
  sessoes: any[],
  clientes: any[]
): ConsistencyAlert[] {
  const alerts: ConsistencyAlert[] = [];
  const activeClientLinks = new Set(
    clientes.filter(c => c.status === 'ativo').map(c => `${c.terapeuta_id}:${c.client_user_id}`)
  );
  const jardimIds = new Set(jardins.map(j => j.id));

  // Entries sem jardim correspondente
  entries.forEach(e => {
    if (!jardimIds.has(e.jardim_id)) {
      alerts.push({ type: 'error', message: `Entry ${e.id.slice(0,8)} sem jardim correspondente (jardim_id: ${e.jardim_id?.slice(0,8)})`, relatedId: e.id });
    }
  });

  // Jardins sem entries
  const jardinsWithEntries = new Set(entries.map(e => e.jardim_id));
  jardins.forEach(j => {
    if (!jardinsWithEntries.has(j.id)) {
      alerts.push({ type: 'warning', message: `Jardim ${j.id.slice(0,8)} sem entries`, relatedId: j.id });
    }
  });

  // Entries criadas pela cliente com shared_with_therapist = false (informativo)
  entries.filter(e => e.created_by === e.client_user_id && !e.shared_with_therapist).forEach(e => {
    alerts.push({ type: 'warning', message: `Entry ${e.id.slice(0,8)} da cliente NÃO compartilhada com terapeuta`, relatedId: e.id });
  });

  // Entries criadas pela terapeuta com visibility_to_client = false (informativo)
  entries.filter(e => e.created_by === e.therapist_user_id && !e.visibility_to_client).forEach(e => {
    alerts.push({ type: 'warning', message: `Entry ${e.id.slice(0,8)} da terapeuta NÃO visível para cliente`, relatedId: e.id });
  });

  // Sessões com jardim_ref_id inválido
  sessoes.filter(s => s.jardim_ref_id && !jardimIds.has(s.jardim_ref_id)).forEach(s => {
    alerts.push({ type: 'error', message: `Sessão ${s.id.slice(0,8)} com jardim_ref_id inválido`, relatedId: s.id });
  });

  // Sessões compartilhadas sem conteúdo mínimo
  sessoes.filter(s => s.shared_with_client && (!s.summary_internal || s.summary_internal.trim().length < 10)).forEach(s => {
    alerts.push({ type: 'warning', message: `Sessão ${s.id.slice(0,8)} compartilhada com cliente mas sem conteúdo mínimo`, relatedId: s.id });
  });

  // Registros sem vínculo ativo
  [...entries, ...sessoes].forEach(r => {
    const key = `${r.therapist_user_id}:${r.client_user_id}`;
    if (!activeClientLinks.has(key)) {
      alerts.push({ type: 'error', message: `Registro ${r.id.slice(0,8)} sem vínculo ativo terapeuta↔cliente`, relatedId: r.id });
    }
  });

  return alerts;
}
