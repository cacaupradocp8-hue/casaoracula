import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowRight, 
  Mail, 
  Bell, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  BarChart3,
  Clock,
  Target,
  UserCheck,
  Ban,
  Phone
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function UpsellMachinePanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['upsell-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('upsell_stats').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: revenueIntelligence } = useQuery({
    queryKey: ['upsell-revenue-intelligence'],
    queryFn: async () => {
      const { data, error } = await supabase.from('upsell_revenue_intelligence').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['upsell-opportunities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('upsell_opportunities')
        .select(`
          *,
          profiles:user_id (display_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('refresh_upsell_opportunities');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upsell-opportunities'] });
      toast({ title: 'Oportunidades atualizadas', description: 'Novas candidatas identificadas.' });
    }
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, status, channel }: { id: string, status: 'sent' | 'ignored', channel?: string }) => {
      // Get current opportunity to calculate attribution
      const { data: current } = await supabase
        .from('upsell_opportunities')
        .select('first_touch_channel, touch_count')
        .eq('id', id)
        .single();

      const updateData: any = { 
        status, 
        last_action_at: new Date().toISOString() 
      };

      if (status === 'sent') {
        updateData.channel_used = channel;
        updateData.last_offered_at = new Date().toISOString();
        updateData.last_touch_channel = channel;
        updateData.touch_count = (current?.touch_count || 0) + 1;
        
        if (!current?.first_touch_channel) {
          updateData.first_touch_channel = channel;
        }
      }

      if (status === 'ignored') {
        // Simple fatigue: pause for 30 days
        const pauseUntil = new Date();
        pauseUntil.setDate(pauseUntil.getDate() + 30);
        updateData.paused_until = pauseUntil.toISOString();
      }

      const { error } = await supabase
        .from('upsell_opportunities')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['upsell-opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['upsell-revenue-intelligence'] });
      toast({ 
        title: variables.status === 'sent' ? 'Oferta enviada!' : 'Oportunidade pausada',
        description: variables.status === 'sent' 
          ? `Através do canal: ${variables.channel}` 
          : 'Regra de fadiga aplicada: 30 dias de pausa.'
      });
    }
  });

  const totalRevenue = stats?.reduce((acc, curr) => acc + (Number(curr.total_revenue) || 0), 0) || 0;
  const avgConvRate = stats?.length ? stats.reduce((acc, curr) => acc + curr.conversion_rate, 0) / stats.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
            <Zap className="h-5 w-5 fill-primary" />
            Máquina de Upsell Inteligente
          </h3>
          <p className="text-sm text-muted-foreground">Fase 2.4: Revenue Intelligence & Controle de Fadiga</p>
        </div>
        <Button 
          onClick={() => refreshMutation.mutate()} 
          disabled={refreshMutation.isPending}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
          Detectar Oportunidades
        </Button>
      </div>

      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="intelligence">Revenue Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6 mt-6">
          {/* Indicadores Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Oportunidades Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{opportunities?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Aguardando ação manual</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Taxa Histórica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgConvRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Média de aceite por oferta</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Receita Gerada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
                <p className="text-xs text-muted-foreground">Valor total convertido por portal</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ranking de Ofertas Prioritárias</CardTitle>
                  <CardDescription>Usuárias elegíveis seguindo regras de pausa (30 dias)</CardDescription>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Target className="h-3 w-3" />
                  Smart Timing Ativo
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuária</TableHead>
                    <TableHead>Oferta / Audit</TableHead>
                    <TableHead>Probabilidade / Fadiga</TableHead>
                    <TableHead>Atribuição / Canal</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Analisando comportamento...
                      </TableCell>
                    </TableRow>
                  ) : opportunities?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhuma oportunidade pendente que cumpra os requisitos de timing.
                      </TableCell>
                    </TableRow>
                  ) : (
                    opportunities?.map((opp) => (
                      <TableRow key={opp.id}>
                        <TableCell>
                          <div className="font-medium">{(opp.profiles as any)?.display_name || 'Usuária'}</div>
                          <div className="text-xs text-muted-foreground">{(opp.profiles as any)?.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px]">{opp.segment_from} → {opp.segment_to}</Badge>
                              {opp.segment_from === 'Clube' && <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Top 1</Badge>}
                            </div>
                            <div className="text-[10px] text-muted-foreground italic max-w-[150px] leading-tight">
                              {opp.probability_reason || opp.reason}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span>Probabilidade</span>
                              <span className="font-bold text-primary">{((opp.probability_score || 0) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${(opp.probability_score || 0) * 100}%` }}
                              />
                            </div>
                            <div className="text-[9px] text-muted-foreground flex gap-2">
                              <span>Timing: x{opp.timing_factor?.toFixed(1) || '1.0'}</span>
                              <span>Hist: {(opp.historical_segment_rate * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="secondary" className="gap-1 font-normal text-[10px]">
                              {opp.engagement_score > 0.8 ? <Phone className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                              Sugestão: {opp.engagement_score > 0.8 ? 'Humano' : 'Email'}
                            </Badge>
                            {opp.touch_count > 0 && (
                              <div className="text-[9px] text-muted-foreground flex flex-col">
                                <span>Toques: {opp.touch_count}</span>
                                <span>Last: {opp.last_touch_channel || 'N/A'}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => actionMutation.mutate({ id: opp.id, status: 'ignored' })}
                            >
                              Pausar
                            </Button>
                            <Button 
                              size="sm" 
                              className="gap-2"
                              onClick={() => actionMutation.mutate({ 
                                id: opp.id, 
                                status: 'sent', 
                                channel: opp.engagement_score > 0.8 ? 'Humano' : 'Email' 
                              })}
                            >
                              <Zap className="h-3 w-3 fill-current" />
                              Ofertar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Melhor Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Humano
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Atribuição: {revenueIntelligence?.find(r => r.channel_used === 'Humano')?.acceptance_rate || 0}% aceite
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Smart Timing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {revenueIntelligence?.reduce((acc, curr) => acc + (curr.avg_days_to_convert || 0), 0) > 0 
                    ? `D+${Math.round(revenueIntelligence.reduce((acc, curr) => acc + (curr.avg_days_to_convert || 0), 0) / revenueIntelligence.length)} Conversão`
                    : 'Analisando...'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Dias médios para aceite</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Fadiga Ativa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold flex items-center gap-2 text-amber-600">
                  <UserCheck className="h-5 w-5" />
                  {revenueIntelligence?.reduce((acc, curr) => acc + (Number(curr.fatigue_count) || 0), 0) || 0} Usuárias
                </div>
                <p className="text-xs text-muted-foreground mt-1">Pausadas (Regra 30 dias)</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardHeader className="py-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Estimativa LTV ↑</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-primary">
                  R$ {revenueIntelligence?.reduce((acc, curr) => acc + (Number(curr.revenue_generated) || 0), 0).toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Incremento gerado</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Intelligence por Segmento</CardTitle>
              <CardDescription>Análise de atribuição Last Touch e performance financeira</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oferta (Ranking)</TableHead>
                    <TableHead>Último Canal</TableHead>
                    <TableHead>Taxa de Aceite</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead className="text-right">Receita Gerada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueIntelligence?.map((ri, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{ri.segment_from} → {ri.segment_to}</span>
                          <span className="text-[10px] text-muted-foreground italic">
                            {ri.segment_from === 'Clube' ? 'Prioridade Máxima' : 'Upsell Tecnológico'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal capitalize">{ri.channel_used || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{ri.acceptance_rate}%</span>
                          <div className="w-12 h-1 bg-muted rounded-full">
                            <div className="h-full bg-primary" style={{ width: `${ri.acceptance_rate}%` }} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{ri.total_sent} ofertas</TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        R$ {Number(ri.revenue_generated || 0).toLocaleString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!revenueIntelligence?.length && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground italic">
                        Aguardando volume de dados para processar inteligência...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

