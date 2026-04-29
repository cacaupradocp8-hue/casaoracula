
export interface FounderFinancialMetrics {
  total_revenue: number;
  revenue_new: number;
  revenue_renewals: number;
  refunds_value: number;
  total_cost_ia: number;
  total_cost_infra: number;
  total_cost_stripe: number;
  total_cost_ads: number;
  total_cost_team: number;
  new_sales_count: number;
  
  // Computed fields
  revenue_clube: number;
  revenue_saas: number;
  revenue_formacao: number;
  revenue_upsell: number;
  cost_ia: number;
  cost_infra: number;
  cost_stripe: number;
  cost_ads: number;
  cost_team: number;
  total_costs: number;
  gross_profit: number;
  net_profit: number;
  net_margin_pct: number;
  ia_revenue_pct: number;
  churn_rate: number;
  ltv: number;
  cac: number;
  payback_period: number;
  new_sales: number;
  revenue_expansion: number;
}

export type AlertSeverity = 'red' | 'yellow' | 'green';
export type AlertCategory = 'receita' | 'retenção' | 'ia' | 'operações';

export interface FounderAlert {
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  impact: number;
  cause: string;
  action: string;
  resolveAction: string;
}
