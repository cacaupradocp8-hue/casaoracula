import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface NarroterapiaAutorizacao {
  id: string;
  user_id: string;
  movimento_1_completado_em: string | null;
  movimento_2_aceite_em: string | null;
  movimento_3_pausa_iniciada_em: string | null;
  movimento_3_autorizado_em: string | null;
  movimento_4_selado_em: string | null;
  autorizado: boolean;
  selo_ativo: boolean;
  suspenso: boolean;
  suspenso_em: string | null;
  suspenso_por: string | null;
  motivo_suspensao: string | null;
  created_at: string;
  updated_at: string;
}

export interface PreRequisitos {
  formacaoConcluida: boolean;
  termoEticoAceito: boolean;
  supervisaoValidada: boolean;
}

export function useNarroterapiaAutorizacao() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.portal === 'admin';

  // Fetch authorization status
  const { data: autorizacao, isLoading: isLoadingAutorizacao } = useQuery({
    queryKey: ['narroterapia-autorizacao', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('narroterapia_autorizacao')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as NarroterapiaAutorizacao | null;
    },
    enabled: !!user?.id,
  });

  // Fetch prerequisites from profiles
  const { data: preRequisitos, isLoading: isLoadingPreRequisitos } = useQuery({
    queryKey: ['narroterapia-prerequisites', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('formacao_oracula_concluida, termo_etico_aceito, supervisao_validada')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return {
        formacaoConcluida: data?.formacao_oracula_concluida ?? false,
        termoEticoAceito: data?.termo_etico_aceito ?? false,
        supervisaoValidada: data?.supervisao_validada ?? false,
      } as PreRequisitos;
    },
    enabled: !!user?.id,
  });

  // Computed values
  const podeIniciarRitual = preRequisitos?.formacaoConcluida && 
                            preRequisitos?.termoEticoAceito && 
                            preRequisitos?.supervisaoValidada;

  const ritualIniciado = !!autorizacao;
  
  const movimentoAtual = (() => {
    if (!autorizacao) return null;
    if (!autorizacao.movimento_1_completado_em) return 1;
    if (!autorizacao.movimento_2_aceite_em) return 2;
    if (!autorizacao.movimento_3_autorizado_em) return 3;
    if (!autorizacao.movimento_4_selado_em) return 4;
    return null; // Ritual completo
  })();

  const autorizado = autorizacao?.autorizado ?? false;
  const seloAtivo = autorizacao?.selo_ativo ?? false;
  const suspenso = autorizacao?.suspenso ?? false;

  // Check if user has full access (authorized and not suspended, or is admin)
  const temAcessoCompleto = isAdmin || (autorizado && seloAtivo && !suspenso);

  // Iniciar ritual (create record)
  const iniciarRitualMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('narroterapia_autorizacao')
        .insert({ user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narroterapia-autorizacao'] });
    },
    onError: (error) => {
      console.error('Erro ao iniciar ritual:', error);
      toast.error('Erro ao iniciar ritual');
    },
  });

  // Completar movimento 1
  const completarMovimento1Mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !autorizacao?.id) throw new Error('Registro não encontrado');
      
      const { error } = await supabase
        .from('narroterapia_autorizacao')
        .update({ movimento_1_completado_em: new Date().toISOString() })
        .eq('id', autorizacao.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narroterapia-autorizacao'] });
    },
  });

  // Completar movimento 2 (aceite do compromisso)
  const completarMovimento2Mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !autorizacao?.id) throw new Error('Registro não encontrado');
      
      const { error } = await supabase
        .from('narroterapia_autorizacao')
        .update({ movimento_2_aceite_em: new Date().toISOString() })
        .eq('id', autorizacao.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narroterapia-autorizacao'] });
    },
  });

  // Iniciar pausa do movimento 3
  const iniciarPausaMovimento3Mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !autorizacao?.id) throw new Error('Registro não encontrado');
      
      const { error } = await supabase
        .from('narroterapia_autorizacao')
        .update({ movimento_3_pausa_iniciada_em: new Date().toISOString() })
        .eq('id', autorizacao.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narroterapia-autorizacao'] });
    },
  });

  // Completar movimento 3
  const completarMovimento3Mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !autorizacao?.id) throw new Error('Registro não encontrado');
      
      const { error } = await supabase
        .from('narroterapia_autorizacao')
        .update({ movimento_3_autorizado_em: new Date().toISOString() })
        .eq('id', autorizacao.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narroterapia-autorizacao'] });
    },
  });

  // Selar autorização (movimento 4)
  const selarAutorizacaoMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !autorizacao?.id) throw new Error('Registro não encontrado');
      
      const { error } = await supabase
        .from('narroterapia_autorizacao')
        .update({ 
          movimento_4_selado_em: new Date().toISOString(),
          autorizado: true,
          selo_ativo: true,
        })
        .eq('id', autorizacao.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narroterapia-autorizacao'] });
    },
  });

  return {
    // Estado
    isLoading: isLoadingAutorizacao || isLoadingPreRequisitos,
    preRequisitos,
    podeIniciarRitual: podeIniciarRitual || isAdmin, // Admin sempre pode
    ritualIniciado,
    movimentoAtual,
    autorizado,
    seloAtivo,
    suspenso,
    temAcessoCompleto,
    autorizacao,
    isAdmin,
    
    // Ações
    iniciarRitual: () => iniciarRitualMutation.mutateAsync(),
    completarMovimento1: () => completarMovimento1Mutation.mutateAsync(),
    completarMovimento2: () => completarMovimento2Mutation.mutateAsync(),
    iniciarPausaMovimento3: () => iniciarPausaMovimento3Mutation.mutateAsync(),
    completarMovimento3: () => completarMovimento3Mutation.mutateAsync(),
    selarAutorizacao: () => selarAutorizacaoMutation.mutateAsync(),
    
    // Loading states
    isInicializando: iniciarRitualMutation.isPending,
    isCompletandoMovimento: 
      completarMovimento1Mutation.isPending ||
      completarMovimento2Mutation.isPending ||
      iniciarPausaMovimento3Mutation.isPending ||
      completarMovimento3Mutation.isPending ||
      selarAutorizacaoMutation.isPending,
  };
}

