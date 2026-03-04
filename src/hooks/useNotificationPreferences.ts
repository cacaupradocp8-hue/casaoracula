import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  in_app: boolean;
  push: boolean;
  email: boolean;
  novo_conteudo: boolean;
  expiracao_assinatura: boolean;
  mensagens_suporte: boolean;
  atividade_comunidade: boolean;
}

const DEFAULT_PREFS: Omit<NotificationPreferences, 'id' | 'user_id'> = {
  in_app: true,
  push: false,
  email: true,
  novo_conteudo: true,
  expiracao_assinatura: true,
  mensagens_suporte: true,
  atividade_comunidade: true,
};

export function useNotificationPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['notification-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create default preferences
        const { data: created, error: insertError } = await supabase
          .from('notification_preferences')
          .insert({ user_id: user.id, ...DEFAULT_PREFS })
          .select()
          .single();

        if (insertError) throw insertError;
        return created as NotificationPreferences;
      }

      return data as NotificationPreferences;
    },
    enabled: !!user?.id,
  });

  const updatePreference = useMutation({
    mutationFn: async (updates: Partial<Omit<NotificationPreferences, 'id' | 'user_id'>>) => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('notification_preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences', user?.id] });
      toast.success('Preferência atualizada');
    },
    onError: () => {
      toast.error('Erro ao atualizar preferência');
    },
  });

  return {
    preferences: preferences ?? (DEFAULT_PREFS as NotificationPreferences),
    isLoading,
    updatePreference: updatePreference.mutate,
  };
}
