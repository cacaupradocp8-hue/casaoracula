// ============================================
// Hooks Admin: CRUD Estações, Jornadas, Portais + Audit
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Estacao } from '@/hooks/useEstacoes';
import type { ClubeJornada, ClubePortal } from '@/hooks/useClubeLivro';

// ─── Audit helper ────────────────────────────
async function logAudit(tabela: string, registro_id: string, acao: string, campo_alterado?: string, valor_anterior?: string, valor_novo?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('clube_audit_log').insert({
    tabela, registro_id, acao,
    campo_alterado: campo_alterado || null,
    valor_anterior: valor_anterior || null,
    valor_novo: valor_novo || null,
    user_id: user.id,
  });
}

// ─── Estações ────────────────────────────────
export function useCreateEstacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { titulo: string; subtitulo: string; livro_titulo: string; livro_autor?: string; fase_lunar?: string }) => {
      // Get next numero/ordem
      const { data: existing } = await supabase.from('clube_estacoes').select('numero').order('numero', { ascending: false }).limit(1);
      const nextNum = (existing?.[0]?.numero || 0) + 1;

      const { data, error } = await supabase.from('clube_estacoes').insert({
        ...input,
        numero: nextNum,
        ordem: nextNum,
        ativa: false,
        publicada: false,
      }).select().single();
      if (error) throw error;
      await logAudit('clube_estacoes', data.id, 'create');
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clube-estacoes'] }),
  });
}

export function useUpdateEstacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<Estacao> & { id: string }) => {
      const { error } = await supabase.from('clube_estacoes').update(fields).eq('id', id);
      if (error) throw error;
      await logAudit('clube_estacoes', id, 'update', Object.keys(fields).join(','));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clube-estacoes'] }),
  });
}

export function useDeleteEstacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Check if active — block deletion
      const { data: est } = await supabase.from('clube_estacoes').select('ativa').eq('id', id).single();
      if (est?.ativa) throw new Error('Não é possível excluir uma estação ativa. Desative primeiro.');
      const { error } = await supabase.from('clube_estacoes').delete().eq('id', id);
      if (error) throw error;
      await logAudit('clube_estacoes', id, 'delete');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clube-estacoes'] }),
  });
}

// ─── Jornadas ────────────────────────────────
export function useCreateJornada() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { estacao_id: string; nome: string; slug: string; tipo: 'heroina' | 'sombra' | 'expressao_mundo'; subtitulo?: string; icone?: string; cor?: string }) => {
      const { data: existing } = await supabase.from('clube_jornadas').select('ordem').eq('estacao_id', input.estacao_id).order('ordem', { ascending: false }).limit(1);
      const nextOrdem = (existing?.[0]?.ordem || 0) + 1;

      const { data, error } = await supabase.from('clube_jornadas').insert({
        estacao_id: input.estacao_id,
        nome: input.nome,
        slug: input.slug,
        tipo: input.tipo,
        subtitulo: input.subtitulo || null,
        icone: input.icone || null,
        cor: input.cor || null,
        ordem: nextOrdem,
        ativa: true,
      }).select().single();
      if (error) throw error;
      await logAudit('clube_jornadas', data.id, 'create');
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clube-jornadas'] });
      qc.invalidateQueries({ queryKey: ['clube-all-portais'] });
    },
  });
}

export function useUpdateJornada() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<ClubeJornada> & { id: string }) => {
      const { error } = await supabase.from('clube_jornadas').update(fields).eq('id', id);
      if (error) throw error;
      await logAudit('clube_jornadas', id, 'update', Object.keys(fields).join(','));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clube-jornadas'] });
      qc.invalidateQueries({ queryKey: ['clube-all-portais'] });
    },
  });
}

export function useDeleteJornada() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_jornadas').delete().eq('id', id);
      if (error) throw error;
      await logAudit('clube_jornadas', id, 'delete');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clube-jornadas'] });
      qc.invalidateQueries({ queryKey: ['clube-all-portais'] });
    },
  });
}

// ─── Portais ─────────────────────────────────
export function useCreatePortal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { jornada_id: string; nome: string; slug: string; subtitulo?: string; icone?: string }) => {
      const { data: existing } = await supabase.from('clube_portais').select('ordem').eq('jornada_id', input.jornada_id).order('ordem', { ascending: false }).limit(1);
      const nextOrdem = (existing?.[0]?.ordem || 0) + 1;

      const { data, error } = await supabase.from('clube_portais').insert({
        ...input,
        ordem: nextOrdem,
        ativo: false, // starts as draft
      }).select().single();
      if (error) throw error;
      await logAudit('clube_portais', data.id, 'create');
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clube-portais'] });
      qc.invalidateQueries({ queryKey: ['clube-all-portais'] });
    },
  });
}

export function useDeletePortal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_portais').delete().eq('id', id);
      if (error) throw error;
      await logAudit('clube_portais', id, 'delete');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clube-portais'] });
      qc.invalidateQueries({ queryKey: ['clube-all-portais'] });
    },
  });
}
