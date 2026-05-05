-- Tabela para os slides do carrossel do Clube
CREATE TABLE public.clube_carrossel_slides (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    estacao_id UUID REFERENCES public.oracular_seasons(id) ON DELETE CASCADE,
    rota_slug TEXT,
    titulo TEXT,
    subtitulo TEXT,
    texto TEXT,
    ordem INTEGER NOT NULL DEFAULT 0,
    icone TEXT,
    status TEXT NOT NULL DEFAULT 'rascunho',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT valid_status CHECK (status IN ('rascunho', 'publicado'))
);

-- Tabela para os insights/frases do Portal
CREATE TABLE public.clube_portal_insights (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    estacao_id UUID REFERENCES public.oracular_seasons(id) ON DELETE CASCADE,
    rota_slug TEXT,
    frase TEXT NOT NULL,
    intensidade TEXT DEFAULT 'suave',
    frequencia TEXT DEFAULT 'diario',
    ordem INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT valid_intensidade CHECK (intensidade IN ('suave', 'profunda', 'impactante')),
    CONSTRAINT valid_frequencia CHECK (frequencia IN ('diario', 'por_acesso', 'sorteio')),
    CONSTRAINT valid_status CHECK (status IN ('ativo', 'arquivado'))
);

-- Habilitar RLS
ALTER TABLE public.clube_carrossel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_portal_insights ENABLE ROW LEVEL SECURITY;

-- Políticas para clube_carrossel_slides
CREATE POLICY "Leitura pública de slides publicados"
ON public.clube_carrossel_slides FOR SELECT
USING (status = 'publicado' OR public.is_admin(auth.uid()));

CREATE POLICY "Admin pode gerenciar slides"
ON public.clube_carrossel_slides FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Políticas para clube_portal_insights
CREATE POLICY "Leitura pública de insights ativos"
ON public.clube_portal_insights FOR SELECT
USING (status = 'ativo' OR public.is_admin(auth.uid()));

CREATE POLICY "Admin pode gerenciar insights"
ON public.clube_portal_insights FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Triggers para updated_at
CREATE TRIGGER set_clube_carrossel_slides_updated_at
BEFORE UPDATE ON public.clube_carrossel_slides
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_clube_portal_insights_updated_at
BEFORE UPDATE ON public.clube_portal_insights
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
