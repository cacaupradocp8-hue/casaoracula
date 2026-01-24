import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EstudoRecord {
  id: string;
  user_id: string;
  audio_id: string;
  estudado_em: string;
}

export function useNarroterapiaEstudos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's study records
  const { data: estudos, isLoading } = useQuery({
    queryKey: ['narroterapia-estudos', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Using any to bypass type checking for new table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      
      const { data, error } = await client
        .from('narroterapia_estudos')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return (data || []) as EstudoRecord[];
    },
    enabled: !!user?.id,
  });

  // Mark as studied
  const markAsStudied = useMutation({
    mutationFn: async (audioId: string) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      
      const { error } = await client
        .from('narroterapia_estudos')
        .insert({
          user_id: user.id,
          audio_id: audioId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narroterapia-estudos'] });
      toast({ title: 'Marcado como estudado' });
    },
    onError: (error: Error) => {
      // If already exists, just ignore
      if (error.message?.includes('duplicate')) {
        return;
      }
      toast({ 
        title: 'Erro ao marcar', 
        description: String(error), 
        variant: 'destructive' 
      });
    },
  });

  // Unmark as studied
  const unmarkAsStudied = useMutation({
    mutationFn: async (audioId: string) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      
      const { error } = await client
        .from('narroterapia_estudos')
        .delete()
        .eq('user_id', user.id)
        .eq('audio_id', audioId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narroterapia-estudos'] });
      toast({ title: 'Desmarcado' });
    },
    onError: (error) => {
      toast({ 
        title: 'Erro ao desmarcar', 
        description: String(error), 
        variant: 'destructive' 
      });
    },
  });

  // Check if audio is studied
  const isStudied = (audioId: string): boolean => {
    return estudos?.some(e => e.audio_id === audioId) ?? false;
  };

  // Toggle study status
  const toggleStudied = (audioId: string) => {
    if (isStudied(audioId)) {
      unmarkAsStudied.mutate(audioId);
    } else {
      markAsStudied.mutate(audioId);
    }
  };

  return {
    estudos,
    isLoading,
    isStudied,
    toggleStudied,
    markAsStudied: markAsStudied.mutate,
    unmarkAsStudied: unmarkAsStudied.mutate,
    isPending: markAsStudied.isPending || unmarkAsStudied.isPending,
  };
}
