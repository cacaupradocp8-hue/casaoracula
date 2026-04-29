import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  MessageSquare,
  Power,
  Play,
  Settings2
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

interface AutomationRule {
  id: string;
  risk_type: string;
  action_type: string;
  channel: string;
  min_success_rate: number;
  is_active: boolean;
  portal: string | null;
  measurement_window_days: number;
  approval_reason: string | null;
  last_success_rate: number | null;
  last_volume: number | null;
  last_snapshot_at: string | null;
  updated_at: string;
}

interface AuditLog {
  id: string;
  rule_id: string;
  action: string;
  reason: string;
  snapshot_data: any;
  created_at: string;
}

export default function AdminCasaOraculaTab() {
  console.log('[AdminCasaOraculaTab] rendering');
  const [stagnantUsers, setStagnantUsers] = useState<StagnationInfoV4[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [selectedUserTimeline, setSelectedUserTimeline] = useState<UserTimeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedRuleAudit, setSelectedRuleAudit] = useState<AutomationRule | null>(null);

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
          try {
            const date = format(new Date(log.created_at), 'yyyy-MM-dd');
            if (!grouped[date]) grouped[date] = { day: date, interactions: 0, tokens: 0 };
            grouped[date].interactions++;
            grouped[date].tokens += log.tokens_used || 0;
          } catch (e) {
            console.error('Error formatting date for log:', log, e);
          }
        });
        setUsageMetrics(Object.values(grouped).sort((a, b) => b.day.localeCompare(a.day)));
      }

      // 3. Aprendizado Operacional
      const { data: perfData } = await supabase
        .from('view_admin_action_performance')
        .select('*')
        .order('success_rate', { ascending: false });
      
      if (perfData) setPerformanceMetrics(perfData as any[]);

      // 4. Regras de Automação
      const { data: rulesData } = await supabase
        .from('admin_automation_rules')
        .select('*')
        .order('risk_type');
      
      if (rulesData) setAutomationRules(rulesData);

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
  
  const handleSimulate = async (rule: AutomationRule) => {
    setIsSimulating(true);
    try {
      // Simulamos filtrando usuários estagnados que atendem aos critérios da regra
      const matchingUsers = stagnantUsers.filter(u => {
        const matchesRisk = 
          (rule.risk_type === 'conversion' && u.conversion_risk_score > 60) ||
          (rule.risk_type === 'churn' && u.churn_risk_score > 60) ||
          (rule.risk_type === 'saas' && u.saas_value_risk_score > 60);
        
        const matchesPortal = !rule.portal || rule.portal === 'GLOBAL' || u.portal === rule.portal;
        
        return matchesRisk && matchesPortal;
      });

      const perf = performanceMetrics.find(p => p.action_type === rule.action_type && p.channel === rule.channel);
      
      const simulation = {
        usersCount: matchingUsers.length,
        estimatedSuccess: Math.round(matchingUsers.length * ((perf?.success_rate || 0) / 100)),
        spamRisk: (perf?.success_rate || 0) < 10 ? 'Alto' : (perf?.success_rate || 0) < 20 ? 'Médio' : 'Baixo',
        historicalRate: perf?.success_rate || 0,
        window: rule.measurement_window_days
      };

      setSimulationResult(simulation);
      
      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (adminUser) {
        await supabase.rpc('log_automation_simulation', {
          p_risk_type: rule.risk_type,
          p_action_type: rule.action_type,
          p_channel: rule.channel,
          p_portal: rule.portal || 'GLOBAL',
          p_admin_id: adminUser.id,
          p_snapshot: simulation
        });
      }
    } catch (error) {
      console.error('Error during simulation:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const fetchAuditLogs = async (ruleId: string) => {
    const { data } = await supabase
      .from('admin_automation_audit')
      .select('*')
      .eq('rule_id', ruleId)
      .order('created_at', { ascending: false });
    
    if (data) setAuditLogs(data);
  };

  const updateRuleConfig = async (ruleId: string, updates: Partial<AutomationRule>) => {
    try {
      const { error } = await supabase
        .from('admin_automation_rules')
        .update(updates)
        .eq('id', ruleId);
      
      if (error) throw error;
      
      setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, ...updates } : r));
    } catch (error) {
      console.error('Error updating rule config:', error);
    }
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

  const toggleAutomationRule = async (ruleId: string, currentStatus: boolean) => {
    try {
      const rule = automationRules.find(r => r.id === ruleId);
      if (!rule) return;

      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (!adminUser) return;

      const newStatus = !currentStatus;
      const perf = performanceMetrics.find(p => p.action_type === rule.action_type && p.channel === rule.channel);

      const { error } = await supabase
        .from('admin_automation_rules')
        .update({ 
          is_active: newStatus,
          last_success_rate: perf?.success_rate || 0,
          last_snapshot_at: new Date().toISOString()
        })
        .eq('id', ruleId);

      if (error) throw error;

      // Registrar Auditoria
      await supabase.from('admin_automation_audit').insert({
        rule_id: ruleId,
        admin_id: adminUser.id,
        action: newStatus ? 'activate' : 'deactivate',
        reason: newStatus 
          ? `Ativada com taxa de ${perf?.success_rate || 0}% e meta de ${rule.min_success_rate}%`
          : 'Desativada manualmente pelo administrador',
        snapshot_data: { success_rate: perf?.success_rate || 0, timestamp: new Date().toISOString() }
      });
      
      setAutomationRules(prev => prev.map(r => 
        r.id === ruleId ? { ...r, is_active: newStatus } : r
      ));
    } catch (error) {
      console.error('Error toggling automation rule:', error);
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
              {stagnantUsers?.filter(u => (u.conversion_risk_score || 0) > 60).length || 0}
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
              {stagnantUsers?.filter(u => (u.churn_risk_score || 0) > 60).length || 0}
            </CardTitle>
            <CardDescription>Assinantes/Alunas críticas</CardDescription>
          </CardHeader>
        </Card>

        {/* Card de SaaS Value */}
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Zap className="w-5 h-5 text-amber-500" />
              <Badge variant="outline" className="text-amber-500">SaaS Value</Badge>
            </div>
            <CardTitle className="text-2xl mt-2">
              {stagnantUsers?.filter(u => (u.saas_value_risk_score || 0) > 60).length || 0}
            </CardTitle>
            <CardDescription>Terapeutas subutilizando IA</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="scores" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="human">Atendimento Humano</TabsTrigger>
          <TabsTrigger value="scores">Riscos Detalhados</TabsTrigger>
          <TabsTrigger value="automation">Automação Baseada em Evidência</TabsTrigger>
          <TabsTrigger value="timeline">Timeline e Uso</TabsTrigger>
          <TabsTrigger value="learning">Aprendizado Operacional</TabsTrigger>
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={`h-8 text-xs gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 ${user.action_already_sent ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleMarkActionDone(user)}
                        disabled={user.action_already_sent}
                      >
                        <CheckCircle2 className="w-3 h-3" /> {user.action_already_sent ? 'Feito' : 'Marcar Feito'}
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

        <TabsContent value="automation" className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Automação Baseada em Evidência
              </h3>
              <p className="text-sm text-muted-foreground">Somente ações com alta taxa de sucesso são elegíveis para disparo automático.</p>
            </div>
            <div className="flex gap-4">
               <div className="flex flex-col gap-1">
                 <Label className="text-[10px] uppercase font-bold text-muted-foreground">Janela de Medição</Label>
                 <Select defaultValue="7" onValueChange={(v) => console.log('Window changed', v)}>
                    <SelectTrigger className="h-8 w-32 text-xs">
                      <SelectValue placeholder="Janela" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 dias</SelectItem>
                      <SelectItem value="14">14 dias</SelectItem>
                      <SelectItem value="30">30 dias</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alvo / Portal</TableHead>
                      <TableHead>Ação Sugerida</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead className="text-right">Performance</TableHead>
                      <TableHead className="text-center">Decisão e Simulação</TableHead>
                      <TableHead className="text-right">Automação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {automationRules.map((rule) => {
                      const perf = performanceMetrics.find(p => p.action_type === rule.action_type && p.channel === rule.channel);
                      const isEligible = perf && perf.success_rate >= rule.min_success_rate;
                      
                      return (
                        <TableRow key={rule.id}>
                          <TableCell>
                            <div className="capitalize font-medium">{rule.risk_type}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{rule.portal || 'GLOBAL'}</div>
                          </TableCell>
                          <TableCell className="text-xs">{rule.action_type}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] uppercase">{rule.channel}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <span className={`font-bold ${isEligible ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {perf?.success_rate || 0}%
                              </span>
                              <span className="text-[10px] text-muted-foreground italic">Meta: {rule.min_success_rate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                               <Dialog>
                                 <DialogTrigger asChild>
                                   <Button 
                                     variant="ghost" 
                                     size="sm" 
                                     className="h-8 px-2 text-xs gap-1"
                                     onClick={() => handleSimulate(rule)}
                                   >
                                     <Play className="w-3 h-3" /> Simular
                                   </Button>
                                 </DialogTrigger>
                                 <DialogContent>
                                   <DialogHeader>
                                     <DialogTitle>Simulação de Impacto</DialogTitle>
                                     <DialogDescription>
                                       {rule.action_type} via {rule.channel} ({rule.portal || 'Global'})
                                     </DialogDescription>
                                   </DialogHeader>
                                   {isSimulating ? (
                                      <div className="py-12 flex justify-center"><RefreshCw className="w-8 h-8 animate-spin text-primary/20" /></div>
                                   ) : simulationResult && (
                                     <div className="space-y-6 py-4">
                                       <div className="grid grid-cols-2 gap-4">
                                         <div className="bg-secondary/50 p-4 rounded-xl text-center">
                                           <div className="text-3xl font-bold">{simulationResult.usersCount}</div>
                                           <div className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Usuárias Atuais</div>
                                         </div>
                                         <div className="bg-emerald-500/10 p-4 rounded-xl text-center border border-emerald-500/20">
                                           <div className="text-3xl font-bold text-emerald-600">~{simulationResult.estimatedSuccess}</div>
                                           <div className="text-[10px] uppercase font-bold text-emerald-600 mt-1">Retornos Previstos</div>
                                         </div>
                                       </div>
                                       
                                       <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                                         <div className="flex justify-between items-center text-sm">
                                           <span className="text-muted-foreground">Risco de Spam (Fadiga):</span>
                                           <Badge variant={simulationResult.spamRisk === 'Baixo' ? 'secondary' : 'destructive'} className={simulationResult.spamRisk === 'Baixo' ? 'bg-emerald-100 text-emerald-700' : ''}>
                                             {simulationResult.spamRisk}
                                           </Badge>
                                         </div>
                                         <div className="flex justify-between items-center text-sm">
                                           <span className="text-muted-foreground">Taxa Histórica Medida:</span>
                                           <span className="font-bold">{simulationResult.historicalRate}%</span>
                                         </div>
                                         <div className="flex justify-between items-center text-sm">
                                           <span className="text-muted-foreground">Janela de Observação:</span>
                                           <span className="font-bold">{simulationResult.window} dias</span>
                                         </div>
                                       </div>

                                       <DialogFooter>
                                          <Button className="w-full gap-2" disabled={!isEligible} onClick={() => toggleAutomationRule(rule.id, rule.is_active)}>
                                            <Zap className="w-4 h-4" /> 
                                            {rule.is_active ? 'Revisar Automação Ativa' : 'Aprovar e Ativar Automação'}
                                          </Button>
                                       </DialogFooter>
                                     </div>
                                   )}
                                 </DialogContent>
                               </Dialog>

                               <Dialog>
                                 <DialogTrigger asChild>
                                   <Button 
                                     variant="ghost" 
                                     size="sm" 
                                     className="h-8 px-2 text-xs gap-1"
                                     onClick={() => fetchAuditLogs(rule.id)}
                                   >
                                     <Clock className="w-3 h-3" /> Auditoria
                                   </Button>
                                 </DialogTrigger>
                                 <DialogContent className="max-w-md">
                                   <DialogHeader>
                                     <DialogTitle>Janela de Auditoria</DialogTitle>
                                     <DialogDescription>Rastreabilidade das decisões de ativação</DialogDescription>
                                   </DialogHeader>
                                   <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 py-4">
                                      {auditLogs.length > 0 ? auditLogs.map(log => (
                                        <div key={log.id} className="border-l-2 border-primary/20 pl-4 py-2 relative">
                                          <div className="absolute w-2 h-2 rounded-full bg-primary/30 -left-[5px] top-4" />
                                          <div className="flex justify-between items-center mb-1">
                                            <Badge variant="outline" className="text-[9px] uppercase font-bold">{log.action}</Badge>
                                            <span className="text-[10px] text-muted-foreground">
                                              {format(new Date(log.created_at), 'dd/MM/yy HH:mm')}
                                            </span>
                                          </div>
                                          <p className="text-xs text-foreground font-medium">{log.reason}</p>
                                          {log.snapshot_data && (
                                            <div className="mt-2 text-[9px] text-muted-foreground bg-secondary/30 p-2 rounded">
                                              Snapshot: {log.snapshot_data.usersCount} usuárias | {log.snapshot_data.historicalRate}% sucesso
                                            </div>
                                          )}
                                        </div>
                                      )) : (
                                        <div className="text-center py-8 text-muted-foreground text-sm italic">
                                          Sem histórico registrado.
                                        </div>
                                      )}
                                   </div>
                                 </DialogContent>
                               </Dialog>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-3">
                              {rule.channel === 'whatsapp' ? (
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 italic text-[10px]">
                                  Manual
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant={rule.is_active ? "default" : "outline"}
                                  className={`h-8 gap-2 ${!isEligible && !rule.is_active ? 'opacity-50' : ''}`}
                                  onClick={() => toggleAutomationRule(rule.id, rule.is_active)}
                                  disabled={!isEligible && !rule.is_active}
                                >
                                  {rule.is_active ? (
                                    <><Power className="w-3 h-3" /> ON</>
                                  ) : (
                                    <><Play className="w-3 h-3" /> OFF</>
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-blue-50/50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Automações Leves</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  E-mails e notificações internas são disparados automaticamente assim que o score ultrapassa o limite de risco, desde que a regra esteja ativa e validada por evidência.
                </CardContent>
              </Card>
              <Card className="bg-amber-50/50 border-amber-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Governança Humana</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Ações via WhatsApp permanecem estritamente manuais para garantir o tom de voz e o acolhimento necessário em casos críticos.
                </CardContent>
              </Card>
            </div>
          </div>
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
                          {event.created_at ? format(new Date(event.created_at), 'dd/MM HH:mm') : '---'}
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
                        {m.day ? format(new Date(m.day + 'T00:00:00'), 'eeee, dd/MM', { locale: ptBR }) : '---'}
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
        <TabsContent value="learning" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Top Ações por Taxa de Sucesso
                </CardTitle>
                <CardDescription>Ações que mais geraram retorno ou redução de risco</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ação</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead className="text-right">Sucesso (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceMetrics.map((perf, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs font-medium">{perf.action_type}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{perf.channel}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-bold text-emerald-600">{perf.success_rate}%</span>
                            <Progress value={perf.success_rate} className="h-1.5 w-12" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {performanceMetrics.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          Nenhum dado de performance coletado ainda.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Volume de Atendimento Admin
                </CardTitle>
                <CardDescription>Total de ações executadas por tipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((perf, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{perf.action_type} ({perf.channel})</span>
                        <span className="font-semibold">{perf.total_actions} ações</span>
                      </div>
                      <Progress value={Math.min(100, (perf.total_actions / 10) * 100)} className="h-2" />
                    </div>
                  ))}
                  {performanceMetrics.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground text-sm">
                      Aguardando primeiras ações manuais.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">
                    {performanceMetrics?.reduce((acc, curr) => acc + (curr.total_returned || 0), 0) || 0}
                  </div>
                  <div className="text-xs text-emerald-600 uppercase font-semibold">Usuárias Recuperadas</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {performanceMetrics?.reduce((acc, curr) => acc + (curr.total_score_reduced || 0), 0) || 0}
                  </div>
                  <div className="text-xs text-blue-600 uppercase font-semibold">Riscos Mitigados</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-700">
                    {performanceMetrics?.reduce((acc, curr) => acc + (curr.total_converted || 0) + (curr.total_retained || 0), 0) || 0}
                  </div>
                  <div className="text-xs text-amber-600 uppercase font-semibold">Conversões/Retenções</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
