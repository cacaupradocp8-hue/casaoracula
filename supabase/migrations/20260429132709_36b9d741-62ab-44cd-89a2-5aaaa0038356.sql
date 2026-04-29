-- 1. Melhorar índices para Timeline
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_recent ON public.ai_interaction_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clube_progresso_user_recent ON public.clube_rota_progresso (user_id, updated_at DESC);

-- 2. Recalibrar View para V3 com Scores Tripartidos
DROP VIEW IF EXISTS public.view_user_stagnation;

CREATE OR REPLACE VIEW public.view_user_stagnation AS
WITH user_base AS (
    SELECT 
        p.id AS user_id,
        p.nome,
        p.email,
        p.portal,
        p.created_at as signup_date,
        s.plan_id,
        s.status AS subscription_status,
        (SELECT MAX(created_at) FROM ai_interaction_logs WHERE user_id = p.id) as last_ai_use,
        (SELECT MAX(updated_at) FROM clube_rota_progresso WHERE user_id = p.id) as last_clube_activity,
        (SELECT COUNT(*) FROM cartografia_psiquica WHERE user_id = p.id) as total_cartografias,
        (SELECT MAX(created_at) FROM cartografia_psiquica WHERE user_id = p.id) as last_cartografia,
        (SELECT COUNT(*) FROM co_jardim_entries WHERE user_id = p.id) as total_jardim,
        EXISTS(SELECT 1 FROM profiles WHERE id = p.id AND portal = 'aluna') as is_aluna,
        EXISTS(SELECT 1 FROM profiles WHERE id = p.id AND portal = 'terapeuta') as is_terapeuta
    FROM profiles p
    LEFT JOIN subscriptions s ON s.user_id = p.id
),
risk_calculations AS (
    SELECT 
        *,
        -- 1. Conversion Risk (Leads/Visitantes)
        CASE 
            WHEN subscription_status IS NULL OR subscription_status != 'active' THEN
                LEAST(100, (
                    CASE WHEN total_cartografias = 0 THEN 40 ELSE 0 END +
                    CASE WHEN total_jardim = 0 THEN 30 ELSE 0 END +
                    CASE WHEN signup_date < now() - interval '3 days' AND total_cartografias = 0 THEN 30 ELSE 0 END
                ))
            ELSE 0 
        END as conversion_risk_score,

        -- 2. Churn Risk (Assinantes e Alunas)
        CASE 
            WHEN subscription_status = 'active' AND portal = 'aluna' THEN
                LEAST(100, (
                    CASE WHEN last_clube_activity < now() - interval '7 days' OR last_clube_activity IS NULL THEN 50 ELSE 0 END +
                    CASE WHEN last_ai_use < now() - interval '10 days' OR last_ai_use IS NULL THEN 30 ELSE 0 END +
                    CASE WHEN last_cartografia < now() - interval '15 days' OR last_cartografia IS NULL THEN 20 ELSE 0 END
                ))
            ELSE 0
        END as churn_risk_score,

        -- 3. SaaS Value Risk (Terapeutas)
        CASE 
            WHEN subscription_status = 'active' AND is_terapeuta THEN
                LEAST(100, (
                    CASE WHEN last_ai_use IS NULL THEN 70 ELSE 0 END +
                    CASE WHEN last_ai_use < now() - interval '5 days' THEN 30 ELSE 0 END
                ))
            ELSE 0
        END as saas_value_risk_score
    FROM user_base
)
SELECT 
    *,
    -- Motivo detalhado dominante
    CASE 
        WHEN saas_value_risk_score > 60 THEN 'Terapeuta Subutilizando IA'
        WHEN churn_risk_score > 60 THEN 'Assinante em Abandono Iminente'
        WHEN conversion_risk_score > 60 THEN 'Lead Travado no Onboarding'
        ELSE 'Engajamento Normal'
    END as primary_risk_factor,
    -- Último valor extraído
    COALESCE(last_ai_use, last_clube_activity, last_cartografia, signup_date) as last_value_timestamp
FROM risk_calculations;
