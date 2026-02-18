// ============================================
// HOOK: INTEGRAÇÃO ORACULAR — Clube do Livro
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface IntegracaoConfig {
  id: string;
  ciclo_id: string;
  pergunta_central?: string;
  texto_introdutorio?: string;
  movimento_1?: string;
  movimento_2?: string;
  movimento_3?: string;
  ritual_instrucao?: string;
}

export interface IntegracaoRecord {
  id: string;
  user_id: string;
  ciclo_id: string;
  registro_oracular?: string;
  movimentos_concluidos: boolean[];
  ritual_concluido: boolean;
  status: 'em_andamento' | 'concluida';
  created_at: string;
  updated_at: string;
}

// Conteúdo padrão quando não há config no banco
export const DEFAULT_CONFIG: Omit<IntegracaoConfig, 'id' | 'ciclo_id'> = {
  pergunta_central: 'O que este livro veio despertar em você?',
  texto_introdutorio:
    'A integração não é sobre entender o livro. É sobre deixar o livro entrar — e perceber o que se move por dentro quando ele atravessa.',
  movimento_1: 'Identifique uma passagem do livro que te tocou profundamente e copie-a à mão.',
  movimento_2: 'Escreva uma palavra que resume o que este conteúdo tocou em você hoje.',
  movimento_3: 'Carregue esta palavra consigo por 24 horas. Observe onde ela aparece.',
  ritual_instrucao:
    'Antes de salvar seu registro, respire fundo três vezes. O que você escreveu aqui ficará guardado só para você.',
};

// Busca a config autoral do ciclo
export function useIntegracaoConfig(cicloId: string | undefined) {
  return useQuery({
    queryKey: ['integracao-config', cicloId],
    queryFn: async () => {
      if (!cicloId) return null;
      const { data, error } = await supabase
        .from('clube_livro_integracao_config')
        .select('*')
        .eq('ciclo_id', cicloId)
        .maybeSingle();
      if (error) throw error;
      return data as IntegracaoConfig | null;
    },
    enabled: !!cicloId,
  });
}

// Busca o registro de integração da usuária para um ciclo
export function useIntegracaoRecord(cicloId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['integracao-record', cicloId, user?.id],
    queryFn: async () => {
      if (!cicloId || !user?.id) return null;
      const { data, error } = await supabase
        .from('clube_livro_integracoes')
        .select('*')
        .eq('ciclo_id', cicloId)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as IntegracaoRecord | null;
    },
    enabled: !!cicloId && !!user?.id,
  });
}

// Busca todos os registros de integração da usuária (para "Meu Caminho")
export function useMeuCaminhoIntegracoes() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['integracao-meu-caminho', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('clube_livro_integracoes')
        .select('*, clube_livro_ciclos(id, titulo, autor_livro, capa_url, tema_simbolico)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as (IntegracaoRecord & { clube_livro_ciclos: { id: string; titulo: string; autor_livro?: string; capa_url?: string; tema_simbolico?: string } | null })[];
    },
    enabled: !!user?.id,
  });
}

// Salva / atualiza o registro de integração
export function useSalvarIntegracao(cicloId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: {
      registro_oracular?: string;
      movimentos_concluidos?: boolean[];
      ritual_concluido?: boolean;
      status?: 'em_andamento' | 'concluida';
    }) => {
      if (!user?.id || !cicloId) throw new Error('Dados incompletos');

      const { data: existing } = await supabase
        .from('clube_livro_integracoes')
        .select('id')
        .eq('ciclo_id', cicloId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('clube_livro_integracoes')
          .update({ ...dados, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_livro_integracoes')
          .insert({
            user_id: user.id,
            ciclo_id: cicloId,
            ...dados,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracao-record', cicloId] });
      queryClient.invalidateQueries({ queryKey: ['integracao-meu-caminho'] });
    },
    onError: () => {
      toast.error('Não foi possível salvar sua integração.');
    },
  });
}
