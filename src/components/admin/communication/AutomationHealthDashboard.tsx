import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Activity, 
  AlertTriangle, 
  PauseCircle, 
  PlayCircle, 
  TrendingDown, 
  History,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export function AutomationHealthDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rules, isLoading: loadingRules } = useQuery({
    queryKey: ['automation-rules-health'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: executionLogs } = useQuery({
    queryKey: ['automation-execution-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_execution_logs')
        .select('*')
        .order('triggered_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    }
  });

  const { data: alerts } = useQuery({
    queryKey: ['automation-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const toggleRuleMutation = useMutation({
    mutationFn: async ({ id, active, pause24h }: { id: string, active: boolean, pause24h?: boolean }) => {
      const updates: any = { is_active: active };
      if (pause24h) {
        updates.paused_until = addHours(new Date(), 24).toISOString();
        updates.is_active = false;
      } else if (active) {
        updates.paused_until = null;
      }
      
      const { error } = await supabase
        .from('automation_rules')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules-health'] });
      toast({ title: 'Regra atualizada com sucesso' });
    }
  });

  const resolveAlertMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('automation_alerts')
        .update({ is_resolved: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-alerts'] });
      toast({ title: 'Alerta resolvido' });
    }
  });

  if (loadingRules) return <div className="p-8 text-center">Carregando saúde das automações...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Dashboard de Saúde das Automações
          </h3>
          <p className="text-sm text-muted-foreground">Monitoramento de execução, alertas e performance em tempo real</p>
        </div>
      </div>

      {/* Alertas Ativos */}
      {alerts && alerts.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.severity === 'critical' ? 'border-l-red-600' : 
              alert.severity === 'high' ? 'border-l-orange-500' : 'border-l-yellow-400'
            }`}>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'critical' ? 'text-red-600' : 'text-orange-500'
                  }`} />
                  <div>
                    <CardTitle className="text-sm font-bold uppercase">{alert.alert_type}</CardTitle>
                    <CardDescription className="text-foreground">{alert.message}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => resolveAlertMutation.mutate(alert.id)}>
                  Marcar como resolvido
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Grid de Performance e Regras */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Regras e Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Regra</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sucesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules?.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">
                      {rule.rule_type} - {rule.action_type}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.channel}</Badge>
                    </TableCell>
                    <TableCell>
                      {rule.paused_until && new Date(rule.paused_until) > new Date() ? (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" /> Pausada até {format(new Date(rule.paused_until), "HH:mm")}
                        </Badge>
                      ) : rule.is_active ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativa</Badge>
                      ) : (
                        <Badge variant="destructive">Desativada</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className={rule.success_threshold > 0.1 ? 'text-green-600' : 'text-red-600 font-bold'}>
                          {(rule.success_threshold * 100).toFixed(1)}%
                        </span>
                        {rule.success_threshold < 0.1 && <TrendingDown className="h-3 w-3 text-red-600" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {rule.is_active ? (
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-orange-600" 
                            title="Pausar 24h"
                            onClick={() => toggleRuleMutation.mutate({ id: rule.id, active: false, pause24h: true })}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8" 
                            title="Desativar"
                            onClick={() => toggleRuleMutation.mutate({ id: rule.id, active: false })}
                          >
                            <PauseCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-green-600" 
                          title="Ativar"
                          onClick={() => toggleRuleMutation.mutate({ id: rule.id, active: true })}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Logs de Execução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {executionLogs?.map((log) => (
                <div key={log.id} className="flex items-start justify-between border-b pb-2 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">User: {log.user_id.substring(0, 8)}...</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.triggered_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                    </p>
                    <p className="text-xs italic">Time: {log.response_time_ms}ms</p>
                  </div>
                  <div className="text-right">
                    {log.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                    )}
                    <Badge variant="outline" className="text-[10px] mt-1">{log.channel}</Badge>
                  </div>
                </div>
              ))}
              {(!executionLogs || executionLogs.length === 0) && (
                <p className="text-sm text-center text-muted-foreground py-4">Nenhum log recente.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
