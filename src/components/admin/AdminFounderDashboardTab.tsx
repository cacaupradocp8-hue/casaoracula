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
  const [projectionSettings, setProjectionSettings] = useState({
    newUsers: 20,
    churnReduction: 5,
    iaCostIncrease: 15
  });

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['founder-financials'],
    queryFn: async () => {
      // Changed to the real aggregated view
      const { data, error } = await supabase
        .from('view_founder_real_financial_summary' as any)
        .select('*')
        .order('period_start', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      // Adaptation for frontend fields
      const raw = (data as any)?.[0];
      if (!raw) return null;

      return {
        ...raw,
        revenue_clube: raw.revenue_new * 0.6, // Estimate for now
        revenue_saas: raw.revenue_new * 0.4, // Estimate for now
        revenue_formacao: 0,
        revenue_upsell: raw.revenue_renewals,
        total_revenue: raw.total_revenue,
        cost_ia: raw.total_cost_ia,
        cost_infra: raw.total_cost_infra,
        cost_stripe: raw.total_cost_stripe,
        cost_ads: raw.total_cost_ads,
        cost_team: raw.total_cost_team,
        total_costs: raw.total_costs,
        gross_profit: raw.total_revenue - raw.total_cost_stripe - raw.total_cost_ia,
        net_profit: raw.net_profit,
        net_margin_pct: raw.net_margin_pct,
        churn_rate: 4.2, // Placeholder until aggregation logic for churn is finalized
        ltv: 120000,
        cac: 45000,
        payback_period: 3.5,
        new_sales: raw.new_sales_count || 0,
        revenue_expansion: raw.revenue_renewals
      };
    }
  });

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
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-serif text-foreground tracking-tight">Founder Dashboard</h2>
        <p className="text-muted-foreground">Visão estratégica e saúde financeira do ecossistema Orácula</p>
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
          <CardHeader>
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
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Margem Líquida</span>
                <span className="text-emerald-600">{metrics.net_margin_pct}%</span>
              </div>
              <div className="h-3 bg-emerald-500/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${metrics.net_margin_pct}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">Referência: Apple (~25%), Stripe (~10%), Bloomberg (Clean focus)</p>
            </div>

            <div className="pt-4 border-t grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <div className="text-xs">
                  <p className="font-bold">LTV/CAC</p>
                  <p className="text-muted-foreground">{(metrics.ltv / metrics.cac).toFixed(1)}x</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <div className="text-xs">
                  <p className="font-bold">Payback</p>
                  <p className="text-muted-foreground">{metrics.payback_period} meses</p>
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
