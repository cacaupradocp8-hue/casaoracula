import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AtlasArquetipo {
  id: string;
  chave: string;
  nome: string;
  territorio: 'sustentacao' | 'travessia' | 'profundidade' | 'integracao';
  descricao_clinica: string;
  manifestacoes_frequentes: string[];
  perguntas_sessao: string[];
  riscos_projecao: string[];
  trabalhar_forca_sem_reforcar_ferida: string | null;
  icone: string;
  cor_acento: string;
  posicao_x: number;
  posicao_y: number;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface TorreArquetipoSugestao {
  id: string;
  torre_id: string;
  arquetipo_id: string;
  frequencia: 'muito_frequente' | 'comum' | 'ocasional';
  nota_clinica: string | null;
  ordem: number;
  arquetipo?: AtlasArquetipo;
}

export const TERRITORIOS = {
  sustentacao: { label: 'Sustentação', color: 'amber', ordem: 1 },
  travessia: { label: 'Travessia', color: 'violet', ordem: 2 },
  profundidade: { label: 'Profundidade', color: 'purple', ordem: 3 },
  integracao: { label: 'Integração', color: 'gold', ordem: 4 },
} as const;

export function useAtlasArquetipos() {
  return useQuery({
    queryKey: ['atlas-arquetipos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('atlas_arquetipos_femininos')
        .select('*')
        .order('territorio')
        .order('ordem');
      
      if (error) throw error;
      return data as AtlasArquetipo[];
    },
  });
}

export function useAtlasArquetipo(id: string | undefined) {
  return useQuery({
    queryKey: ['atlas-arquetipo', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('atlas_arquetipos_femininos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as AtlasArquetipo;
    },
    enabled: !!id,
  });
}

export function useArquetiposPorTorre(torreId: string | undefined) {
  return useQuery({
    queryKey: ['torre-arquetipos', torreId],
    queryFn: async () => {
      if (!torreId) return [];
      const { data, error } = await supabase
        .from('torre_arquetipo_sugestao')
        .select(`
          *,
          arquetipo:atlas_arquetipos_femininos(*)
        `)
        .eq('torre_id', torreId)
        .order('ordem');
      
      if (error) throw error;
      return data as TorreArquetipoSugestao[];
    },
    enabled: !!torreId,
  });
}

export function useUpdateArquetipo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (arquetipo: Partial<AtlasArquetipo> & { id: string }) => {
      const { data, error } = await supabase
        .from('atlas_arquetipos_femininos')
        .update(arquetipo)
        .eq('id', arquetipo.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atlas-arquetipos'] });
      toast.success('Arquétipo atualizado');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    },
  });
}

export function useCreateArquetipo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (arquetipo: Omit<AtlasArquetipo, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('atlas_arquetipos_femininos')
        .insert(arquetipo)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atlas-arquetipos'] });
      toast.success('Arquétipo criado');
    },
    onError: (error) => {
      toast.error('Erro ao criar: ' + error.message);
    },
  });
}

export function useDeleteArquetipo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('atlas_arquetipos_femininos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atlas-arquetipos'] });
      toast.success('Arquétipo excluído');
    },
    onError: (error) => {
      toast.error('Erro ao excluir: ' + error.message);
    },
  });
}
