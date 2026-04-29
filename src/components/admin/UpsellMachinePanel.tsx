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
  Zap
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

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
    mutationFn: async ({ id, status }: { id: string, status: 'sent' | 'ignored' }) => {
      const { error } = await supabase
        .from('upsell_opportunities')
        .update({ status, last_action_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['upsell-opportunities'] });
      toast({ 
        title: variables.status === 'sent' ? 'Oferta enviada!' : 'Oportunidade ignorada',
        description: variables.status === 'sent' ? 'E-mail e notificação disparados.' : 'Removido da lista atual.'
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
          <p className="text-sm text-muted-foreground">Conversão semi-manual baseada em engajamento e comportamento</p>
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
            <p className="text-xs text-muted-foreground">Média entre todos os segmentos</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Receita Estimada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Valor total convertido</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Oportunidades */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades por Segmento</CardTitle>
          <CardDescription>Usuárias com alto potencial de upgrade detectado pela IA</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuária</TableHead>
                <TableHead>De → Para</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
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
                    Nenhuma oportunidade pendente. Clique em "Detectar" para buscar novas.
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
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{opp.segment_from}</Badge>
                        <ArrowRight className="h-3 w-3" />
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{opp.segment_to}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span>Engajamento</span>
                          <span>{(opp.engagement_score * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${opp.engagement_score * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-xs italic">
                      {opp.reason}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-muted-foreground"
                        onClick={() => actionMutation.mutate({ id: opp.id, status: 'ignored' })}
                      >
                        Ignorar
                      </Button>
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => actionMutation.mutate({ id: opp.id, status: 'sent' })}
                      >
                        <Mail className="h-4 w-4" />
                        Ofertar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Taxas Históricas por Segmento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats?.map((s) => (
          <Card key={`${s.segment_from}-${s.segment_to}`} className="border-l-4 border-l-primary">
            <CardHeader className="py-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {s.segment_from} → {s.segment_to}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xl font-bold">{s.conversion_rate.toFixed(1)}%</div>
                  <div className="text-[10px] text-muted-foreground">{s.conversions} conversões de {s.total_opportunities}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">R$ {Number(s.total_revenue || 0).toLocaleString('pt-BR')}</div>
                  <div className="text-[10px] text-muted-foreground">Receita gerada</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
