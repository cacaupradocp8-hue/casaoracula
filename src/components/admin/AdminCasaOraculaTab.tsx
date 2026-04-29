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
  Users,
  CheckCircle2,
  Calendar,
  EyeOff,
  UserCircle,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StagnationInfoV4 {
  user_id: string;
  nome: string;
  email: string;
  portal: string;
  subscription_status: string;
  conversion_risk_score: number;
  churn_risk_score: number;
  saas_value_risk_score: number;
  action_reason: string;
  recommended_action: string;
  suggested_channel: string;
  priority_level: 'Alta' | 'Média' | 'Baixa';
  action_already_sent: boolean;
  last_value_timestamp: string;
  last_ai_use: string;
  last_clube_activity: string;
  total_cartografias: number;
}

interface PerformanceMetric {
  action_type: string;
  channel: string;
  total_actions: number;
  total_returned: number;
  total_score_reduced: number;
  total_converted: number;
  total_retained: number;
  success_rate: number;
}

interface UsageMetric {
  day: string;
  interactions: number;
  tokens: number;
}

interface UserTimeline {
  id: string;
  created_at: string;
  type: 'ia' | 'clube' | 'cartografia' | 'admin_action';
  description: string;
}

export default function AdminCasaOraculaTab() {
  const [stagnantUsers, setStagnantUsers] = useState<StagnationInfoV4[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
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

      // 3. Aprendizado Operacional
      const { data: perfData } = await supabase
        .from('view_admin_action_performance')
        .select('*')
        .order('success_rate', { ascending: false });
      
      if (perfData) setPerformanceMetrics(perfData as any[]);

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

  const handleMarkActionDone = async (user: StagnationInfoV4) => {
    try {
      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (!adminUser) return;

      const { error } = await supabase
        .from('admin_action_history')
        .insert({
          user_id: user.user_id,
          action_type: user.recommended_action,
          channel: user.suggested_channel,
          sent_by: adminUser.id,
          conversion_risk_at_action: user.conversion_risk_score,
          churn_risk_at_action: user.churn_risk_score,
          saas_value_risk_at_action: user.saas_value_risk_score,
          action_reason_at_action: user.action_reason,
          last_value_timestamp_at_action: user.last_value_timestamp
        });

      if (error) throw error;
      
      // Atualizar localmente
      setStagnantUsers(prev => prev.map(u => 
        u.user_id === user.user_id ? { ...u, action_already_sent: true } : u
      ));
      
      fetchDashboardData(); // Recarrega métricas de performance
    } catch (error) {
      console.error('Error marking action as done:', error);
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 60) return "text-red-500";
    if (score > 30) return "text-amber-500";
    return "text-emerald-500";
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Alta': return "bg-red-100 text-red-700 border-red-200";
      case 'Média': return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-foreground">Painel Mestre V4 — Decisão Assistida</h2>
          <p className="text-muted-foreground">Inteligência operacional com recomendações de próxima melhor ação</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Decisões
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="human">Atendimento Humano</TabsTrigger>
          <TabsTrigger value="scores">Riscos Detalhados</TabsTrigger>
          <TabsTrigger value="timeline">Timeline e Uso</TabsTrigger>
        </TabsList>

        <TabsContent value="human" className="space-y-4 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Hoje preciso agir em quem?
            </h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Leads</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Churn</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">SaaS</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {stagnantUsers
              .filter(u => u.priority_level === 'Alta' || u.priority_level === 'Média')
              .slice(0, 20)
              .map((user) => (
              <Card key={user.user_id} className={`border-l-4 ${user.priority_level === 'Alta' ? 'border-l-red-500' : 'border-l-amber-500'}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{user.nome}</span>
                        <Badge variant="outline" className="text-[10px]">{user.portal}</Badge>
                        <Badge className={`text-[10px] ${getPriorityBadge(user.priority_level)}`}>{user.priority_level}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="font-semibold text-foreground">Motivo:</span> {user.action_reason}
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-primary font-medium">
                          <Zap className="w-3 h-3" /> {user.recommended_action}
                        </div>
                        <div className="text-muted-foreground">
                          Canal: <span className="text-foreground">{user.suggested_channel}</span>
                        </div>
                        <div className="text-muted-foreground italic">
                          Última ação: {user.action_already_sent ? 'Enviada' : 'Nenhuma'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        <CheckCircle2 className="w-3 h-3" /> Marcar Feito
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                        <Calendar className="w-3 h-3" /> Reagendar
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                        <EyeOff className="w-3 h-3" /> Ignorar 7d
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 text-xs gap-1">
                        <UserCircle className="w-3 h-3" /> Perfil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scores" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuária / Perfil</TableHead>
                    <TableHead>Scores de Risco (%)</TableHead>
                    <TableHead>Motivo / Diagnóstico</TableHead>
                    <TableHead>Próxima Melhor Ação</TableHead>
                    <TableHead>Canal / Pri.</TableHead>
                    <TableHead className="text-right">Histórico</TableHead>
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
                        <div className="flex gap-2">
                          <div className="flex flex-col items-center">
                            <span className={`text-[10px] font-bold ${getRiskColor(user.conversion_risk_score)}`}>CV</span>
                            <Progress value={user.conversion_risk_score} className="h-1 w-8" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span className={`text-[10px] font-bold ${getRiskColor(user.churn_risk_score)}`}>CH</span>
                            <Progress value={user.churn_risk_score} className="h-1 w-8" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span className={`text-[10px] font-bold ${getRiskColor(user.saas_value_risk_score)}`}>SA</span>
                            <Progress value={user.saas_value_risk_score} className="h-1 w-8" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px]">
                          <div className="text-xs font-medium leading-tight">{user.action_reason}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="text-xs font-semibold text-primary">{user.recommended_action}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="text-[10px] py-0 h-4 w-fit">
                            {user.suggested_channel}
                          </Badge>
                          <Badge className={`text-[9px] py-0 h-4 w-fit border ${getPriorityBadge(user.priority_level)}`}>
                            {user.priority_level}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          {user.action_already_sent ? (
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px]">
                              ENVIADO
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] opacity-50">
                              PENDENTE
                            </Badge>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-[10px]"
                            onClick={() => fetchUserTimeline(user.user_id)}
                          >
                            Timeline <Clock className="ml-1 w-3 h-3" />
                          </Button>
                        </div>
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
