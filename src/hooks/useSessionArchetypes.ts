import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SessionArchetype {
  id: string;
  session_id: string;
  client_id: string;
  archetype_id: string;
  notes: string | null;
  created_at: string;
  archetype?: {
    id: string;
    nome: string;
    icone: string | null;
    cor_acento: string | null;
    territorio: string;
    descricao_clinica: string;
  };
}

export function useSessionArchetypes(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['session-archetypes', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from('session_archetypes')
        .select(`*, archetype:atlas_arquetipos_femininos(id, nome, icone, cor_acento, territorio, descricao_clinica)`)
        .eq('session_id', sessionId);
      if (error) throw error;
      return data as SessionArchetype[];
    },
    enabled: !!sessionId,
  });
}

export function useClientArchetypeHistory(clientId: string | undefined) {
  return useQuery({
    queryKey: ['client-archetype-history', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from('session_archetypes')
        .select(`*, archetype:atlas_arquetipos_femininos(id, nome, icone, cor_acento, territorio, descricao_clinica)`)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SessionArchetype[];
    },
    enabled: !!clientId,
  });
}

export function useAddSessionArchetype() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { session_id: string; client_id: string; archetype_id: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('session_archetypes')
        .insert(params)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['session-archetypes', vars.session_id] });
      queryClient.invalidateQueries({ queryKey: ['client-archetype-history', vars.client_id] });
      toast.success('Arquétipo registrado na sessão');
    },
    onError: (e: any) => toast.error('Erro: ' + e.message),
  });
}

export function useRemoveSessionArchetype() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('session_archetypes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-archetypes'] });
      queryClient.invalidateQueries({ queryKey: ['client-archetype-history'] });
    },
  });
}
