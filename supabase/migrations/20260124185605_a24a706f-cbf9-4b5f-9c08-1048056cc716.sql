-- Add metadata fields to contos_clinicos table
ALTER TABLE public.contos_clinicos 
ADD COLUMN IF NOT EXISTS eixo_simbolico text,
ADD COLUMN IF NOT EXISTS nivel_risco text DEFAULT 'baixo' CHECK (nivel_risco IN ('baixo', 'medio', 'alto')),
ADD COLUMN IF NOT EXISTS tipo_uso text DEFAULT 'estudo' CHECK (tipo_uso IN ('estudo', 'clinico_autorizado')),
ADD COLUMN IF NOT EXISTS exige_certificacao boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS permite_grupo boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS permite_crise_aguda boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS restricoes_combinacao text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS exige_cartografia boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS audio_padrao_disponivel boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS audio_padrao_id uuid REFERENCES public.audio_assets(id),
ADD COLUMN IF NOT EXISTS aviso_etico text;

-- Create index for risk level queries
CREATE INDEX IF NOT EXISTS idx_contos_clinicos_nivel_risco ON public.contos_clinicos(nivel_risco);

-- Create index for certification requirement
CREATE INDEX IF NOT EXISTS idx_contos_clinicos_exige_cert ON public.contos_clinicos(exige_certificacao);

-- Add comment for documentation
COMMENT ON COLUMN public.contos_clinicos.nivel_risco IS 'Risk level: baixo, medio, alto';
COMMENT ON COLUMN public.contos_clinicos.tipo_uso IS 'Usage type: estudo (study only), clinico_autorizado (authorized clinical use)';
COMMENT ON COLUMN public.contos_clinicos.restricoes_combinacao IS 'Array of porta_psiquica values that cannot be combined with this tale';
COMMENT ON COLUMN public.contos_clinicos.exige_cartografia IS 'Requires symbolic reaction mapping after use';