-- Create enum for upsell status
CREATE TYPE public.upsell_status AS ENUM ('pending', 'sent', 'converted', 'ignored');

-- Create upsell_rules table
CREATE TABLE public.upsell_rules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    segment_from TEXT NOT NULL,
    segment_to TEXT NOT NULL,
    min_engagement_score FLOAT DEFAULT 0.7,
    max_churn_risk FLOAT DEFAULT 0.3,
    min_recurrent_use_days INTEGER DEFAULT 15,
    estimated_value_increase DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for upsell_rules
ALTER TABLE public.upsell_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage upsell_rules" ON public.upsell_rules FOR ALL USING (true);

-- Create upsell_opportunities table
CREATE TABLE public.upsell_opportunities (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rule_id UUID REFERENCES public.upsell_rules(id),
    segment_from TEXT NOT NULL,
    segment_to TEXT NOT NULL,
    reason TEXT,
    engagement_score FLOAT,
    churn_risk FLOAT,
    status public.upsell_status DEFAULT 'pending',
    last_action_at TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for upsell_opportunities
ALTER TABLE public.upsell_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage upsell_opportunities" ON public.upsell_opportunities FOR ALL USING (true);

-- Insert initial rules
INSERT INTO public.upsell_rules (segment_from, segment_to, min_engagement_score, max_churn_risk, min_recurrent_use_days, estimated_value_increase)
VALUES 
('Clube', 'Formação', 0.8, 0.2, 20, 150.00),
('Formação', 'SaaS', 0.75, 0.15, 10, 297.00),
('SaaS', 'Premium', 0.9, 0.1, 25, 500.00);

-- Trigger for updated_at
CREATE TRIGGER update_upsell_rules_updated_at BEFORE UPDATE ON public.upsell_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_upsell_opportunities_updated_at BEFORE UPDATE ON public.upsell_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for Upsell Stats
CREATE OR REPLACE VIEW public.upsell_stats AS
SELECT 
    segment_from,
    segment_to,
    COUNT(*) as total_opportunities,
    COUNT(*) FILTER (WHERE status = 'converted') as conversions,
    CASE 
        WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE status = 'converted')::FLOAT / COUNT(*)::FLOAT) * 100 
        ELSE 0 
    END as conversion_rate,
    SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) * (SELECT estimated_value_increase FROM upsell_rules r WHERE r.segment_from = o.segment_from AND r.segment_to = o.segment_to LIMIT 1) as total_revenue
FROM public.upsell_opportunities o
GROUP BY segment_from, segment_to;
