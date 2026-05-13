-- 1. Índice único parcial para evitar duplicidade de ID externo (Rockty/Stripe)
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_provider_external_id_unique 
ON public.subscriptions (provider, external_subscription_id) 
WHERE external_subscription_id IS NOT NULL;

-- 2. Índice único composto para permitir diferentes planos por usuário/provider
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user_provider_plan_unique 
ON public.subscriptions (user_id, provider, plan_id);