import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DecodificacaoOnirica {
  id: string;
  terapeuta_id: string;
  cliente_id: string | null;
  session_case_id: string | null;
  sonho_bruto: string;
  imagem_central: string | null;
  forca_psiquica: string | null;
  movimento_interrompido: string | null;
  mensagem_viva: string | null;
  arquetipos_sugeridos: string[];
  notas_terapeuta: string | null;
  created_at: string;
  updated_at: string;
}

export interface DecodificacaoInput {
  sonho_bruto: string;
  imagem_central?: string;
  forca_psiquica?: string;
  movimento_interrompido?: string;
  mensagem_viva?: string;
  cliente_id?: string;
  session_case_id?: string;
  arquetipos_sugeridos?: string[];
  notas_terapeuta?: string;
}

export function useDecodificacoesOnirica() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['decodificacoes-oniricas', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('decodificacao_onirica')
        .select('*')
        .eq('terapeuta_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DecodificacaoOnirica[];
    },
    enabled: !!user?.id,
  });
}

export function useDecodificacaoOnirica(id: string | undefined) {
  return useQuery({
    queryKey: ['decodificacao-onirica', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('decodificacao_onirica')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as DecodificacaoOnirica;
    },
    enabled: !!id,
  });
}

export function useCreateDecodificacao() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: DecodificacaoInput) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('decodificacao_onirica')
        .insert({
          ...input,
          terapeuta_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as DecodificacaoOnirica;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decodificacoes-oniricas'] });
      toast.success('Decodificação registrada');
    },
    onError: (error) => {
      toast.error('Erro ao registrar: ' + error.message);
    },
  });
}

export function useUpdateDecodificacao() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<DecodificacaoInput> & { id: string }) => {
      const { data, error } = await supabase
        .from('decodificacao_onirica')
        .update(input)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as DecodificacaoOnirica;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decodificacoes-oniricas'] });
      toast.success('Decodificação atualizada');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    },
  });
}

export function useDeleteDecodificacao() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('decodificacao_onirica')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decodificacoes-oniricas'] });
      toast.success('Decodificação excluída');
    },
    onError: (error) => {
      toast.error('Erro ao excluir: ' + error.message);
    },
  });
}
