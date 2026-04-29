-- Tabela para histórico de ações enviadas
CREATE TABLE IF NOT EXISTS public.admin_action_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    action_type TEXT NOT NULL,
    channel TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    sent_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.admin_action_history ENABLE ROW LEVEL SECURITY;

-- Políticas para Admin
CREATE POLICY "Admins can view action history" 
ON public.admin_action_history FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal = 'admin'));

CREATE POLICY "Admins can insert action history" 
ON public.admin_action_history FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal = 'admin'));

-- Recriar View com Sistema de Decisão (V4)
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
        -- 1. Conversion Risk
        CASE 
            WHEN subscription_status IS NULL OR subscription_status != 'active' THEN
                LEAST(100, (
                    CASE WHEN total_cartografias = 0 THEN 40 ELSE 0 END +
                    CASE WHEN total_jardim = 0 THEN 30 ELSE 0 END +
                    CASE WHEN signup_date < now() - interval '3 days' AND total_cartografias = 0 THEN 30 ELSE 0 END
                ))
            ELSE 0 
        END as conversion_risk_score,

        -- 2. Churn Risk
        CASE 
            WHEN subscription_status = 'active' AND portal = 'aluna' THEN
                LEAST(100, (
                    CASE WHEN last_clube_activity < now() - interval '7 days' OR last_clube_activity IS NULL THEN 50 ELSE 0 END +
                    CASE WHEN last_ai_use < now() - interval '10 days' OR last_ai_use IS NULL THEN 30 ELSE 0 END +
                    CASE WHEN last_cartografia < now() - interval '15 days' OR last_cartografia IS NULL THEN 20 ELSE 0 END
                ))
            ELSE 0
        END as churn_risk_score,

        -- 3. SaaS Value Risk
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
        WHEN saas_value_risk_score > 30 THEN 'Uso Irregular do SaaS'
        WHEN churn_risk_score > 30 THEN 'Queda de Engajamento no Clube'
        WHEN conversion_risk_score > 30 THEN 'Potencial Churn no Funil'
        ELSE 'Engajamento Normal'
    END as action_reason,

    -- Próxima Melhor Ação
    CASE 
        WHEN saas_value_risk_score > 60 THEN 'Tutorial: Como usar a Cabine na prática'
        WHEN churn_risk_score > 60 THEN 'Mensagem de Resgate: Próximo Passo na Rota'
        WHEN conversion_risk_score > 60 THEN 'Incentivo: Concluir Cartografia Psíquica'
        WHEN saas_value_risk_score > 30 THEN 'Sugestão de Novo Modelo de IA'
        WHEN churn_risk_score > 30 THEN 'Destaque da Semana no Clube'
        WHEN conversion_risk_score > 30 THEN 'Tutorial: Primeiros Passos'
        ELSE 'Monitorar Apenas'
    END as recommended_action,

    -- Canal Sugerido
    CASE 
        WHEN saas_value_risk_score > 60 OR churn_risk_score > 60 THEN 'Suporte Manual'
        WHEN conversion_risk_score > 60 THEN 'E-mail'
        WHEN saas_value_risk_score > 30 OR churn_risk_score > 30 OR conversion_risk_score > 30 THEN 'Notificação'
        ELSE 'Ignorar'
    END as suggested_channel,

    -- Prioridade
    CASE 
        WHEN saas_value_risk_score > 60 OR churn_risk_score > 60 OR conversion_risk_score > 60 THEN 'Alta'
        WHEN saas_value_risk_score > 30 OR churn_risk_score > 30 OR conversion_risk_score > 30 THEN 'Média'
        ELSE 'Baixa'
    END as priority_level,

    -- Verificação de Ação Enviada
    EXISTS(
        SELECT 1 FROM admin_action_history 
        WHERE user_id = risk_calculations.user_id 
        AND action_type = 
            CASE 
                WHEN saas_value_risk_score > 30 THEN 'tutorial_saas'
                WHEN churn_risk_score > 30 THEN 'resgate_clube'
                WHEN conversion_risk_score > 30 THEN 'onboarding_cartografia'
                ELSE 'monitoramento'
            END
    ) as action_already_sent,

    COALESCE(last_ai_use, last_clube_activity, last_cartografia, signup_date) as last_value_timestamp
FROM risk_calculations;