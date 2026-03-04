
ALTER TABLE public.clientes 
  ADD COLUMN IF NOT EXISTS archetypal_profile_json jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS archetypal_profile_history jsonb DEFAULT '[]'::jsonb;
