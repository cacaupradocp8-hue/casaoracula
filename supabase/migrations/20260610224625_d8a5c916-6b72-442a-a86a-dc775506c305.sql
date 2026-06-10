ALTER TABLE public.clube_estacoes ADD COLUMN IF NOT EXISTS sussurros_frases JSONB DEFAULT '[]'::jsonb;
GRANT ALL ON public.clube_estacoes TO service_role;
GRANT SELECT, UPDATE ON public.clube_estacoes TO authenticated;