-- 1. Create clube_rotas table
CREATE TABLE IF NOT EXISTS public.clube_rotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    obra_regente TEXT,
    autor TEXT,
    frase_guia TEXT,
    descricao TEXT,
    banner_url TEXT,
    livro_capa_url TEXT,
    audio_acolhimento_url TEXT,
    ativa BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    publicada BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Grants for clube_rotas
GRANT SELECT ON public.clube_rotas TO authenticated;
GRANT SELECT ON public.clube_rotas TO anon;
GRANT ALL ON public.clube_rotas TO service_role;

-- 3. Enable RLS for clube_rotas
ALTER TABLE public.clube_rotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for active routes" 
ON public.clube_rotas FOR SELECT 
USING (ativa = true AND publicada = true);

-- 4. Extend clube_estacoes
ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS rota_id UUID REFERENCES public.clube_rotas(id),
ADD COLUMN IF NOT EXISTS distrito_cidadela TEXT,
ADD COLUMN IF NOT EXISTS ferramenta_oracular_nome TEXT,
ADD COLUMN IF NOT EXISTS movimento_simbolico TEXT,
ADD COLUMN IF NOT EXISTS frase_abertura TEXT,
ADD COLUMN IF NOT EXISTS frase_voz_clareira TEXT,
ADD COLUMN IF NOT EXISTS caso_simbolico JSONB, -- {titulo, texto, pergunta, opcoes}
ADD COLUMN IF NOT EXISTS revelacao JSONB, -- {porta, campo, torre, labirinto, pergunta}
ADD COLUMN IF NOT EXISTS missao_campo JSONB, -- {titulo, instrucao}
ADD COLUMN IF NOT EXISTS fechamento_texto TEXT,
ADD COLUMN IF NOT EXISTS audio_voz_clareira_url TEXT,
ADD COLUMN IF NOT EXISTS livro_imagem_banner_url TEXT;

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clube_rotas_updated_at 
BEFORE UPDATE ON public.clube_rotas 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
