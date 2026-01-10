import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { 
  SyntheiaFormData, 
  SyntheiaGeneratedContent, 
  SyntheiaCreation 
} from '@/types/syntheia';

export function useSyntheiaGenerate() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async (formData: SyntheiaFormData): Promise<SyntheiaGeneratedContent | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('syntheia-generate', {
        body: formData,
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data as SyntheiaGeneratedContent;
    } catch (error) {
      console.error('Error generating:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao gerar conteúdo');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating };
}

export function useSyntheiaLibrary() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: creations = [], isLoading } = useQuery({
    queryKey: ['syntheia-creations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('syntheia_creations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SyntheiaCreation[];
    },
    enabled: !!user?.id,
  });

  const saveCreation = useMutation({
    mutationFn: async (creation: Omit<SyntheiaCreation, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('syntheia_creations')
        .insert(creation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syntheia-creations'] });
      toast.success('Criação salva na biblioteca!');
    },
    onError: (error) => {
      console.error('Error saving creation:', error);
      toast.error('Erro ao salvar criação');
    },
  });

  const deleteCreation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('syntheia_creations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syntheia-creations'] });
      toast.success('Criação removida');
    },
    onError: (error) => {
      console.error('Error deleting creation:', error);
      toast.error('Erro ao remover criação');
    },
  });

  const updateCreation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SyntheiaCreation> & { id: string }) => {
      const { data, error } = await supabase
        .from('syntheia_creations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syntheia-creations'] });
      toast.success('Criação atualizada');
    },
    onError: (error) => {
      console.error('Error updating creation:', error);
      toast.error('Erro ao atualizar criação');
    },
  });

  return {
    creations,
    isLoading,
    saveCreation,
    deleteCreation,
    updateCreation,
  };
}
