// ============================================
// Hook: Estações Simbólicas do Clube do Livro
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Estacao {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  fase_lunar: string | null;
  livro_titulo: string;
  livro_autor: string | null;
  livro_capa_url: string | null;
  essencia_nucleo: string | null;
  essencia_tensao: string | null;
  essencia_transformacao: string | null;
  traducao_aula: string | null;
  traducao_sessao: string | null;
  traducao_circulo: string | null;
  aplicacao_reflexao: string | null;
  aplicacao_acao: string | null;
  ativa: boolean;
  publicada: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface EstacaoRegistro {
  id: string;
  user_id: string;
  estacao_id: string;
  texto: string | null;
  created_at: string;
  updated_at: string;
}

export function useEstacoes() {
  return useQuery({
    queryKey: ['clube-estacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*')
        .order('ordem');
      if (error) throw error;
      return data as Estacao[];
    },
  });
}

export function useEstacao(id: string | undefined) {
  return useQuery({
    queryKey: ['clube-estacao', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as Estacao;
    },
  });
}

export function useEstacaoRegistros(estacaoId: string | undefined) {
  return useQuery({
    queryKey: ['clube-estacao-registros', estacaoId],
    enabled: !!estacaoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacao_registros')
        .select('*')
        .eq('estacao_id', estacaoId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as EstacaoRegistro[];
    },
  });
}

export function useSaveRegistro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ estacao_id, texto }: { estacao_id: string; texto: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');
      const { error } = await supabase
        .from('clube_estacao_registros')
        .insert({ user_id: user.id, estacao_id, texto });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['clube-estacao-registros', vars.estacao_id] });
    },
  });
}
