-- Add secondary territories to works table
ALTER TABLE public.clube_camara_escuta_obras 
ADD COLUMN IF NOT EXISTS territorio_secundario_2 TEXT;

-- Rename existing optional field to follow pattern if needed (already exists as territorio_secundario_1)
-- Ensuring both exist as requested by rule: 1 main + up to 2 secondary

-- Create a more robust registration table for listening if it doesn't meet the metadata requirements
CREATE TABLE IF NOT EXISTS public.clube_escuta_registros_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    obra_id UUID NOT NULL REFERENCES public.clube_camara_escuta_obras(id),
    estacao_id UUID NOT NULL REFERENCES public.clube_estacoes(id),
    simbolo_percebido TEXT,
    emocao_predominante TEXT,
    territorio_impactado TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_escuta_registros_v2 TO authenticated;
GRANT ALL ON public.clube_escuta_registros_v2 TO service_role;
ALTER TABLE public.clube_escuta_registros_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own listening records" 
ON public.clube_escuta_registros_v2 FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
