
-- Add missing columns to interventions table
ALTER TABLE public.interventions 
  ADD COLUMN IF NOT EXISTS descricao_breve text,
  ADD COLUMN IF NOT EXISTS objetivo text,
  ADD COLUMN IF NOT EXISTS passo_a_passo text,
  ADD COLUMN IF NOT EXISTS perguntas_chave text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS materiais text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS arquetipos_relacionados text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS usage_count integer DEFAULT 0;

-- Create intervention_favorites table
CREATE TABLE IF NOT EXISTS public.intervention_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intervention_id uuid NOT NULL REFERENCES public.interventions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, intervention_id)
);

ALTER TABLE public.intervention_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.intervention_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.intervention_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.intervention_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
