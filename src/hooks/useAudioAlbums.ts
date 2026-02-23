// ============================================
// Hooks: Álbuns de Áudio por Estação (CRUD + Audit)
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ─── Types ───────────────────────────────────
export interface AudioAlbum {
  id: string;
  estacao_id: string;
  titulo: string;
  descricao: string | null;
  capa_url: string | null;
  status: 'draft' | 'published';
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface AudioTrack {
  id: string;
  album_id: string;
  titulo: string;
  tipo: 'audio' | 'podcast';
  audio_url: string;
  duracao_segundos: number | null;
  ordem: number;
  publicado: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ─── Audit helper ────────────────────────────
async function logAudit(tabela: string, registro_id: string, acao: string, campo_alterado?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('clube_audit_log').insert({
    tabela, registro_id, acao,
    campo_alterado: campo_alterado || null,
    valor_anterior: null,
    valor_novo: null,
    user_id: user.id,
  });
}

// ─── Albums ──────────────────────────────────
export function useAudioAlbums(estacaoId: string | undefined) {
  return useQuery({
    queryKey: ['audio-albums', estacaoId],
    enabled: !!estacaoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_audio_albums')
        .select('*')
        .eq('estacao_id', estacaoId!)
        .order('ordem');
      if (error) throw error;
      return data as AudioAlbum[];
    },
  });
}

export function useCreateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { estacao_id: string; titulo: string; descricao?: string; capa_url?: string }) => {
      const { data: existing } = await supabase
        .from('clube_audio_albums')
        .select('ordem')
        .eq('estacao_id', input.estacao_id)
        .order('ordem', { ascending: false })
        .limit(1);
      const nextOrdem = (existing?.[0]?.ordem || 0) + 1;

      const { data, error } = await supabase.from('clube_audio_albums').insert({
        estacao_id: input.estacao_id,
        titulo: input.titulo,
        descricao: input.descricao || null,
        capa_url: input.capa_url || null,
        status: 'draft' as const,
        ordem: nextOrdem,
      }).select().single();
      if (error) throw error;
      await logAudit('clube_audio_albums', data.id, 'create');
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['audio-albums'] }),
  });
}

export function useUpdateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<AudioAlbum> & { id: string }) => {
      const { error } = await supabase.from('clube_audio_albums').update(fields).eq('id', id);
      if (error) throw error;
      await logAudit('clube_audio_albums', id, 'update', Object.keys(fields).join(','));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['audio-albums'] }),
  });
}

export function useDeleteAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_audio_albums').delete().eq('id', id);
      if (error) throw error;
      await logAudit('clube_audio_albums', id, 'delete');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['audio-albums'] }),
  });
}

// ─── Tracks ──────────────────────────────────
export function useAudioTracks(albumId: string | undefined) {
  return useQuery({
    queryKey: ['audio-tracks', albumId],
    enabled: !!albumId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_audio_tracks')
        .select('*')
        .eq('album_id', albumId!)
        .order('ordem');
      if (error) throw error;
      return data as AudioTrack[];
    },
  });
}

export function useCreateTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { album_id: string; titulo: string; tipo?: 'audio' | 'podcast'; audio_url: string; tags?: string[] }) => {
      const { data: existing } = await supabase
        .from('clube_audio_tracks')
        .select('ordem')
        .eq('album_id', input.album_id)
        .order('ordem', { ascending: false })
        .limit(1);
      const nextOrdem = (existing?.[0]?.ordem || 0) + 1;

      const { data, error } = await supabase.from('clube_audio_tracks').insert({
        album_id: input.album_id,
        titulo: input.titulo,
        tipo: input.tipo || 'audio',
        audio_url: input.audio_url,
        tags: input.tags || [],
        ordem: nextOrdem,
        publicado: false,
      }).select().single();
      if (error) throw error;
      await logAudit('clube_audio_tracks', data.id, 'create');
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['audio-tracks'] }),
  });
}

export function useUpdateTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<AudioTrack> & { id: string }) => {
      const { error } = await supabase.from('clube_audio_tracks').update(fields).eq('id', id);
      if (error) throw error;
      await logAudit('clube_audio_tracks', id, 'update', Object.keys(fields).join(','));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['audio-tracks'] }),
  });
}

export function useDeleteTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_audio_tracks').delete().eq('id', id);
      if (error) throw error;
      await logAudit('clube_audio_tracks', id, 'delete');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['audio-tracks'] }),
  });
}

export function useReorderTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, newOrdem }: { id: string; newOrdem: number }) => {
      const { error } = await supabase.from('clube_audio_tracks').update({ ordem: newOrdem }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['audio-tracks'] }),
  });
}
