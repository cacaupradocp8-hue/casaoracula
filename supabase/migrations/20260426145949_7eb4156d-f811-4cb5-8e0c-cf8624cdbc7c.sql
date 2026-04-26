-- Tabela de Interações do Chat
CREATE TABLE IF NOT EXISTS public.clube_livro_chat_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    cycle_id UUID, -- Referência flexível para ciclos (pode ser v2 ou legado)
    rota_id UUID,
    portal_id UUID,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    interaction_type TEXT DEFAULT 'chat', -- chat, pratica, treinamento, etc
    tokens_estimated INTEGER DEFAULT 0,
    saved_to_jardim BOOLEAN DEFAULT false,
    sent_to_forja BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Limites Diários
CREATE TABLE IF NOT EXISTS public.clube_daily_interaction_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL DEFAULT 'basico', -- basico, premium, admin
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    interactions_used INTEGER DEFAULT 0,
    interactions_limit INTEGER DEFAULT 10,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Ativar RLS
ALTER TABLE public.clube_livro_chat_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_daily_interaction_limits ENABLE ROW LEVEL SECURITY;

-- Políticas para clube_livro_chat_interactions
CREATE POLICY "Users can view their own interactions"
    ON public.clube_livro_chat_interactions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions"
    ON public.clube_livro_chat_interactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all interactions"
    ON public.clube_livro_chat_interactions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.portal = 'admin'
        )
    );

-- Políticas para clube_daily_interaction_limits
CREATE POLICY "Users can view their own limits"
    ON public.clube_daily_interaction_limits
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all limits"
    ON public.clube_daily_interaction_limits
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.portal = 'admin'
        )
    );

-- Gatilho para atualizar updated_at em limites
CREATE OR REPLACE FUNCTION public.update_interaction_limits_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_interaction_limits_timestamp
    BEFORE UPDATE ON public.clube_daily_interaction_limits
    FOR EACH ROW
    EXECUTE FUNCTION public.update_interaction_limits_timestamp();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_chat_user_date ON public.clube_livro_chat_interactions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_limits_user_date ON public.clube_daily_interaction_limits(user_id, date);
