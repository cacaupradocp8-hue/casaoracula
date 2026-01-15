import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Zap, Play, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AutomationSettings {
  enabled: boolean;
  last_run: string | null;
  total_today: number;
}

export function CommunicationAutomation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    notifications_created: number;
    breakdown: { pre_expiracao: number; expiracao: number; retorno: number };
  } | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['automation-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_settings')
        .select('*')
        .eq('key', 'retention_automation')
        .single();
      
      if (error) throw error;
      return data?.value as unknown as AutomationSettings;
    }
  });

  const { data: todayStats } = useQuery({
    queryKey: ['message-logs-today'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('message_logs')
        .select('type, success')
        .gte('sent_at', today.toISOString());
      
      if (error) throw error;
      
      return {
        total: data?.length || 0,
        success: data?.filter(d => d.success).length || 0,
        failed: data?.filter(d => !d.success).length || 0
      };
    }
  });

  const toggleAutomation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await supabase
        .from('automation_settings')
        .update({
          value: { ...settings, enabled },
          updated_at: new Date().toISOString()
        })
        .eq('key', 'retention_automation');
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-settings'] });
      toast({ title: 'Configuração atualizada' });
    }
  });

  const runManualScan = async () => {
    setIsRunning(true);
    setLastResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-retention-notifications', {
        body: {}
      });
      
      if (error) throw error;
      
      setLastResult(data);
      
      // Update last_run
      await supabase
        .from('automation_settings')
        .update({
          value: { 
            ...settings, 
            last_run: new Date().toISOString(),
            total_today: (settings?.total_today || 0) + (data?.notifications_created || 0)
          },
          updated_at: new Date().toISOString()
        })
        .eq('key', 'retention_automation');
      
      queryClient.invalidateQueries({ queryKey: ['automation-settings'] });
      queryClient.invalidateQueries({ queryKey: ['message-logs-today'] });
      
      toast({
        title: 'Varredura concluída',
        description: `${data?.notifications_created || 0} notificações criadas`
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro na varredura',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Automação de Retenção</CardTitle>
                <CardDescription>
                  Envio automático de notificações de pré-expiração, expiração e retorno
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={settings?.enabled || false}
              onCheckedChange={(checked) => toggleAutomation.mutate(checked)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={settings?.enabled ? 'default' : 'secondary'}>
              {settings?.enabled ? 'Ativo' : 'Desativado'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Job diário às 9h UTC
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Última Execução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {settings?.last_run 
                ? format(new Date(settings.last_run), "dd/MM HH:mm", { locale: ptBR })
                : 'Nunca'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Enviados Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{todayStats?.success || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Falhas Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{todayStats?.failed || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Manual Run */}
      <Card>
        <CardHeader>
          <CardTitle>Execução Manual</CardTitle>
          <CardDescription>
            Execute a varredura manualmente para testar ou processar pendências
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runManualScan} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Executar varredura agora
              </>
            )}
          </Button>

          {lastResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">Resultado da última execução:</p>
              <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Pré-expiração:</span>
                  <span className="ml-2 font-medium">{lastResult.breakdown.pre_expiracao}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Expiração:</span>
                  <span className="ml-2 font-medium">{lastResult.breakdown.expiracao}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Retorno:</span>
                  <span className="ml-2 font-medium">{lastResult.breakdown.retorno}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Total: {lastResult.notifications_created} notificações criadas
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