// Hook para admin gerenciar autorizações
export function useNarroterapiaAutorizacaoAdmin() {
  const queryClient = useQueryClient();

  // Fetch all authorizations with profiles separately
  const { data: autorizacoes, isLoading } = useQuery({
    queryKey: ['narroterapia-autorizacoes-admin'],
    queryFn: async () => {
      // Fetch authorizations
      const { data: authData, error: authError } = await supabase
        .from('narroterapia_autorizacao')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (authError) throw authError;
      if (!authData) return [];
      
      // Get unique user IDs
      const userIds = [...new Set(authData.map(a => a.user_id))];
      
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;
      
      // Create a map of profiles
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      // Combine data
      return authData.map(auth => ({
        ...auth,
        profiles: profilesMap.get(auth.user_id) || null
      }));
    },
  });

  // Suspender autorização
  const suspenderMutation = useMutation({
    mutationFn: async ({ id, motivo }: { id: string; motivo: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');
      
      const { error } = await supabase
        .from('narroterapia_autorizacao')
        .update({ 
          suspenso: true,
          suspenso_em: new Date().toISOString(),
          suspenso_por: user.id,
          motivo_suspensao: motivo,
          selo_ativo: false,
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narroterapia-autorizacoes-admin'] });
      toast.success('Autorização suspensa');
    },
    onError: (error) => {
      console.error('Erro ao suspender:', error);
      toast.error('Erro ao suspender autorização');
    },
  });

  // Reativar autorização
  const reativarMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('narroterapia_autorizacao')
        .update({ 
          suspenso: false,
          suspenso_em: null,
          suspenso_por: null,
          motivo_suspensao: null,
          selo_ativo: true,
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narroterapia-autorizacoes-admin'] });
      toast.success('Autorização reativada');
    },
    onError: (error) => {
      console.error('Erro ao reativar:', error);
      toast.error('Erro ao reativar autorização');
    },
  });

  return {
    autorizacoes,
    isLoading,
    suspender: (id: string, motivo: string) => suspenderMutation.mutateAsync({ id, motivo }),
    reativar: (id: string) => reativarMutation.mutateAsync(id),
    isSuspendendo: suspenderMutation.isPending,
    isReativando: reativarMutation.isPending,
  };
}
