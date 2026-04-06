import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CollectiveBedEntry, EntryType, CanteiroEntry } from './types';

export type { CollectiveBedEntry, CanteiroEntry };

/** Published entries for a specific canteiro bed */
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

      const entries = (data || []) as CollectiveBedEntry[];
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

/** Published entries for the public Canteiro page */
export function useCanteiroPublicEntries(filterType?: EntryType | 'todos') {
  return useQuery({
    queryKey: ['canteiro-public-entries', filterType],
    queryFn: async () => {
      let query = supabase
        .from('collective_bed_entries')
        .select('id, user_id, texto, entry_type, published_title, origem, exibicao_anonima, publicado_em, created_at')
        .eq('aprovado_por_admin', true)
        .not('publicado_em', 'is', null)
        .eq('rejeitado', false)
        .is('removed_at', null)
        .order('publicado_em', { ascending: false })
        .limit(50);

      if (filterType && filterType !== 'todos') {
        query = query.eq('entry_type', filterType);
      }

      const { data, error } = await query;
      if (error) throw error;

      const entries = (data || []) as CollectiveBedEntry[];
      const userIds = [...new Set(entries.filter(e => !e.exibicao_anonima).map(e => e.user_id))];

      let profileMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, nome')
          .in('id', userIds);
        profiles?.forEach(p => { profileMap[p.id] = p.nome || 'Anônima'; });
      }

      return entries.map(e => ({
        ...e,
        author_nome: e.exibicao_anonima ? null : (profileMap[e.user_id] || 'Anônima'),
      })) as CanteiroEntry[];
    },
  });
}

/** Archived canteiros */
export function useArchivedCanteiros() {
  return useQuery({
    queryKey: ['canteiros-arquivados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collective_beds')
        .select('*')
        .in('status', ['encerrado', 'arquivado'])
        .order('encerrado_em', { ascending: false });
      if (error) throw error;

      const beds = (data || []) as Array<CollectiveBedEntry & { ciclo_id?: string }>;
      const cicloIds = [...new Set(beds.filter((b: any) => b.ciclo_id).map((b: any) => b.ciclo_id))];
      let cicloMap: Record<string, string> = {};
      if (cicloIds.length > 0) {
        const { data: ciclos } = await supabase
          .from('clube_livro_ciclos')
          .select('id, titulo')
          .in('id', cicloIds);
        cicloMap = Object.fromEntries((ciclos || []).map(c => [c.id, c.titulo]));
      }

      return beds.map((b: any) => ({
        id: b.id,
        season_id: b.season_id,
        ciclo_id: b.ciclo_id || null,
        status: b.status,
        aberto_em: b.aberto_em,
        encerrado_em: b.encerrado_em,
        ciclo_nome: b.ciclo_id ? (cicloMap[b.ciclo_id] || null) : null,
      }));
    },
  });
}
