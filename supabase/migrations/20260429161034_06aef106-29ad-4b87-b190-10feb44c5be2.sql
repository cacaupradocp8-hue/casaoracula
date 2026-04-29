-- Create financial metrics table
CREATE TABLE IF NOT EXISTS public.founder_financial_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Revenue (stored in cents/minor units for precision)
    revenue_clube BIGINT DEFAULT 0,
    revenue_saas BIGINT DEFAULT 0,
    revenue_formacao BIGINT DEFAULT 0,
    revenue_upsell BIGINT DEFAULT 0,
    
    -- Costs
    cost_ia BIGINT DEFAULT 0,
    cost_infra BIGINT DEFAULT 0,
    cost_stripe BIGINT DEFAULT 0,
    cost_ads BIGINT DEFAULT 0,
    cost_team BIGINT DEFAULT 0,
    
    -- Health Metrics
    churn_rate DECIMAL(5,2) DEFAULT 0, -- Percentage
    ltv BIGINT DEFAULT 0,
    cac BIGINT DEFAULT 0,
    payback_period DECIMAL(5,2) DEFAULT 0, -- Months
    
    -- Growth
    new_sales INTEGER DEFAULT 0,
    upgrades INTEGER DEFAULT 0,
    cancellations INTEGER DEFAULT 0,
    revenue_expansion BIGINT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.founder_financial_metrics ENABLE ROW LEVEL SECURITY;

-- Only admins can see/edit financial data
CREATE POLICY "Admins can manage financial metrics"
ON public.founder_financial_metrics
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND portal::text = 'admin'
  )
);

-- Create a view for easy access to calculated fields (Gross Profit, Net Profit, Margins)
CREATE OR REPLACE VIEW public.view_founder_financial_summary AS
SELECT 
    id,
    period_start,
    period_end,
    (revenue_clube + revenue_saas + revenue_formacao + revenue_upsell) as total_revenue,
    (cost_ia + cost_infra + cost_stripe + cost_ads + cost_team) as total_costs,
    -- Bruto (Revenue - Direct Costs like Stripe/IA)
    ((revenue_clube + revenue_saas + revenue_formacao + revenue_upsell) - (cost_stripe + cost_ia)) as gross_profit,
    -- Líquido (Revenue - All Costs)
    ((revenue_clube + revenue_saas + revenue_formacao + revenue_upsell) - (cost_ia + cost_infra + cost_stripe + cost_ads + cost_team)) as net_profit,
    CASE 
        WHEN (revenue_clube + revenue_saas + revenue_formacao + revenue_upsell) > 0 
        THEN ROUND((((revenue_clube + revenue_saas + revenue_formacao + revenue_upsell) - (cost_ia + cost_infra + cost_stripe + cost_ads + cost_team))::numeric / (revenue_clube + revenue_saas + revenue_formacao + revenue_upsell)::numeric) * 100, 2)
        ELSE 0 
    END as net_margin_pct,
    churn_rate,
    ltv,
    cac,
    payback_period,
    new_sales,
    upgrades,
    cancellations,
    revenue_expansion,
    revenue_clube,
    revenue_saas,
    revenue_formacao,
    revenue_upsell,
    cost_ia,
    cost_infra,
    cost_stripe,
    cost_ads,
    cost_team
FROM public.founder_financial_metrics;

-- Insert some dummy historical data for the dashboard to show something
INSERT INTO public.founder_financial_metrics 
(period_start, period_end, revenue_clube, revenue_saas, revenue_formacao, revenue_upsell, cost_ia, cost_infra, cost_stripe, cost_ads, cost_team, churn_rate, ltv, cac, payback_period, new_sales, upgrades, cancellations, revenue_expansion)
VALUES 
(CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 4500000, 2500000, 8000000, 1500000, 350000, 150000, 500000, 2000000, 4000000, 4.5, 120000, 45000, 3.5, 45, 12, 5, 500000);
