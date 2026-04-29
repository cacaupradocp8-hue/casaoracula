
import { FounderFinancialMetrics, FounderAlert } from '@/types/founder';

export const useFounderAlerts = (metrics: FounderFinancialMetrics | null | undefined): FounderAlert[] => {
  if (!metrics) return [];
  
  const alerts: FounderAlert[] = [];

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
