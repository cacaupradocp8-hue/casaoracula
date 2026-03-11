import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

function formatNotificationTime(createdAt: string) {
  try {
    const normalized = createdAt.includes(' ') ? createdAt.replace(' ', 'T') : createdAt;
    const parsed = parseISO(normalized);

    if (!isValid(parsed)) {
      return 'Agora há pouco';
    }

    return formatDistanceToNow(parsed, {
      addSuffix: true,
      locale: ptBR,
    });
  } catch {
    return 'Agora há pouco';
  }
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();

  const recentNotifications = notifications.slice(0, 5);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notificações</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto py-1"
              onClick={() => markAllAsRead()}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma notificação
            </div>
          ) : (
            recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors',
                  !notification.is_read && 'bg-primary/5'
                )}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                    !notification.is_read ? 'bg-primary' : 'bg-transparent'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.body}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatNotificationTime(notification.created_at)}
                    </p>
                    {notification.cta_url && notification.cta_label && (
                      <Link
                        to={notification.cta_url}
                        className="text-xs text-primary hover:underline mt-2 inline-block"
                      >
                        {notification.cta_label} →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 5 && (
          <div className="p-3 border-t">
            <Link
              to="/notificacoes"
              className="text-sm text-primary hover:underline block text-center"
            >
              Ver todas as notificações
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
