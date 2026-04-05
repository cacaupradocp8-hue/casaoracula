
-- Add new columns to collective_bed_entries
ALTER TABLE public.collective_bed_entries
  ADD COLUMN IF NOT EXISTS entry_type text NOT NULL DEFAULT 'reflexao',
  ADD COLUMN IF NOT EXISTS published_title text,
  ADD COLUMN IF NOT EXISTS removed_at timestamptz;

-- Create canteiro_reactions table
CREATE TABLE public.canteiro_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES public.collective_bed_entries(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reaction_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(entry_id, user_id, reaction_type)
);

-- Validate reaction_type
CREATE OR REPLACE FUNCTION public.validate_canteiro_reaction_type()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.reaction_type NOT IN ('ecoou', 'guardar_refletir', 'levar_travessia') THEN
    RAISE EXCEPTION 'reaction_type must be ecoou, guardar_refletir or levar_travessia';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_canteiro_reaction_type
  BEFORE INSERT OR UPDATE ON public.canteiro_reactions
  FOR EACH ROW EXECUTE FUNCTION public.validate_canteiro_reaction_type();

-- RLS for canteiro_reactions
ALTER TABLE public.canteiro_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view reactions"
  ON public.canteiro_reactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add own reactions"
  ON public.canteiro_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON public.canteiro_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access reactions"
  ON public.canteiro_reactions FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));
