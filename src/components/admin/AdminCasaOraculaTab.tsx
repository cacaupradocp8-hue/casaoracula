import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Bot, 
  Search, 
  RefreshCw,
  Clock,
  ArrowUpRight,
  UserX,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StagnationInfo {
  user_id: string;
  nome: string;
  email: string;
  plan_id: string;
  subscription_status: string;
  last_ai_use: string;
  last_clube_activity: string;
  stagnation_reason: string;
  last_any_activity: string;
}

interface UsageMetric {
  day: string;
  interactions: number;
  tokens: number;
}

interface CostLeak {
  user_id: string;
  nome: string;
  total_tokens: number;
  total_requests: number;
}

export default function AdminCasaOraculaTab() {
  const [stagnantUsers, setStagnantUsers] = useState<StagnationInfo[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);
  const [costLeaks, setCostLeaks] = useState<CostLeak[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Travas da Jornada
      const { data: stagnationData } = await supabase
        .from('view_user_stagnation')
        .select('*')
        .neq('stagnation_reason', 'Ativa')
        .limit(20);
      
      if (stagnationData) setStagnantUsers(stagnationData as StagnationInfo[]);

      // 2. Métricas de Uso (Visão Geral)
      // Usamos query direta para a Fase 1
      const { data: directMetrics } = await supabase
        .from('ai_interaction_logs')
        .select('created_at, tokens_used')
        .order('created_at', { ascending: false })
        .limit(1000);
      
      if (directMetrics) {
        const grouped: Record<string, UsageMetric> = {};
        directMetrics.forEach(log => {
          const date = format(new Date(log.created_at), 'yyyy-MM-dd');
          if (!grouped[date]) grouped[date] = { day: date, interactions: 0, tokens: 0 };
          grouped[date].interactions++;
          grouped[date].tokens += log.tokens_used || 0;
        });
        setUsageMetrics(Object.values(grouped).sort((a, b) => b.day.localeCompare(a.day)));
      }

      // 3. Vazamentos de Dinheiro (Top Users por Token)
      const { data: leaksData } = await supabase
        .from('ai_interaction_logs')
        .select('user_id, tokens_used, profiles(nome)')
        .order('created_at', { ascending: false });
      
      if (leaksData) {
        const userLeaks: Record<string, CostLeak> = {};
        leaksData.forEach(log => {
          const uid = log.user_id;
          if (!userLeaks[uid]) {
            userLeaks[uid] = { 
              user_id: uid, 
              nome: (log.profiles as any)?.nome || 'Usuária', 
              total_tokens: 0, 
              total_requests: 0 
            };
          }
          userLeaks[uid].total_tokens += log.tokens_used || 0;
          userLeaks[uid].total_requests++;
        });
        setCostLeaks(Object.values(userLeaks).sort((a, b) => b.total_tokens - a.total_tokens).slice(0, 10));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-foreground">Casa Orácula — Painel Mestre</h2>
          <p className="text-muted-foreground">Monitoramento de saúde e jornada do ecossistema</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <UserX className="w-5 h-5 text-amber-500" />
              <Badge variant="outline" className="text-amber-500 border-amber-500/30">Alerta</Badge>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-amber-500">{stagnantUsers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Usuárias Travadas na Jornada</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gold/5 border-gold/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Zap className="w-5 h-5 text-gold" />
              <Badge variant="outline" className="text-gold border-gold/30">Real-time</Badge>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-gold">
                {usageMetrics.reduce((acc, m) => acc + m.interactions, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Interações de IA (7 dias)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">
                {costLeaks.length > 0 ? (costLeaks[0].total_tokens / 1000).toFixed(1) + 'k' : '0'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Tokens (Top User Ativa)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-emerald-500">
                {stagnantUsers.filter(u => u.subscription_status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Assinantes Inativas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="travas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="travas" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Travas da Jornada
          </TabsTrigger>
          <TabsTrigger value="uso" className="gap-2">
            <Bot className="w-4 h-4" />
            Visualização de Uso (IA)
          </TabsTrigger>
          <TabsTrigger value="custos" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Vazamentos (Money)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="travas" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usuárias Estagnadas</CardTitle>
              <CardDescription>Detecção automática de abandono ou dificuldades na jornada</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuária</TableHead>
                    <TableHead>Motivo da Trava</TableHead>
                    <TableHead>Última Atividade</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stagnantUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhuma usuária travada detectada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    stagnantUsers.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div className="font-medium">{user.nome}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                            {user.stagnation_reason}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {user.last_any_activity 
                            ? format(new Date(user.last_any_activity), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                            : 'Nunca'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.plan_id || 'Free'}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            Ver Perfil <ArrowUpRight className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uso" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividade de IA (Logs)</CardTitle>
              <CardDescription>Consumo de recursos por dia</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Interações</TableHead>
                    <TableHead>Tokens Totais</TableHead>
                    <TableHead>Média/Interação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageMetrics.map((m) => (
                    <TableRow key={m.day}>
                      <TableCell className="font-medium">
                        {format(new Date(m.day), 'eeee, dd/MM', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{m.interactions}</TableCell>
                      <TableCell>{m.tokens.toLocaleString()}</TableCell>
                      <TableCell>{Math.round(m.tokens / (m.interactions || 1)).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custos" className="space-y-4 pt-4">
          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Monitor de "Vazamentos"
                <Badge variant="destructive" className="animate-pulse">Modo Leitura</Badge>
              </CardTitle>
              <CardDescription>Usuárias com consumo de tokens acima da média (30 dias)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuária</TableHead>
                    <TableHead>Requisições</TableHead>
                    <TableHead>Tokens Acumulados</TableHead>
                    <TableHead>Custo Est. (USD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costLeaks.map((leak) => (
                    <TableRow key={leak.user_id}>
                      <TableCell className="font-medium">{leak.nome}</TableCell>
                      <TableCell>{leak.total_requests}</TableCell>
                      <TableCell className="font-mono text-amber-600 font-bold">
                        {leak.total_tokens.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ${(leak.total_tokens * 0.00001).toFixed(3)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
