import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Bot, 
  RefreshCw,
  Clock,
  ArrowUpRight,
  UserX,
  Zap,
  Target,
  ShieldAlert,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StagnationInfoV3 {
  user_id: string;
  nome: string;
  email: string;
  portal: string;
  subscription_status: string;
  conversion_risk_score: number;
  churn_risk_score: number;
  saas_value_risk_score: number;
  primary_risk_factor: string;
  last_value_timestamp: string;
  last_ai_use: string;
  last_clube_activity: string;
  total_cartografias: number;
}

interface UsageMetric {
  day: string;
  interactions: number;
  tokens: number;
}

interface UserTimeline {
  id: string;
  created_at: string;
  type: 'ia' | 'clube' | 'cartografia';
  description: string;
}

export default function AdminCasaOraculaTab() {
  const [stagnantUsers, setStagnantUsers] = useState<StagnationInfoV3[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);
  const [selectedUserTimeline, setSelectedUserTimeline] = useState<UserTimeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Travas da Jornada V3
      const { data: stagnationData, error: stagError } = await supabase
        .from('view_user_stagnation')
        .select('*')
        .order('last_value_timestamp', { ascending: false })
        .limit(50);
      
      if (stagError) throw stagError;
      if (stagnationData) setStagnantUsers(stagnationData as any[]);

      // 2. Métricas de Uso (Visão Geral)
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

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTimeline = async (userId: string) => {
    const { data: aiLogs } = await supabase
      .from('ai_interaction_logs')
      .select('id, created_at, modelo_usado')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(7);

    const timeline: UserTimeline[] = (aiLogs || []).map(log => ({
      id: log.id,
      created_at: log.created_at,
      type: 'ia',
      description: `Uso de IA (${log.modelo_usado})`
    }));

    setSelectedUserTimeline(timeline.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ));
  };

  const getRiskColor = (score: number) => {
    if (score > 60) return "text-red-500";
    if (score > 30) return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-foreground">Painel Mestre V3 — Governança</h2>
          <p className="text-muted-foreground">Monitoramento de conversão, churn e valor SaaS</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Inteligência
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card de Conversão */}
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Target className="w-5 h-5 text-blue-500" />
              <Badge variant="outline" className="text-blue-500">Conversão</Badge>
            </div>
            <CardTitle className="text-2xl mt-2">
              {stagnantUsers.filter(u => u.conversion_risk_score > 60).length}
            </CardTitle>
            <CardDescription>Leads em risco de abandono</CardDescription>
          </CardHeader>
        </Card>

        {/* Card de Churn */}
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <Badge variant="outline" className="text-red-500">Churn</Badge>
            </div>
            <CardTitle className="text-2xl mt-2">
              {stagnantUsers.filter(u => u.churn_risk_score > 60).length}
            </CardTitle>
            <CardDescription>Assinantes/Alunas críticas</CardDescription>
          </CardHeader>
        </Card>

        {/* Card de SaaS Value */}
        <Card className="bg-gold/5 border-gold/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Zap className="w-5 h-5 text-gold" />
              <Badge variant="outline" className="text-gold">SaaS Value</Badge>
            </div>
            <CardTitle className="text-2xl mt-2">
              {stagnantUsers.filter(u => u.saas_value_risk_score > 60).length}
            </CardTitle>
            <CardDescription>Terapeutas subutilizando IA</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="scores" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scores">Análise de Risco Detalhada</TabsTrigger>
          <TabsTrigger value="timeline">Timeline e Uso Global</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuária / Perfil</TableHead>
                    <TableHead>Conversão</TableHead>
                    <TableHead>Churn</TableHead>
                    <TableHead>SaaS Value</TableHead>
                    <TableHead>Fator Crítico</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stagnantUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="font-medium">{user.nome}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                        <Badge variant="secondary" className="mt-1 text-[10px] uppercase">
                          {user.portal || 'visitante'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-bold ${getRiskColor(user.conversion_risk_score)}`}>
                            {user.conversion_risk_score}%
                          </span>
                          <Progress value={user.conversion_risk_score} className="h-1 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-bold ${getRiskColor(user.churn_risk_score)}`}>
                            {user.churn_risk_score}%
                          </span>
                          <Progress value={user.churn_risk_score} className="h-1 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-bold ${getRiskColor(user.saas_value_risk_score)}`}>
                            {user.saas_value_risk_score}%
                          </span>
                          <Progress value={user.saas_value_risk_score} className="h-1 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-amber-500/20 text-amber-600 bg-amber-50">
                          {user.primary_risk_factor}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => fetchUserTimeline(user.user_id)}
                        >
                          Audit <ArrowUpRight className="ml-1 w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Audit Usuária</CardTitle>
              <CardDescription>Últimos 7 eventos detectados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedUserTimeline.length > 0 ? (
                  selectedUserTimeline.map((event) => (
                    <div key={event.id} className="flex gap-3 border-l-2 border-primary/20 pl-4 py-1">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{event.description}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(event.created_at), 'dd/MM HH:mm')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Selecione "Audit" em uma usuária para ver sua timeline.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Atividade Global de IA</CardTitle>
              <CardDescription>Resumo de interações por data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Interações</TableHead>
                    <TableHead>Tokens Totais</TableHead>
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
