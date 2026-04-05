import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CollectiveBed {
  id: string;
  season_id: string | null;
  ciclo_id: string | null;
  status: string;
  aberto_em: string;
  encerrado_em: string | null;
}

export type EntryType = 'reflexao' | 'pergunta' | 'semente_pratica' | 'eco_de_leitura' | 'fragmento';
export type ReactionType = 'ecoou' | 'guardar_refletir' | 'levar_travessia';

export interface CollectiveBedEntry {
  id: string;
  bed_id: string;
  user_id: string;
  season_id: string | null;
  ciclo_id: string | null;
  origem: 'psique' | 'oficio';
  texto: string;
  entry_type: EntryType;
  published_title: string | null;
  aprovado_por_admin: boolean;
  publicado_em: string | null;
  exibicao_anonima: boolean;
  rejeitado: boolean;
  created_at: string;
  profiles?: { nome: string | null } | null;
  author_nome?: string | null;
}

export interface CanteiroEntry extends CollectiveBedEntry {}

/** Active canteiro */
export function useActiveCanteiro() {
  return useQuery({
    queryKey: ['canteiro-ativo'],
    queryFn: async () => {
      // Use raw query to access ciclo_id (new column) + join ciclo name
      const { data, error } = await supabase
        .from('collective_beds')
        .select('*')
        .eq('status', 'ativo')
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      
      const bed = data as any;
      let cicloNome: string | null = null;
      if (bed.ciclo_id) {
        const { data: ciclo } = await supabase
          .from('clube_livro_ciclos')
          .select('titulo')
          .eq('id', bed.ciclo_id)
          .maybeSingle();
        cicloNome = ciclo?.titulo || null;
      }
      
      return {
        id: bed.id,
        season_id: bed.season_id,
        ciclo_id: bed.ciclo_id || null,
        status: bed.status,
        aberto_em: bed.aberto_em,
        encerrado_em: bed.encerrado_em,
        ciclo_nome: cicloNome,
      } as CollectiveBed & { ciclo_nome: string | null };
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
      
      const beds = (data || []) as any[];
      const cicloIds = [...new Set(beds.filter(b => b.ciclo_id).map(b => b.ciclo_id))];
      let cicloMap: Record<string, string> = {};
      if (cicloIds.length > 0) {
        const { data: ciclos } = await supabase
          .from('clube_livro_ciclos')
          .select('id, titulo')
          .in('id', cicloIds);
        cicloMap = Object.fromEntries((ciclos || []).map(c => [c.id, c.titulo]));
      }
      
      return beds.map(b => ({
        id: b.id,
        season_id: b.season_id,
        ciclo_id: b.ciclo_id || null,
        status: b.status,
        aberto_em: b.aberto_em,
        encerrado_em: b.encerrado_em,
        ciclo_nome: b.ciclo_id ? (cicloMap[b.ciclo_id] || null) : null,
      })) as (CollectiveBed & { ciclo_nome: string | null })[];
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
      ciclo_id?: string;
      origem: 'psique' | 'oficio';
      texto: string;
      exibicao_anonima: boolean;
    }) => {
      if (!user?.id) throw new Error('Não autenticado');
      // Insert using raw object to bypass stale types
      const insertData: Record<string, any> = {
        bed_id: payload.bed_id,
        origem: payload.origem,
        texto: payload.texto,
        exibicao_anonima: payload.exibicao_anonima,
        user_id: user.id,
        aprovado_por_admin: false,
      };
      if (payload.ciclo_id) {
        insertData.ciclo_id = payload.ciclo_id;
      }
      const { error } = await supabase
        .from('collective_bed_entries')
        .insert(insertData as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Partilha enviada para curadoria.');
      qc.invalidateQueries({ queryKey: ['canteiro-entries'] });
    },
    onError: () => toast.error('Erro ao enviar partilha.'),
  });
}
