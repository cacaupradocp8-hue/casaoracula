ALTER TABLE public.clube_camara_escuta_registros 
ADD COLUMN IF NOT EXISTS intensidade_escuta TEXT,
ADD COLUMN IF NOT EXISTS rota_id UUID,
ADD COLUMN IF NOT EXISTS estacao_id UUID;

-- Grant permissions (as required by rules)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_camara_escuta_registros TO authenticated;
GRANT ALL ON public.clube_camara_escuta_registros TO service_role;
