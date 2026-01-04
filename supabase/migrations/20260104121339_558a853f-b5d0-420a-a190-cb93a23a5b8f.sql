-- Create table for professional onboarding confirmations (if not exists)
CREATE TABLE IF NOT EXISTS public.confirmacao_profissional (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    tipo_atuacao TEXT NOT NULL, -- terapeuta, psicologa, mentora, facilitadora, etc
    area_formacao TEXT,
    anos_experiencia INTEGER,
    aceita_codigo_etico BOOLEAN NOT NULL DEFAULT false,
    confirmado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.confirmacao_profissional ENABLE ROW LEVEL SECURITY;

-- Users can insert their own confirmation
CREATE POLICY "Users can insert own confirmation"
    ON public.confirmacao_profissional
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can view own confirmation
CREATE POLICY "Users can view own confirmation"
    ON public.confirmacao_profissional
    FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all confirmations
CREATE POLICY "Admins can view all confirmations"
    ON public.confirmacao_profissional
    FOR SELECT
    USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Admins can manage all confirmations
CREATE POLICY "Admins can manage all confirmations"
    ON public.confirmacao_profissional
    FOR ALL
    USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Create table for lista de espera (non-professionals)
CREATE TABLE IF NOT EXISTS public.lista_espera (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email TEXT NOT NULL,
    nome TEXT,
    interesse TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lista_espera ENABLE ROW LEVEL SECURITY;

-- Anyone can insert into waiting list
CREATE POLICY "Anyone can join waiting list"
    ON public.lista_espera
    FOR INSERT
    WITH CHECK (true);

-- Users can view own entry
CREATE POLICY "Users can view own entry"
    ON public.lista_espera
    FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Admins can manage waiting list
CREATE POLICY "Admins can manage waiting list"
    ON public.lista_espera
    FOR ALL
    USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Function to check if user is a confirmed professional
CREATE OR REPLACE FUNCTION public.is_profissional_confirmada(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.confirmacao_profissional
        WHERE user_id = _user_id
        AND aceita_codigo_etico = true
    )
$$;

-- Trigger for updated_at
CREATE TRIGGER update_confirmacao_profissional_updated_at
    BEFORE UPDATE ON public.confirmacao_profissional
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();