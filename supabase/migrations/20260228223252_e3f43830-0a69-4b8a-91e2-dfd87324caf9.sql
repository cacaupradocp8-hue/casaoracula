
-- =============================================
-- CANTEIRO DA ESTAÇÃO — Schema
-- =============================================

-- 1. Collective beds (one per season)
CREATE TABLE public.collective_beds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID NOT NULL REFERENCES public.oracular_seasons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ativo',
  aberto_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  encerrado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(season_id)
);

ALTER TABLE public.collective_beds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active collective_beds"
  ON public.collective_beds FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage collective_beds"
  ON public.collective_beds FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- 2. Collective bed entries (curated partilhas)
CREATE TABLE public.collective_bed_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bed_id UUID NOT NULL REFERENCES public.collective_beds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES public.oracular_seasons(id) ON DELETE CASCADE,
  origem TEXT NOT NULL DEFAULT 'psique',
  texto TEXT NOT NULL,
  aprovado_por_admin BOOLEAN NOT NULL DEFAULT false,
  publicado_em TIMESTAMPTZ,
  exibicao_anonima BOOLEAN NOT NULL DEFAULT false,
  rejeitado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.collective_bed_entries ENABLE ROW LEVEL SECURITY;

-- Users can read only approved & published entries
CREATE POLICY "Read published entries"
  ON public.collective_bed_entries FOR SELECT TO authenticated
  USING (
    aprovado_por_admin = true
    AND publicado_em IS NOT NULL
    AND NOT rejeitado
  );

-- Users can insert their own submissions
CREATE POLICY "Users can submit entries"
  ON public.collective_bed_entries FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own entries (even unpublished)
CREATE POLICY "Users can view own entries"
  ON public.collective_bed_entries FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admin can manage all entries
CREATE POLICY "Admin can manage entries"
  ON public.collective_bed_entries FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- 3. Auto-create canteiro when season becomes active
CREATE OR REPLACE FUNCTION public.auto_create_canteiro_on_season_active()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'ativa' AND (OLD.status IS NULL OR OLD.status != 'ativa') THEN
    -- Create new canteiro for this season
    INSERT INTO public.collective_beds (season_id, status, aberto_em)
    VALUES (NEW.id, 'ativo', now())
    ON CONFLICT (season_id) DO UPDATE SET status = 'ativo', aberto_em = now(), encerrado_em = NULL;
  END IF;
  
  IF NEW.status = 'concluida' AND (OLD.status IS NULL OR OLD.status != 'concluida') THEN
    -- Close the canteiro
    UPDATE public.collective_beds
    SET status = 'encerrado', encerrado_em = now(), updated_at = now()
    WHERE season_id = NEW.id AND status = 'ativo';
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_canteiro ON public.oracular_seasons;
CREATE TRIGGER trg_auto_canteiro
  AFTER INSERT OR UPDATE ON public.oracular_seasons
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_canteiro_on_season_active();
