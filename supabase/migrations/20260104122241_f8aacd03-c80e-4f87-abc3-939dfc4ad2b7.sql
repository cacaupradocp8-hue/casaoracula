-- 1. Add missing fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'aluna' CHECK (role IN ('aluna', 'terapeuta', 'admin')),
ADD COLUMN IF NOT EXISTS access_status TEXT NOT NULL DEFAULT 'visitor' CHECK (access_status IN ('visitor', 'member_free', 'member_continuity')),
ADD COLUMN IF NOT EXISTS is_professional_verified BOOLEAN NOT NULL DEFAULT false;

-- 2. Create subscriptions table for Rockty
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'rockty',
    plan_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'expired')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    last_event_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    external_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view own subscriptions
CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions"
    ON public.subscriptions
    FOR ALL
    USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Service role can manage subscriptions (for webhook)
CREATE POLICY "Service role can manage subscriptions"
    ON public.subscriptions
    FOR ALL
    USING (auth.role() = 'service_role');

-- 3. Create app_settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can read app_settings"
    ON public.app_settings
    FOR SELECT
    USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage app_settings"
    ON public.app_settings
    FOR ALL
    USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- 4. Create webhook_logs for tracking events
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB,
    processed BOOLEAN DEFAULT false,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admins can view webhook_logs"
    ON public.webhook_logs
    FOR SELECT
    USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Service role can insert logs
CREATE POLICY "Service role can manage webhook_logs"
    ON public.webhook_logs
    FOR ALL
    USING (auth.role() = 'service_role');

-- 5. Insert default app_settings
INSERT INTO public.app_settings (key, value, description) VALUES
    ('cta_whatsapp_number', '5511999999999', 'Número do WhatsApp para contato'),
    ('cta_matricula_url', 'https://rockty.com/sua-matricula', 'URL de matrícula na Rockty'),
    ('mentoria_description', 'Espaço de supervisão e acompanhamento para Iniciadas ORÁCULA.', 'Descrição da área de mentoria'),
    ('modal_conteudo_bloqueado_titulo', 'Conteúdo exclusivo para matriculadas', 'Título do modal de conteúdo bloqueado'),
    ('modal_conteudo_bloqueado_texto', 'Este conteúdo faz parte da formação ORÁCULA. Para acessar, você precisa fazer parte da jornada.', 'Texto do modal de conteúdo bloqueado'),
    ('carencia_days', '3', 'Dias de carência após falha de pagamento')
ON CONFLICT (key) DO NOTHING;

-- 6. Update triggers
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
    BEFORE UPDATE ON public.app_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Function to get user access status from subscription
CREATE OR REPLACE FUNCTION public.get_user_access_status(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        (SELECT 
            CASE 
                WHEN s.status = 'active' THEN 'member_continuity'
                WHEN s.status = 'past_due' THEN 'member_continuity' -- carência
                WHEN s.status = 'canceled' AND s.current_period_end > now() THEN 'member_continuity'
                ELSE 'member_free'
            END
        FROM public.subscriptions s
        WHERE s.user_id = _user_id
        ORDER BY s.created_at DESC
        LIMIT 1),
        'visitor'
    )
$$;

-- 8. Function to sync profile access_status from subscription
CREATE OR REPLACE FUNCTION public.sync_profile_access_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.profiles
    SET access_status = get_user_access_status(NEW.user_id),
        updated_at = now()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$;

-- Trigger to sync access_status when subscription changes
CREATE TRIGGER sync_access_on_subscription_change
    AFTER INSERT OR UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_profile_access_status();