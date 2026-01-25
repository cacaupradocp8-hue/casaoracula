-- Expand jardim_psique_registros for full symbolic diary functionality
ALTER TABLE public.jardim_psique_registros 
ADD COLUMN IF NOT EXISTS tipo_registro TEXT DEFAULT 'ferramenta',
ADD COLUMN IF NOT EXISTS titulo TEXT,
ADD COLUMN IF NOT EXISTS fonte TEXT,
ADD COLUMN IF NOT EXISTS emocao_predominante TEXT;

-- Update existing records to have tipo_registro = 'ferramenta'
UPDATE public.jardim_psique_registros 
SET tipo_registro = 'ferramenta' 
WHERE tipo_registro IS NULL;

-- Add constraint for valid tipo_registro values
ALTER TABLE public.jardim_psique_registros 
ADD CONSTRAINT jardim_tipo_registro_check 
CHECK (tipo_registro IN ('ferramenta', 'sonho', 'frase', 'fragmento', 'oraculo', 'reflexao'));

-- Create index for faster filtering by tipo_registro
CREATE INDEX IF NOT EXISTS idx_jardim_tipo_registro ON public.jardim_psique_registros(tipo_registro);
CREATE INDEX IF NOT EXISTS idx_jardim_user_tipo ON public.jardim_psique_registros(user_id, tipo_registro);