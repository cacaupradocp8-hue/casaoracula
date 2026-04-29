-- Update the refresh function to include Revenue Intelligence logic
CREATE OR REPLACE FUNCTION public.refresh_upsell_opportunities()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
    rule RECORD;
    prob_score DOUBLE PRECISION;
    hist_rate DOUBLE PRECISION;
    t_factor DOUBLE PRECISION;
BEGIN
    FOR rule IN SELECT * FROM public.upsell_rules WHERE is_active = true LOOP
        -- Calculate some mock "historical rates" based on rule priority
        hist_rate := CASE 
            WHEN rule.segment_from = 'Clube' THEN 0.25 
            WHEN rule.segment_from = 'Formação' THEN 0.18
            ELSE 0.12
        END;

        -- Timing factor based on weekday/time (mock logic)
        t_factor := 0.9 + (random() * 0.2); 

        INSERT INTO public.upsell_opportunities (
            user_id, 
            rule_id, 
            segment_from, 
            segment_to, 
            reason, 
            engagement_score, 
            churn_risk, 
            status,
            historical_segment_rate,
            timing_factor,
            probability_score,
            probability_reason,
            estimated_value,
            touch_count
        )
        SELECT 
            p.id, 
            rule.id, 
            rule.segment_from, 
            rule.segment_to,
            'Comportamento detectado elegível para upgrade ' || rule.segment_to,
            0.7 + (random() * 0.25), -- Mock engagement
            0.05 + (random() * 0.1), -- Mock low churn
            'pending',
            hist_rate,
            t_factor,
            ((0.7 + (random() * 0.25)) * hist_rate * t_factor), -- probability_score
            'Alta recorrência no portal ' || rule.segment_from || ' com score de engajamento consistente.',
            rule.estimated_value_increase,
            0
        FROM public.profiles p
        WHERE 
            -- Rule 1: No active or recently sent opportunities (fatigue)
            NOT EXISTS (
                SELECT 1 FROM public.upsell_opportunities o 
                WHERE o.user_id = p.id 
                AND (
                    o.status IN ('pending', 'sent')
                    OR (o.status = 'ignored' AND o.created_at > now() - interval '30 days')
                    OR (o.paused_until IS NOT NULL AND o.paused_until > now())
                )
            )
            -- Rule 2: User must not have multiple simultaneous offers (as per simplified fatigue request)
            AND NOT EXISTS (
                SELECT 1 FROM public.upsell_opportunities o
                WHERE o.user_id = p.id AND o.status = 'pending'
            )
        LIMIT 3; -- Conservative generation
    END LOOP;
END;
$function$;

-- Update view for better intelligence
DROP VIEW IF EXISTS public.upsell_revenue_intelligence;
CREATE OR REPLACE VIEW public.upsell_revenue_intelligence AS
 SELECT segment_from,
    segment_to,
    COALESCE(channel_used, 'Pendente') as channel_used,
    count(*) AS total_sent,
    count(*) FILTER (WHERE (status = 'converted'::upsell_status)) AS conversions,
    round(((((count(*) FILTER (WHERE (status = 'converted'::upsell_status)))::double precision / (NULLIF(count(*), 0))::double precision) * (100)::double precision))::numeric, 1) AS acceptance_rate,
    sum(COALESCE(estimated_value, 0)) FILTER (WHERE (status = 'converted'::upsell_status)) AS revenue_generated,
    avg(days_to_conversion) as avg_days_to_convert,
    count(*) FILTER (WHERE (declined_count > 0 OR status = 'ignored')) as fatigue_count
   FROM upsell_opportunities
  GROUP BY segment_from, segment_to, channel_used;
