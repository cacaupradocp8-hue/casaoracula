-- Add columns to co_camara_sussurro_casos
ALTER TABLE public.co_camara_sussurro_casos 
ADD COLUMN IF NOT EXISTS camadas_leitura TEXT,
ADD COLUMN IF NOT EXISTS risco_etico TEXT,
ADD COLUMN IF NOT EXISTS feedback_tecnico TEXT,
ADD COLUMN IF NOT EXISTS proximo_treino_id UUID REFERENCES public.co_camara_sussurro_casos(id),
ADD COLUMN IF NOT EXISTS explicacao_leve TEXT;

-- Add index for next training reference
CREATE INDEX IF NOT EXISTS idx_camara_casos_proximo_treino ON public.co_camara_sussurro_casos(proximo_treino_id);
