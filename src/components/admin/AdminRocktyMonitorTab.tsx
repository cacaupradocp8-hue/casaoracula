import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, AlertTriangle, CheckCircle2, XCircle, Info, RefreshCw, Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface WebhookLog {
  id: string;
  provider: string;
  event_type: string;
  payload: any;
  processed: boolean;
  error: string | null;
  created_at: string;
}

interface MatriculaPendende {
  id: string;
  email: string;
  rockty_offer_id: string;
  plan_id: string;
  portal_destino: string;
  processing_status: string;
  processing_error: string | null;
  processado: boolean;
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  provider: string;
  plan_id: string;
  status: string;
  external_subscription_id: string;
  current_period_start: string | null;
  current_period_end: string | null;
  last_event_at: string | null;
  user_email?: string;
}

interface Metrics {
  totalWebhooksToday: number;
  webhooksWithError: number;
  activeSubscriptions: number;
  pendingEnrollments: number;
  unmappedOffers: number;
  divergencesCount: number;
}

export function AdminRocktyMonitorTab() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>({
    totalWebhooksToday: 0,
    webhooksWithError: 0,
    activeSubscriptions: 0,
    pendingEnrollments: 0,
    unmappedOffers: 0,
    divergencesCount: 0
  });
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<MatriculaPendende[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [divergences, setDivergences] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Webhook Logs
      const { data: logs, error: logsError } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('provider', 'rockty')
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;
      setWebhookLogs(logs || []);

      // 2. Pending Enrollments
      const { data: pending, error: pendingError } = await supabase
        .from('matriculas_pendentes')
        .select('*')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingEnrollments(pending || []);

      // 3. Subscriptions
      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('*, profiles(email)')
        .eq('provider', 'rockty')
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;
      setSubscriptions(subs?.map(s => ({ ...s, user_email: (s.profiles as any)?.email })) || []);

      // 4. Divergences - Manual comparison instead of RPC
      const { data: pData } = await supabase
        .from('profiles')
        .select('id, email, portal');
      
      const { data: rData } = await supabase
        .from('user_roles')
        .select('user_id, portal');
      
      const divList = pData?.filter(p => {
        const role = rData?.find(r => r.user_id === p.id);
        // Divergence if role exists and portal differs
        return role && role.portal !== p.portal;
      }).map(p => ({
        user_id: p.id,
        email: p.email,
        profile_portal: p.portal,
        role_portal: rData?.find(r => r.user_id === p.id)?.portal
      })) || [];
      
      setDivergences(divList);

      // 5. Calculate Metrics
      const webhooksToday = logs?.filter(l => new Date(l.created_at) >= today).length || 0;
      const webhooksError = logs?.filter(l => l.error !== null).length || 0;
      const activeSubs = subs?.filter(s => s.status === 'active' || s.status === 'trialing').length || 0;
      const pendingCount = pending?.filter(p => !p.processado).length || 0;
      const unmapped = logs?.filter(l => l.error && l.error.includes('Oferta desconhecida')).length || 0;

      setMetrics({
        totalWebhooksToday: webhooksToday,
        webhooksWithError: webhooksError,
        activeSubscriptions: activeSubs,
        pendingEnrollments: pendingCount,
        unmappedOffers: unmapped,
        divergencesCount: divergences.length
      });

    } catch (error) {
      console.error('Error fetching Rockty data:', error);
      toast.error('Erro ao carregar dados do Rockty');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      return status ? 
        <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Sim</Badge> : 
        <Badge variant="secondary">Não</Badge>;
    }
    
    switch (status?.toLowerCase()) {
      case 'active':
      case 'processed':
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Ativo</Badge>;
      case 'error':
      case 'failed':
        return <Badge variant="destructive">Erro</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500/50">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Carregando Guardiã Rockty...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Title and Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-foreground">Guardiã Rockty</h2>
          <p className="text-muted-foreground text-sm">Monitoramento em tempo real da integração de pagamentos</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Webhooks Hoje</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{metrics.totalWebhooksToday}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Erros Webhook</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-red-500">
            <div className="text-2xl font-bold">{metrics.webhooksWithError}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Assinaturas Ativas</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-green-500">
            <div className="text-2xl font-bold">{metrics.activeSubscriptions}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Matrículas Pend.</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-amber-500">
            <div className="text-2xl font-bold">{metrics.pendingEnrollments}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Ofertas Unmapped</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-purple-500">
            <div className="text-2xl font-bold">{metrics.unmappedOffers}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Divergências</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-orange-500">
            <div className="text-2xl font-bold">{divergences.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(metrics.webhooksWithError > 0 || metrics.pendingEnrollments > 0 || divergences.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Alertas de Atenção
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.webhooksWithError > 0 && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-400">Falhas em Webhooks</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Existem {metrics.webhooksWithError} webhooks que falharam no processamento. Verifique os logs para detalhes.
                  </p>
                </div>
              </div>
            )}
            {metrics.pendingEnrollments > 0 && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-3">
                <Info className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-400">Matrículas Aguardando</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.pendingEnrollments} matrículas estão pendentes de processamento pelo sistema.
                  </p>
                </div>
              </div>
            )}
            {divergences.length > 0 && (
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-400">Divergência de Portal</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {divergences.length} usuárias possuem portal em profiles diferente do portal em user_roles.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="webhooks">Webhook Logs</TabsTrigger>
          <TabsTrigger value="pending">Matrículas Pendentes</TabsTrigger>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="divergences">Divergências</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="pt-4">
          <Card>
            <div className="p-4 border-b flex justify-between items-center">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Filtrar por email ou tipo..." 
                  className="pl-9 h-9 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Identificação</TableHead>
                    <TableHead>Oferta/Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Erro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhookLogs
                    .filter(log => {
                      const search = searchTerm.toLowerCase();
                      const email = log.payload?.email || log.payload?.customer?.email || '';
                      return email.toLowerCase().includes(search) || log.event_type.toLowerCase().includes(search);
                    })
                    .map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">
                        {format(new Date(log.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {log.event_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.payload?.email || log.payload?.customer?.email || 'N/A'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {log.payload?.offer_id || log.payload?.plan_id || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(log.processed ? 'processed' : (log.error ? 'error' : 'pending'))}
                      </TableCell>
                      <TableCell className="text-xs text-red-500 max-w-[200px] truncate">
                        {log.error || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Webhook</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">ID</p>
                                  <p className="font-mono text-[10px]">{log.id}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Evento</p>
                                  <p className="font-medium">{log.event_type}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Data</p>
                                  <p>{format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Status</p>
                                  <div>{getStatusBadge(log.processed ? 'processed' : (log.error ? 'error' : 'pending'))}</div>
                                </div>
                              </div>
                              {log.error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs">
                                  <p className="font-bold mb-1">Erro:</p>
                                  {log.error}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium mb-2">Payload JSON</p>
                                <pre className="p-4 bg-muted rounded-lg text-[10px] overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(log.payload, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {webhookLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        Nenhum log de webhook encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="pt-4">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Oferta Rockty</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Portal</TableHead>
                    <TableHead>Status Proc.</TableHead>
                    <TableHead>Processado</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingEnrollments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-sm">{p.email}</TableCell>
                      <TableCell className="text-xs">{p.rockty_offer_id}</TableCell>
                      <TableCell className="text-xs">{p.plan_id}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{p.portal_destino}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className={p.processing_status === 'error' ? 'text-red-500' : ''}>
                          {p.processing_status}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(p.processado)}</TableCell>
                      <TableCell className="text-xs">
                        {format(new Date(p.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendingEnrollments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        Nenhuma matrícula pendente encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="pt-4">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Usuária</TableHead>
                    <TableHead>ID Externo</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead>Último Evento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-sm">{s.user_email || 'N/A'}</TableCell>
                      <TableCell className="text-xs font-mono">{s.external_subscription_id}</TableCell>
                      <TableCell className="text-xs">{s.plan_id}</TableCell>
                      <TableCell>{getStatusBadge(s.status)}</TableCell>
                      <TableCell className="text-xs">
                        {s.current_period_start ? format(new Date(s.current_period_start), "dd/MM/yy") : '-'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {s.current_period_end ? format(new Date(s.current_period_end), "dd/MM/yy") : '-'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {s.last_event_at ? format(new Date(s.last_event_at), "dd/MM/yy HH:mm") : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {subscriptions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        Nenhuma assinatura Rockty encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="divergences" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Usuárias com portais divergentes</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Portal (Profile)</TableHead>
                    <TableHead>Portal (Roles)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {divergences.map((d, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-sm font-medium">{d.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{d.profile_portal}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize bg-amber-500/10 border-amber-500/50 text-amber-500">
                          {d.role_portal || 'Nenhum'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          Divergente
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {divergences.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-green-500 font-medium">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        Nenhuma divergência de portal detectada. Tudo em ordem!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}