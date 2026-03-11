import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  type: 'pre_expiracao' | 'expiracao' | 'retorno' | 'info';
  title: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const LOG_PREFIX = '[boot-debug][notifications]';

  const {
    data: notifications = [],
    isLoading,
    refetch,
    error,
    isError,
  } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.info(`${LOG_PREFIX} sem usuário autenticado, query ignorada`);
        return [];
      }

      console.info(`${LOG_PREFIX} carregamento de notificações iniciado`, { userId: user.id });
      const { data, error: queryError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error(`${LOG_PREFIX} falha no carregamento`, queryError);
        throw queryError;
      }

      console.info(`${LOG_PREFIX} carregamento concluído`, { count: data?.length ?? 0 });
      return data as Notification[];
    },
    enabled: !!user?.id,
    refetchInterval: 60000,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user?.id) return;

    console.info(`${LOG_PREFIX} assinando realtime`, { userId: user.id });
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.info(`${LOG_PREFIX} novo evento realtime, invalidando cache`, { userId: user.id });
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
        }
      )
      .subscribe();

    return () => {
      console.info(`${LOG_PREFIX} removendo assinatura realtime`, { userId: user.id });
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const errorMessage = isError
    ? (error instanceof Error ? error.message : 'Não foi possível carregar notificações.')
    : null;

  return {
    notifications,
    unreadCount,
    isLoading,
    refetch,
    error: errorMessage,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    isMarkingAsRead: markAsRead.isPending,
    isMarkingAllAsRead: markAllAsRead.isPending,
  };
}
