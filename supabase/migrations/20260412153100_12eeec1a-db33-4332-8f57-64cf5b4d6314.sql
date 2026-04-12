
CREATE TABLE public.oraculo_portais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  nome text NOT NULL,
  subtitulo text,
  ordem integer NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  descricao_curta text,
  objetivo_formativo text,
  inspirado_em text DEFAULT 'Mulheres que Correm com os Lobos',
  cover_image_url text,
  icon_name text,
  tempo_estimado text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Validation trigger instead of CHECK constraint
CREATE OR REPLACE FUNCTION public.validate_oraculo_portais_status()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status NOT IN ('draft', 'published', 'archived') THEN
    RAISE EXCEPTION 'status must be draft, published or archived';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_oraculo_portais_status
BEFORE INSERT OR UPDATE ON public.oraculo_portais
FOR EACH ROW EXECUTE FUNCTION public.validate_oraculo_portais_status();

-- Auto-update updated_at
CREATE TRIGGER update_oraculo_portais_updated_at
BEFORE UPDATE ON public.oraculo_portais
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.oraculo_portais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published portais are viewable by everyone"
ON public.oraculo_portais FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins have full access to oraculo_portais"
ON public.oraculo_portais FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
