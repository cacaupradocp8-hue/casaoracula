
-- 1. Add status and visivel columns to oracular_seasons
ALTER TABLE public.oracular_seasons ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'planejada';
ALTER TABLE public.oracular_seasons ADD COLUMN IF NOT EXISTS visivel BOOLEAN DEFAULT false;

-- 2. Add encontro fields to clube_livro_ciclos
ALTER TABLE public.clube_livro_ciclos ADD COLUMN IF NOT EXISTS data_encontro TIMESTAMPTZ;
ALTER TABLE public.clube_livro_ciclos ADD COLUMN IF NOT EXISTS link_encontro TEXT;
ALTER TABLE public.clube_livro_ciclos ADD COLUMN IF NOT EXISTS link_gravacao TEXT;

-- 3. Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ciclo_id UUID REFERENCES public.clube_livro_ciclos(id) ON DELETE SET NULL,
  carga_horaria_total INTEGER DEFAULT 20,
  issue_date DATE DEFAULT CURRENT_DATE,
  certificado_url TEXT,
  status TEXT DEFAULT 'elegivel',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON public.certificates FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage certificates"
  ON public.certificates FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- 4. Ensure only one season can be active (enforced via trigger)
CREATE OR REPLACE FUNCTION public.enforce_single_active_season()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'ativa' AND (OLD.status IS NULL OR OLD.status != 'ativa') THEN
    UPDATE public.oracular_seasons
    SET status = 'concluida'
    WHERE status = 'ativa' AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_single_active_season ON public.oracular_seasons;
CREATE TRIGGER trg_enforce_single_active_season
  BEFORE INSERT OR UPDATE ON public.oracular_seasons
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_single_active_season();
