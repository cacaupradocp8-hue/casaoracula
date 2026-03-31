
-- Add alternative districts and support tools to training cases
ALTER TABLE public.co_training_cases 
  ADD COLUMN IF NOT EXISTS distritos_alternativos text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ferramentas_apoio text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS erro_comum text;

-- Add score fields to training attempts
ALTER TABLE public.co_training_attempts
  ADD COLUMN IF NOT EXISTS score_total integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS score_distrito integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS score_hipotese integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS score_ferramenta integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS feedback_json jsonb;

-- Add coerencia_media and taxa_acerto to training progress
ALTER TABLE public.co_training_progress
  ADD COLUMN IF NOT EXISTS coerencia_media numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS taxa_acerto numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_casos integer DEFAULT 0;
