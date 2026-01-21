import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, Check, CheckCheck, Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Notificacoes() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    isLoading,
    isMarkingAllAsRead 
  } = useNotifications();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pre_expiracao':
        return 'Pré-expiração';
      case 'expiracao':
        return 'Expiração';
      case 'retorno':
        return 'Retorno';
      default:
        return 'Informação';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'pre_expiracao':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'expiracao':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'retorno':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Notificações</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Notificações</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 
                  ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` 
                  : 'Todas lidas'}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAllAsRead}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                Você não tem notificações ainda.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={cn(
                  'transition-all',
                  !notification.is_read && 'border-primary/30 bg-primary/5'
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {!notification.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{notification.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            getTypeBadgeClass(notification.type)
                          )}>
                            {getTypeLabel(notification.type)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(notification.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ptBR })})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{notification.body}</p>
                  
                  {notification.cta_url && notification.cta_label && (
                    <Link to={notification.cta_url}>
                      <Button variant="default" size="sm" className="mt-4">
                        {notification.cta_label}
                      </Button>
                    </Link>
                  )}
                  
                  {notification.read_at && (
                    <p className="text-xs text-muted-foreground mt-4">
                      Lida em {format(new Date(notification.read_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
