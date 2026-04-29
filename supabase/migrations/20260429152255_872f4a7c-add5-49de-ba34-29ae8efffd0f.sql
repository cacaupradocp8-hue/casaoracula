-- Function to identify upsell opportunities
CREATE OR REPLACE FUNCTION public.refresh_upsell_opportunities()
RETURNS void AS $$
DECLARE
    rule RECORD;
BEGIN
    FOR rule IN SELECT * FROM public.upsell_rules WHERE is_active = true LOOP
        -- Simple logic: pick users with high engagement and no recent opportunity
        -- In a real app, this would use actual metrics from student_learning_events or sessions
        INSERT INTO public.upsell_opportunities (
            user_id, rule_id, segment_from, segment_to, reason, engagement_score, churn_risk, status
        )
        SELECT 
            p.id, 
            rule.id, 
            rule.segment_from, 
            rule.segment_to,
            'Identificado engajamento acima de ' || (rule.min_engagement_score * 100) || '% nos últimos 30 dias.',
            0.85, -- Mock high engagement
            0.1,  -- Mock low churn
            'pending'
        FROM public.profiles p
        WHERE NOT EXISTS (
            SELECT 1 FROM public.upsell_opportunities o 
            WHERE o.user_id = p.id AND o.segment_to = rule.segment_to AND o.status IN ('pending', 'sent')
        )
        LIMIT 5; -- Limit per rule for the mock refresh
    END LOOP;
END;
$$ LANGUAGE plpgsql SET search_path = public;
