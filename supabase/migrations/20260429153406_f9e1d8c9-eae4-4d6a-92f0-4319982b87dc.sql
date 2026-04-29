-- Adicionar colunas de inteligência em upsell_opportunities
ALTER TABLE public.upsell_opportunities 
ADD COLUMN IF NOT EXISTS channel_used TEXT,
ADD COLUMN IF NOT EXISTS refusal_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_offered_at TIMESTAMP WITH TIME ZONE;

-- Criar função para verificar fadiga e timing
CREATE OR REPLACE FUNCTION public.can_receive_upsell_offer(p_user_id UUID, p_segment_to TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_last_offer TIMESTAMP WITH TIME ZONE;
    v_refusals INTEGER;
BEGIN
    SELECT MAX(last_offered_at), MAX(refusal_count) 
    INTO v_last_offer, v_refusals
    FROM public.upsell_opportunities
    WHERE user_id = p_user_id AND segment_to = p_segment_to;

    -- Regra: Não insistir se houve oferta nos últimos 30 dias
    IF v_last_offer IS NOT NULL AND v_last_offer > now() - INTERVAL '30 days' THEN
        RETURN FALSE;
    END IF;

    -- Regra: Se teve mais de 3 recusas, pausar por mais tempo (60 dias)
    IF v_refusals >= 3 AND v_last_offer > now() - INTERVAL '60 days' THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar upsell_stats para incluir métricas de canal
CREATE OR REPLACE VIEW public.upsell_revenue_intelligence AS
SELECT 
    segment_from,
    segment_to,
    channel_used,
    COUNT(*) as total_sent,
    COUNT(*) FILTER (WHERE status = 'converted') as conversions,
    ROUND((COUNT(*) FILTER (WHERE status = 'converted')::FLOAT / NULLIF(COUNT(*), 0) * 100)::NUMERIC, 1) as acceptance_rate,
    SUM(CASE WHEN status = 'converted' THEN 497 ELSE 0 END) as estimated_revenue -- Valores exemplo baseados nos produtos
FROM public.upsell_opportunities
WHERE status IN ('sent', 'converted', 'ignored')
GROUP BY segment_from, segment_to, channel_used;
