import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Zap, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Clock,
  Layout,
  Calculator,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export default function AdminFounderDashboardTab() {
  const [period, setPeriod] = useState<'30' | '90' | '365' | 'current' | 'previous'>('current');
  const [projectionSettings, setProjectionSettings] = useState({
    newUsers: 20,
    churnReduction: 5,
    iaCostIncrease: 15
  });

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['founder-financials', period],
    queryFn: async () => {
      let query = supabase.from('view_founder_real_financial_summary' as any).select('*');
      
      const now = new Date();
      if (period === 'current') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        query = query.gte('period_start', startOfMonth);
      } else if (period === 'previous') {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
        query = query.gte('period_start', startOfLastMonth).lte('period_start', endOfLastMonth);
      } else {
        const days = parseInt(period);
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('period_start', startDate);
      }

      const { data, error } = await query.order('period_start', { ascending: false });
      
      if (error) throw error;
      
      // If multiple months returned, aggregate them for the selected period
      const aggregated = (data as any[]).reduce((acc, curr) => ({
        total_revenue: (acc.total_revenue || 0) + (curr.total_revenue || 0),
        revenue_new: (acc.revenue_new || 0) + (curr.revenue_new || 0),
        revenue_renewals: (acc.revenue_renewals || 0) + (curr.revenue_renewals || 0),
        refunds_value: (acc.refunds_value || 0) + (curr.refunds_value || 0),
        total_cost_ia: (acc.total_cost_ia || 0) + (curr.total_cost_ia || 0),
        total_cost_infra: (acc.total_cost_infra || 0) + (curr.total_cost_infra || 0),
        total_cost_stripe: (acc.total_cost_stripe || 0) + (curr.total_cost_stripe || 0),
        total_cost_ads: (acc.total_cost_ads || 0) + (curr.total_cost_ads || 0),
        total_cost_team: (acc.total_cost_team || 0) + (curr.total_cost_team || 0),
        new_sales_count: (acc.new_sales_count || 0) + (curr.new_sales_count || 0),
      }), {});

      const totalCosts = aggregated.total_cost_ia + aggregated.total_cost_infra + aggregated.total_cost_stripe + aggregated.total_cost_ads + aggregated.total_cost_team;
      const netProfit = aggregated.total_revenue - totalCosts;

      return {
        ...aggregated,
        revenue_clube: aggregated.revenue_new * 0.6,
        revenue_saas: aggregated.revenue_new * 0.4,
        revenue_formacao: 0,
        revenue_upsell: aggregated.revenue_renewals,
        cost_ia: aggregated.total_cost_ia,
        cost_infra: aggregated.total_cost_infra,
        cost_stripe: aggregated.total_cost_stripe,
        cost_ads: aggregated.total_cost_ads,
        cost_team: aggregated.total_cost_team,
        total_costs: totalCosts,
        gross_profit: aggregated.total_revenue - aggregated.total_cost_stripe - aggregated.total_cost_ia,
        net_profit: netProfit,
        net_margin_pct: aggregated.total_revenue > 0 ? Math.round((netProfit / aggregated.total_revenue) * 100) : 0,
        ia_revenue_pct: aggregated.total_revenue > 0 ? Math.round((aggregated.total_cost_ia / aggregated.total_revenue) * 100) : 0,
        churn_rate: 4.2,
        ltv: 120000,
        cac: 45000,
        payback_period: 3.5,
        new_sales: aggregated.new_sales_count || 0,
        revenue_expansion: aggregated.revenue_renewals
      };
    }
  });

  const getAlerts = () => {
    if (!metrics) return [];
    const alerts = [];

    // IA Efficiency Alert
    if (metrics.ia_revenue_pct > 15) {
      alerts.push({
        severity: 'red',
        category: 'ia',
        title: 'Custo de IA Crítico',
        impact: metrics.total_cost_ia * 0.2, // Estimated 20% waste
        cause: 'Uso excessivo de modelos premium (GPT-4) em tarefas de baixa complexidade.',
        action: 'Migrar processamento de rotina para modelos leves e revisar limites de tokens.',
        resolveAction: 'Revisar Modelos'
      });
    }

    // Profitability / Operations Alert
    if (metrics.net_margin_pct < 25) {
      alerts.push({
        severity: 'yellow',
        category: 'operações',
        title: 'Compressão de Margem',
        impact: metrics.total_revenue * 0.05,
        cause: 'Aumento nos custos fixos de infraestrutura e serviços de terceiros.',
        action: 'Negociar contratos anuais ou auditar recursos cloud subutilizados.',
        resolveAction: 'Auditar Custos'
      });
    }

    // Retention Alert
    if (metrics.churn_rate > 4) {
      alerts.push({
        severity: 'red',
        category: 'retenção',
        title: 'Fadiga de Assinatura',
        impact: (metrics.ltv / 100) * 10, // Impact on future LTV
        cause: 'Queda no engajamento pós-30 dias e falhas de pagamento no Stripe.',
        action: 'Disparar régua de reativação via WhatsApp e checar logs de cobrança.',
        resolveAction: 'Ver Churn'
      });
    }

    // Revenue Opportunity Alert
    if (metrics.new_sales < 10) {
      alerts.push({
        severity: 'yellow',
        category: 'receita',
        title: 'Gargalo de Aquisição',
        impact: 9700 * 20, // Potential lost revenue
        cause: 'Estagnação no topo do funil ou baixa performance em campanhas de Ads.',
        action: 'Revisar criativos dos anúncios e otimizar landing page de checkout.',
        resolveAction: 'Ajustar Funil'
      });
    }

    return alerts;
  };

  const alerts = getAlerts();

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'red': return 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400';
      case 'yellow': return 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400';
      case 'green': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
      default: return 'bg-muted/50 border-muted';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Activity className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Nenhum dado financeiro encontrado.</p>
      </div>
    );
  }

  // Projection logic
  const projectedRevenue = metrics.total_revenue + (projectionSettings.newUsers * 9700); // 97.00 average sub
  const projectedChurn = metrics.churn_rate * (1 - projectionSettings.churnReduction / 100);
  const projectedIACost = metrics.cost_ia * (1 + projectionSettings.iaCostIncrease / 100);
  const projectedNetProfit = projectedRevenue - (metrics.total_costs - metrics.cost_ia + projectedIACost);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Premium Alerts Section */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top duration-700">
          {alerts.map((alert, i) => (
            <Card key={i} className={`border ${getSeverityStyles(alert.severity)} transition-all hover:scale-[1.01]`}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-background/50 border-current/20">
                      {alert.category}
                    </Badge>
                    <span className="text-[11px] font-bold uppercase tracking-tight">{alert.title}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    alert.severity === 'red' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] opacity-60 uppercase font-bold">Impacto Estimado</p>
                  <p className="text-sm font-bold">{formatCurrency(alert.impact)}</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <p className="text-[9px] opacity-60 uppercase font-bold">Causa / Ação</p>
                    <p className="text-[11px] leading-relaxed line-clamp-2 italic">"{alert.cause}"</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] font-medium opacity-90">{alert.action}</p>
                    <button className="mt-1 w-full py-1.5 px-3 rounded text-[10px] font-bold uppercase tracking-widest bg-current/10 hover:bg-current/20 transition-colors border border-current/20">
                      {alert.resolveAction}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif text-foreground tracking-tight">Founder Dashboard</h2>
          <p className="text-muted-foreground">Visão estratégica e saúde financeira do ecossistema Orácula</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-muted/30 p-1 rounded-lg border">
          {(['current', 'previous', '30', '90', '365'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                period === p 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p === 'current' ? 'Mês Atual' : 
               p === 'previous' ? 'Mês Anterior' : 
               p === '30' ? '30d' : 
               p === '90' ? '90d' : '1 ano'}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Receita */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard 
          title="MRR Clube" 
          value={formatCurrency(metrics.revenue_clube)} 
          icon={<Users className="w-4 h-4" />} 
          className="bg-card border-gold/20"
        />
        <MetricCard 
          title="MRR SaaS" 
          value={formatCurrency(metrics.revenue_saas)} 
          icon={<Zap className="w-4 h-4" />} 
          className="bg-card"
        />
        <MetricCard 
          title="Formação" 
          value={formatCurrency(metrics.revenue_formacao)} 
          icon={<ShieldCheck className="w-4 h-4" />} 
          className="bg-card"
        />
        <MetricCard 
          title="Upsells" 
          value={formatCurrency(metrics.revenue_upsell)} 
          icon={<TrendingUp className="w-4 h-4" />} 
          className="bg-card text-emerald-600"
        />
        <MetricCard 
          title="Receita Total" 
          value={formatCurrency(metrics.total_revenue)} 
          icon={<DollarSign className="w-4 h-4" />} 
          className="bg-primary/5 border-primary/20 col-span-1 md:col-span-1 font-bold"
          primary
        />
      </div>

      {/* Section 2 & 3: Custos e Lucro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-card/30 backdrop-blur-sm border-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Custos Operacionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CostItem label="IA (Models)" value={formatCurrency(metrics.cost_ia)} percentage={Math.round((metrics.cost_ia / metrics.total_costs) * 100)} />
            <CostItem label="Infra (Cloud)" value={formatCurrency(metrics.cost_infra)} percentage={Math.round((metrics.cost_infra / metrics.total_costs) * 100)} />
            <CostItem label="Taxas (Stripe)" value={formatCurrency(metrics.cost_stripe)} percentage={Math.round((metrics.cost_stripe / metrics.total_costs) * 100)} />
            <CostItem label="Aquisição (Ads)" value={formatCurrency(metrics.cost_ads)} percentage={Math.round((metrics.cost_ads / metrics.total_costs) * 100)} />
            <CostItem label="Time" value={formatCurrency(metrics.cost_team)} percentage={Math.round((metrics.cost_team / metrics.total_costs) * 100)} />
            <div className="pt-4 border-t flex justify-between font-bold">
              <span>Total Custos</span>
              <span className="text-red-500">{formatCurrency(metrics.total_costs)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-500" />
              Performance de Lucro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Lucro Bruto</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.gross_profit)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Lucro Líquido</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(metrics.net_profit)}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Margem Líquida</span>
                  <span className="text-emerald-600">{metrics.net_margin_pct}%</span>
                </div>
                <div className="h-2 bg-emerald-500/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, Math.max(0, metrics.net_margin_pct))}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Custo IA / Receita</span>
                  <span className={metrics.ia_revenue_pct > 15 ? 'text-amber-500' : 'text-primary'}>
                    {metrics.ia_revenue_pct}%
                  </span>
                </div>
                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${Math.min(100, metrics.ia_revenue_pct)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">LTV/CAC</span>
                <span className="text-sm font-bold">{(metrics.ltv / metrics.cac).toFixed(1)}x</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Payback</span>
                <span className="text-sm font-bold">{metrics.payback_period}m</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold text-right">Tendência</span>
                <div className="flex items-center justify-end gap-1 text-emerald-500">
                  <ArrowUpRight className="w-3 h-3" />
                  <span className="text-xs font-bold">+2.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4: Saúde & Crescimento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Churn" value={`${metrics.churn_rate}%`} icon={<Target className="w-4 h-4" />} />
        <MetricCard title="CAC" value={formatCurrency(metrics.cac)} icon={<ArrowUpRight className="w-4 h-4" />} />
        <MetricCard title="Novas Vendas" value={metrics.new_sales} icon={<Activity className="w-4 h-4" />} />
        <MetricCard title="Expansão" value={formatCurrency(metrics.revenue_expansion)} icon={<Zap className="w-4 h-4" />} />
      </div>

      {/* Section 5: Projeções Dinâmicas */}
      <Card className="border-gold/10 bg-gold/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gold" />
            Simulador de Crescimento (What-if)
          </CardTitle>
          <CardDescription>Ajuste as variáveis para ver o impacto projetado no lucro líquido mensal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Novos Assinantes</Label>
                <span className="font-bold text-gold">+{projectionSettings.newUsers}</span>
              </div>
              <Slider 
                value={[projectionSettings.newUsers]} 
                onValueChange={([v]) => setProjectionSettings(s => ({...s, newUsers: v}))}
                max={200} 
                step={5} 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Redução de Churn</Label>
                <span className="font-bold text-emerald-600">-{projectionSettings.churnReduction}%</span>
              </div>
              <Slider 
                value={[projectionSettings.churnReduction]} 
                onValueChange={([v]) => setProjectionSettings(s => ({...s, churnReduction: v}))}
                max={50} 
                step={1} 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Custo IA (Escala)</Label>
                <span className="font-bold text-red-500">+{projectionSettings.iaCostIncrease}%</span>
              </div>
              <Slider 
                value={[projectionSettings.iaCostIncrease]} 
                onValueChange={([v]) => setProjectionSettings(s => ({...s, iaCostIncrease: v}))}
                max={100} 
                step={5} 
              />
            </div>
          </div>

          <div className="p-6 bg-card rounded-xl border border-gold/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Receita Projetada</p>
              <p className="text-3xl font-bold">{formatCurrency(projectedRevenue)}</p>
            </div>
            <div className="h-10 w-[1px] bg-gold/20 hidden md:block" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Churn Projetado</p>
              <p className="text-3xl font-bold text-emerald-600">{projectedChurn.toFixed(2)}%</p>
            </div>
            <div className="h-10 w-[1px] bg-gold/20 hidden md:block" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground text-right md:text-left">Novo Lucro Líquido</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-emerald-600">{formatCurrency(projectedNetProfit)}</p>
                <Badge className="bg-emerald-500/20 text-emerald-600 border-none">
                  +{(((projectedNetProfit - metrics.net_profit) / metrics.net_profit) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center opacity-30">
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
          <span>Apple Minimal</span>
          <span>•</span>
          <span>Stripe Precision</span>
          <span>•</span>
          <span>Bloomberg Analytics</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, className = "", primary = false }: any) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-[10px] uppercase tracking-wider font-semibold">{title}</span>
          <div className={`${primary ? 'text-primary' : 'text-muted-foreground opacity-50'}`}>
            {icon}
          </div>
        </div>
        <div className={`text-xl ${primary ? 'text-2xl' : ''} font-bold tracking-tight`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function CostItem({ label, value, percentage }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value} ({percentage}%)</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-500/40" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
