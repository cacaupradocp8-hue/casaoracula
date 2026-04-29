-- 1. Tabela de Preços de Provedores
CREATE TABLE IF NOT EXISTS public.ai_provider_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name TEXT UNIQUE NOT NULL,
    provider TEXT NOT NULL, 
    input_price_per_1m_tokens DECIMAL(10,4) NOT NULL,
    output_price_per_1m_tokens DECIMAL(10,4) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

INSERT INTO public.ai_provider_prices (model_name, provider, input_price_per_1m_tokens, output_price_per_1m_tokens)
VALUES 
('gpt-4o', 'openai', 5.00, 15.00),
('gpt-4-turbo', 'openai', 10.00, 30.00),
('gpt-3.5-turbo', 'openai', 0.50, 1.50)
ON CONFLICT (model_name) DO NOTHING;

-- 2. Refinar a View de Estagnação e Risco (Ajustada para colunas reais)
DROP VIEW IF EXISTS public.view_user_stagnation;

CREATE OR REPLACE VIEW public.view_user_stagnation AS
WITH user_metrics AS (
    SELECT 
        p.id AS user_id,
        p.nome,
        p.email,
        p.portal,
        s.plan_id,
        s.status AS subscription_status,
        (SELECT MAX(created_at) FROM ai_interaction_logs WHERE user_id = p.id) as last_ai_use,
        (SELECT MAX(updated_at) FROM clube_rota_progresso WHERE user_id = p.id) as last_clube_activity,
        (SELECT COUNT(*) FROM cartografia_psiquica WHERE user_id = p.id) as total_cartografias,
        (SELECT COUNT(*) FROM co_jardim_entries WHERE user_id = p.id) as total_jardim,
        EXISTS(SELECT 1 FROM profiles WHERE id = p.id AND portal = 'aluna') as is_aluna
    FROM profiles p
    LEFT JOIN subscriptions s ON s.user_id = p.id
)
SELECT 
    m.*,
    CASE 
        WHEN m.subscription_status = 'active' AND m.last_ai_use IS NULL THEN 'Terapeuta sem uso do SaaS'
        WHEN m.is_aluna AND m.total_cartografias = 0 THEN 'Cartografia não iniciada'
        WHEN m.last_clube_activity < now() - interval '7 days' AND m.last_clube_activity IS NOT NULL THEN 'Parada no Clube > 7 dias'
        WHEN m.is_aluna AND m.total_jardim = 0 THEN 'Cliente sem diagnóstico'
        WHEN m.last_ai_use < now() - interval '15 days' THEN 'Inatividade Prolongada'
        ELSE 'Saudável'
    END as stagnation_reason,
    LEAST(100, (
        CASE WHEN m.subscription_status = 'active' AND m.last_ai_use < now() - interval '7 days' THEN 40 ELSE 0 END +
        CASE WHEN m.last_clube_activity < now() - interval '10 days' THEN 30 ELSE 0 END +
        CASE WHEN m.is_aluna AND m.total_cartografias = 0 THEN 20 ELSE 0 END +
        CASE WHEN m.last_ai_use IS NULL AND m.subscription_status = 'active' THEN 50 ELSE 0 END
    )) as risk_score
FROM user_metrics m;

-- 3. Índice de apoio
CREATE INDEX IF NOT EXISTS idx_profiles_portal_v2 ON public.profiles (portal);