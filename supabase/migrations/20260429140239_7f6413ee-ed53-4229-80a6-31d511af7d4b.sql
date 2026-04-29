-- 1. Evoluir tabela de histórico para capturar contexto do momento da ação
ALTER TABLE public.admin_action_history
ADD COLUMN IF NOT EXISTS conversion_risk_at_action NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS churn_risk_at_action NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS saas_value_risk_at_action NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS action_reason_at_action TEXT,
ADD COLUMN IF NOT EXISTS last_value_timestamp_at_action TIMESTAMP WITH TIME ZONE;

-- 2. View de Aprendizado Operacional (Mede eficácia)
CREATE OR REPLACE VIEW public.view_admin_action_performance AS
WITH action_outcomes AS (
    SELECT 
        a.id AS action_id,
        a.user_id,
        a.action_type,
        a.channel,
        a.sent_at,
        a.sent_by,
        a.conversion_risk_at_action,
        a.churn_risk_at_action,
        a.saas_value_risk_at_action,
        -- Estado Atual da Usuária (join com a view de estagnação atual)
        v.conversion_risk_score AS current_conversion_risk,
        v.churn_risk_score AS current_churn_risk,
        v.saas_value_risk_score AS current_saas_value_risk,
        v.last_value_timestamp AS current_last_value,
        v.subscription_status AS current_sub_status,
        -- Métricas de Sucesso
        (v.last_value_timestamp > a.sent_at) AS returned_to_access,
        (
            CASE 
                WHEN a.conversion_risk_at_action > 0 THEN v.conversion_risk_score < a.conversion_risk_at_action
                WHEN a.churn_risk_at_action > 0 THEN v.churn_risk_score < a.churn_risk_at_action
                WHEN a.saas_value_risk_at_action > 0 THEN v.saas_value_risk_score < a.saas_value_risk_at_action
                ELSE false
            END
        ) AS reduced_score,
        (a.conversion_risk_at_action > 0 AND v.subscription_status = 'active') AS converted,
        (a.churn_risk_at_action > 0 AND v.subscription_status = 'active') AS prevented_churn
    FROM public.admin_action_history a
    JOIN public.view_user_stagnation v ON v.user_id = a.user_id
)
SELECT 
    action_type,
    channel,
    COUNT(*) AS total_actions,
    COUNT(*) FILTER (WHERE returned_to_access) AS total_returned,
    COUNT(*) FILTER (WHERE reduced_score) AS total_score_reduced,
    COUNT(*) FILTER (WHERE converted) AS total_converted,
    COUNT(*) FILTER (WHERE prevented_churn) AS total_retained,
    -- Taxa de Sucesso (considera qualquer sinal positivo)
    ROUND(
        (COUNT(*) FILTER (WHERE returned_to_access OR reduced_score OR converted OR prevented_churn)::NUMERIC / 
        NULLIF(COUNT(*), 0)::NUMERIC) * 100, 
    2) AS success_rate
FROM action_outcomes
GROUP BY action_type, channel;
