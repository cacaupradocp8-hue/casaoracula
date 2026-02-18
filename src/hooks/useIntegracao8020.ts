// ============================================
// HOOK: INTEGRAÇÃO 80/20 — Clube do Livro
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Integracao8020Config {
  id: string;
  ciclo_id: string;
  // Bloco 1 – Essência
  essencia_texto?: string;
  tensao_central?: string;
  transformacao_proposta?: string;
  comportamento_abandonar?: string;
  // Bloco 2 – Aula
  aula_conceito?: string;
  aula_exemplo?: string;
  aula_exercicio?: string;
  // Bloco 2 – Sessão
  sessao_pergunta?: string;
  sessao_escuta?: string;
  sessao_resistencia?: string;
  // Bloco 2 – Palestra
  palestra_narrativa?: string;
  palestra_ideia?: string;
  palestra_convite?: string;
}

export interface Integracao8020Record {
  id: string;
  user_id: string;
  ciclo_id: string;
  // Bloco 3
  aplicacao_pessoal_onde?: string;
  aplicacao_pessoal_comportamento?: string;
  aplicacao_pessoal_acao?: string;
  // Bloco 4
  registro_livre?: string;
  notas_profissionais?: string;
  status: 'em_andamento' | 'concluida';
  created_at: string;
  updated_at: string;
}

// Busca a config autoral do ciclo
export function useIntegracao8020Config(cicloId: string | undefined) {
  return useQuery({
    queryKey: ['integracao-8020-config', cicloId],
    queryFn: async () => {
      if (!cicloId) return null;
      const { data, error } = await supabase
        .from('clube_livro_integracao_8020_config')
        .select('*')
        .eq('ciclo_id', cicloId)
        .maybeSingle();
      if (error) throw error;
      return data as Integracao8020Config | null;
    },
    enabled: !!cicloId,
  });
}

// Busca o registro da usuária para um ciclo
export function useIntegracao8020Record(cicloId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['integracao-8020-record', cicloId, user?.id],
    queryFn: async () => {
      if (!cicloId || !user?.id) return null;
      const { data, error } = await supabase
        .from('clube_livro_integracao_8020')
        .select('*')
        .eq('ciclo_id', cicloId)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Integracao8020Record | null;
    },
    enabled: !!cicloId && !!user?.id,
  });
}

// Busca todos os registros da usuária (para Meu Caminho)
export function useMeuCaminho8020() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['integracao-8020-meu-caminho', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('clube_livro_integracao_8020')
        .select('*, clube_livro_ciclos(id, titulo, autor_livro, capa_url, tema_simbolico)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as (Integracao8020Record & {
        clube_livro_ciclos: {
          id: string;
          titulo: string;
          autor_livro?: string;
          capa_url?: string;
          tema_simbolico?: string;
        } | null;
      })[];
    },
    enabled: !!user?.id,
  });
}

export type Integracao8020Payload = Partial<Omit<Integracao8020Record, 'id' | 'user_id' | 'ciclo_id' | 'created_at' | 'updated_at'>>;

// Salva / atualiza o registro 80/20
export function useSalvarIntegracao8020(cicloId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: Integracao8020Payload) => {
      if (!user?.id || !cicloId) throw new Error('Dados incompletos');

      const { data: existing } = await supabase
        .from('clube_livro_integracao_8020')
        .select('id')
        .eq('ciclo_id', cicloId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('clube_livro_integracao_8020')
          .update({ ...dados, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_livro_integracao_8020')
          .insert({
            user_id: user.id,
            ciclo_id: cicloId,
            ...dados,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracao-8020-record', cicloId] });
      queryClient.invalidateQueries({ queryKey: ['integracao-8020-meu-caminho'] });
    },
    onError: () => {
      toast.error('Não foi possível salvar sua integração 80/20.');
    },
  });
}
