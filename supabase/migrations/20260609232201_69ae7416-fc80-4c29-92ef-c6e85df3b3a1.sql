ALTER TABLE public.clube_camara_escuta_obras 
ADD COLUMN IF NOT EXISTS guia_escuta TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS guia_evitar TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS rastro_simbolo TEXT;

-- Grant permissions (standard practice)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_camara_escuta_obras TO authenticated;
GRANT ALL ON public.clube_camara_escuta_obras TO service_role;