-- Adicionar colunas necessárias à clube_v3_routes
ALTER TABLE public.clube_v3_routes 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS banner_desktop_url TEXT,
ADD COLUMN IF NOT EXISTS banner_mobile_url TEXT,
ADD COLUMN IF NOT EXISTS audio_welcome_url TEXT,
ADD COLUMN IF NOT EXISTS audio_welcome_title TEXT,
ADD COLUMN IF NOT EXISTS audio_welcome_image TEXT,
ADD COLUMN IF NOT EXISTS carta_titulo TEXT,
ADD COLUMN IF NOT EXISTS carta_texto TEXT,
ADD COLUMN IF NOT EXISTS carta_assinatura TEXT,
ADD COLUMN IF NOT EXISTS carta_imagem_url TEXT,
ADD COLUMN IF NOT EXISTS fechamento_imagem_url TEXT,
ADD COLUMN IF NOT EXISTS sussurros TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Criar índice por slug para performance
CREATE INDEX IF NOT EXISTS idx_clube_v3_routes_slug ON public.clube_v3_routes(slug);

-- Atualizar permissões (assumindo que já existem, mas garantindo acesso)
GRANT SELECT ON public.clube_v3_routes TO authenticated;
GRANT SELECT ON public.clube_v3_routes TO anon;
GRANT ALL ON public.clube_v3_routes TO service_role;
