import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CollectiveBed {
  id: string;
  season_id: string;
  status: string;
  aberto_em: string;
  encerrado_em: string | null;
}

export interface CollectiveBedEntry {
  id: string;
  bed_id: string;
  user_id: string;
  season_id: string;
  origem: 'psique' | 'oficio';
  texto: string;
  aprovado_por_admin: boolean;
  publicado_em: string | null;
  exibicao_anonima: boolean;
  rejeitado: boolean;
  created_at: string;
  // joined
  profiles?: { nome: string | null } | null;
}

/** Active canteiro (linked to active season) */
export function useActiveCanteiro() {
  return useQuery({
    queryKey: ['canteiro-ativo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collective_beds')
        .select('*, oracular_seasons(id, nome_estacao, simbolo, periodo)')
        .eq('status', 'ativo')
        .maybeSingle();
      if (error) throw error;
      return data as (CollectiveBed & {
        oracular_seasons: { id: string; nome_estacao: string; simbolo: string | null; periodo: string | null } | null;
      }) | null;
    },
  });
}

/** Published entries for a canteiro */
export function useCanteiroEntries(bedId: string | undefined, origem?: 'psique' | 'oficio') {
  return useQuery({
    queryKey: ['canteiro-entries', bedId, origem],
    queryFn: async () => {
      if (!bedId) return [];
      let q = supabase
        .from('collective_bed_entries')
        .select('*')
        .eq('bed_id', bedId)
        .eq('aprovado_por_admin', true)
        .not('publicado_em', 'is', null)
        .eq('rejeitado', false)
        .order('publicado_em', { ascending: false });
      if (origem) q = q.eq('origem', origem);
      const { data, error } = await q;
      if (error) throw error;
      
      // Fetch display names separately for non-anonymous entries
      const entries = (data || []) as any[];
      const userIds = [...new Set(entries.filter(e => !e.exibicao_anonima).map(e => e.user_id))];
      let profileMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, nome')
          .in('id', userIds);
        profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p.nome || '']));
      }
      
      return entries.map(e => ({
        ...e,
        profiles: e.exibicao_anonima ? null : { nome: profileMap[e.user_id] || null },
      })) as CollectiveBedEntry[];
    },
    enabled: !!bedId,
  });
}

/** Archived canteiros (for formação) */
export function useArchivedCanteiros() {
  return useQuery({
    queryKey: ['canteiros-arquivados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collective_beds')
        .select('*, oracular_seasons(id, nome_estacao, simbolo, periodo)')
        .in('status', ['encerrado', 'arquivado'])
        .order('encerrado_em', { ascending: false });
      if (error) throw error;
      return (data || []) as (CollectiveBed & {
        oracular_seasons: { id: string; nome_estacao: string; simbolo: string | null; periodo: string | null } | null;
      })[];
    },
  });
}

/** Submit a partilha to canteiro */
export function useSubmitPartilha() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      bed_id: string;
      season_id: string;
      origem: 'psique' | 'oficio';
      texto: string;
      exibicao_anonima: boolean;
    }) => {
      if (!user?.id) throw new Error('Não autenticado');
      const { error } = await supabase
        .from('collective_bed_entries')
        .insert({
          ...payload,
          user_id: user.id,
          aprovado_por_admin: false,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Partilha enviada para curadoria.');
      qc.invalidateQueries({ queryKey: ['canteiro-entries'] });
    },
    onError: () => toast.error('Erro ao enviar partilha.'),
  });
}
