
-- Intervention types enum
CREATE TYPE public.intervention_type AS ENUM ('pergunta_clinica', 'micro_ritual', 'exercicio_narrativo', 'intervencao_simbolica');
CREATE TYPE public.intervention_level AS ENUM ('basico', 'intermediario', 'avancado');

-- Interventions table
CREATE TABLE public.interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.intervention_type NOT NULL,
  district_id uuid REFERENCES public.districts(id) ON DELETE SET NULL,
  tower_key text,
  archetype_key text,
  level public.intervention_level NOT NULL DEFAULT 'basico',
  title text NOT NULL,
  content text NOT NULL,
  contraindications text,
  tags text[] DEFAULT '{}',
  ativa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read active interventions"
  ON public.interventions FOR SELECT TO authenticated
  USING (ativa = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage interventions"
  ON public.interventions FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Favorites table
CREATE TABLE public.intervention_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intervention_id uuid NOT NULL REFERENCES public.interventions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, intervention_id)
);

ALTER TABLE public.intervention_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own favorites"
  ON public.intervention_favorites FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add used_interventions to sessions
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS used_intervention_ids uuid[] DEFAULT '{}';
