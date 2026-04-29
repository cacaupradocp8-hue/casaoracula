-- Table for daily financial aggregations
CREATE TABLE IF NOT EXISTS public.founder_financial_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    
    -- Automated Revenue Fields
    new_sales_count INTEGER DEFAULT 0,
    new_sales_value BIGINT DEFAULT 0, -- in cents
    renewals_count INTEGER DEFAULT 0,
    renewals_value BIGINT DEFAULT 0,
    refunds_count INTEGER DEFAULT 0,
    refunds_value BIGINT DEFAULT 0,
    active_mrr BIGINT DEFAULT 0,
    
    -- Automated Cost Fields
    cost_ia BIGINT DEFAULT 0,
    cost_stripe BIGINT DEFAULT 0,
    
    -- Manual Overrides / External Costs
    cost_ads BIGINT DEFAULT 0,
    cost_infra BIGINT DEFAULT 0,
    cost_team BIGINT DEFAULT 0,
    
    -- Metrics
    churn_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for date lookups
CREATE INDEX IF NOT EXISTS idx_founder_financial_date ON public.founder_financial_daily(date);

-- Enable RLS
ALTER TABLE public.founder_financial_daily ENABLE ROW LEVEL SECURITY;

-- Admin Policy
CREATE POLICY "Admins can manage daily financials"
ON public.founder_financial_daily
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND portal::text = 'admin'
  )
);

-- Function to refresh daily metrics (to be called by edge function/cron)
CREATE OR REPLACE FUNCTION public.refresh_founder_daily_metrics(target_date DATE)
RETURNS void AS $$
DECLARE
    v_new_sales_val BIGINT;
    v_new_sales_count INTEGER;
    v_renewals_val BIGINT;
    v_renewals_count INTEGER;
    v_refunds_val BIGINT;
    v_refunds_count INTEGER;
    v_mrr BIGINT;
    v_stripe_costs BIGINT;
    v_ia_costs BIGINT;
BEGIN
    -- 1. Aggregating Revenue from payments (assuming a payments table exists or similar structure)
    -- This is a placeholder logic that should be adjusted to the actual schema
    SELECT 
        COALESCE(SUM(amount), 0), COUNT(*)
    INTO v_new_sales_val, v_new_sales_count
    FROM public.payments -- Adjust to actual table name
    WHERE date_trunc('day', created_at)::date = target_date 
    AND status = 'succeeded' 
    AND metadata->>'type' = 'new_sale';

    -- 2. Aggregating IA Costs (assuming logs exist)
    -- Placeholder: 1 token = 0.00001 cents or similar
    SELECT COALESCE(SUM(total_tokens), 0) * 0.01 -- Adjust factor
    INTO v_ia_costs
    FROM public.ai_interaction_logs
    WHERE date_trunc('day', created_at)::date = target_date;

    -- 3. Upsert into daily table
    INSERT INTO public.founder_financial_daily (
        date, 
        new_sales_count, 
        new_sales_value, 
        cost_ia,
        updated_at
    )
    VALUES (
        target_date, 
        v_new_sales_count, 
        v_new_sales_val, 
        v_ia_costs,
        now()
    )
    ON CONFLICT (date) DO UPDATE SET
        new_sales_count = EXCLUDED.new_sales_count,
        new_sales_value = EXCLUDED.new_sales_value,
        cost_ia = EXCLUDED.cost_ia,
        updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Updated View for Dashboard
CREATE OR REPLACE VIEW public.view_founder_real_financial_summary AS
WITH monthly_agg AS (
    SELECT 
        date_trunc('month', date) as period_start,
        SUM(new_sales_value + renewals_value - refunds_value) as total_revenue,
        SUM(cost_ia + cost_stripe + cost_ads + cost_infra + cost_team) as total_costs,
        SUM(new_sales_value) as revenue_new,
        SUM(renewals_value) as revenue_renewals,
        SUM(cost_ia) as total_cost_ia,
        SUM(cost_stripe) as total_cost_stripe,
        SUM(cost_ads) as total_cost_ads,
        SUM(cost_infra) as total_cost_infra,
        SUM(cost_team) as total_cost_team,
        AVG(active_mrr) as avg_mrr
    FROM public.founder_financial_daily
    GROUP BY 1
)
SELECT 
    *,
    (total_revenue - total_costs) as net_profit,
    CASE WHEN total_revenue > 0 THEN ROUND((total_revenue - total_costs)::numeric / total_revenue::numeric * 100, 2) ELSE 0 END as net_margin_pct
FROM monthly_agg;
