import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RefreshCw, CheckCircle, XCircle, Webhook, User, Zap } from 'lucide-react';

interface WebhookLog {
  id: string;
  provider: string;
  event_type: string;
  payload: Record<string, unknown>;
  processed: boolean;
  error: string | null;
  created_at: string;
}

export function WebhookDebugPanel() {
  const [expandedPayload, setExpandedPayload] = useState<string | null>(null);

  const { data: logs = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['webhook-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as WebhookLog[];
    },
    refetchInterval: 30000, // Auto-refresh every 30s
  });

  const extractUserInfo = (payload: Record<string, unknown>): string => {
    // Rockty payload structure
    const customer = payload.customer as Record<string, unknown> | undefined;
    if (customer?.email) return String(customer.email);
    
    // Generic fallback
    if (payload.email) return String(payload.email);
    if (payload.user_email) return String(payload.user_email);
    
    return 'Não identificado';
  };

  const extractAction = (log: WebhookLog): string => {
    if (!log.processed) return 'Não processado';
    if (log.error) return `Erro: ${log.error.substring(0, 50)}...`;
    
    // Deduzir ação baseado no tipo de evento
    switch (log.event_type) {
      case 'subscription_created':
        return 'Portal atualizado para iniciada';
      case 'subscription_renewed':
        return 'Assinatura renovada';
      case 'payment_failed':
        return 'Pagamento falhou - acesso mantido';
      case 'subscription_canceled':
        return 'Assinatura cancelada';
      case 'subscription_expired':
        return 'Acesso expirado';
      default:
        return 'Processado com sucesso';
    }
  };

  const getEventBadgeVariant = (eventType: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (eventType.includes('failed') || eventType.includes('expired') || eventType.includes('canceled')) {
      return 'destructive';
    }
    if (eventType.includes('created') || eventType.includes('renewed')) {
      return 'default';
    }
    return 'secondary';
  };

  const summarizePayload = (payload: Record<string, unknown>): Record<string, unknown> => {
    // Resumir payload para exibição rápida
    const summary: Record<string, unknown> = {};
    
    if (payload.event) summary.event = payload.event;
    if (payload.subscription_id) summary.subscription_id = payload.subscription_id;
    
    const customer = payload.customer as Record<string, unknown> | undefined;
    if (customer) {
      summary.customer = {
        email: customer.email,
        name: customer.name,
      };
    }
    
    const subscription = payload.subscription as Record<string, unknown> | undefined;
    if (subscription) {
      summary.subscription = {
        status: subscription.status,
        plan: subscription.plan,
      };
    }
    
    return Object.keys(summary).length > 0 ? summary : payload;
  };

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.processed && !l.error).length,
    failed: logs.filter(l => l.error).length,
    pending: logs.filter(l => !l.processed).length,
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Webhook className="w-5 h-5" />
          Webhook Debug Panel
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
          <div className="text-center p-2 bg-green-500/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Sucesso</p>
            <p className="text-xl font-bold text-green-600">{stats.success}</p>
          </div>
          <div className="text-center p-2 bg-red-500/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Erro</p>
            <p className="text-xl font-bold text-red-600">{stats.failed}</p>
          </div>
          <div className="text-center p-2 bg-yellow-500/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Pendente</p>
            <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum webhook recebido ainda
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Accordion type="single" collapsible className="space-y-2">
              {logs.map((log) => (
                <AccordionItem 
                  key={log.id} 
                  value={log.id}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 text-left w-full">
                      {/* Status icon */}
                      {log.error ? (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      ) : log.processed ? (
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse shrink-0" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={getEventBadgeVariant(log.event_type)}>
                            {log.event_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {log.provider}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="pt-2 pb-4 space-y-3">
                    {/* User */}
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Usuário:</span>
                      <span className="font-mono">{extractUserInfo(log.payload)}</span>
                    </div>
                    
                    {/* Action */}
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Ação:</span>
                      <span className={log.error ? 'text-red-500' : 'text-green-600'}>
                        {extractAction(log)}
                      </span>
                    </div>
                    
                    {/* Error if present */}
                    {log.error && (
                      <div className="p-2 bg-red-500/10 rounded text-sm text-red-600">
                        {log.error}
                      </div>
                    )}
                    
                    {/* Payload summary */}
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Payload resumido:</p>
                      <pre className="p-2 bg-muted/50 rounded text-xs overflow-x-auto max-h-32">
                        {JSON.stringify(summarizePayload(log.payload), null, 2)}
                      </pre>
                    </div>
                    
                    {/* Full payload toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setExpandedPayload(
                        expandedPayload === log.id ? null : log.id
                      )}
                    >
                      {expandedPayload === log.id ? 'Ocultar payload completo' : 'Ver payload completo'}
                    </Button>
                    
                    {expandedPayload === log.id && (
                      <pre className="p-2 bg-muted/50 rounded text-xs overflow-x-auto max-h-64">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
