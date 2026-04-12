
CREATE TABLE public.oraculo_portal_materiais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL REFERENCES public.oraculo_portais(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  titulo text NOT NULL,
  descricao text,
  url text,
  ordem integer NOT NULL DEFAULT 1,
  is_locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_oraculo_material_tipo()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.tipo NOT IN ('pdf','slide','video','audio','link','imagem','bonus') THEN
    RAISE EXCEPTION 'tipo must be pdf, slide, video, audio, link, imagem or bonus';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_oraculo_material_tipo
BEFORE INSERT OR UPDATE ON public.oraculo_portal_materiais
FOR EACH ROW EXECUTE FUNCTION public.validate_oraculo_material_tipo();

CREATE TRIGGER update_oraculo_portal_materiais_updated_at
BEFORE UPDATE ON public.oraculo_portal_materiais
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.oraculo_portal_materiais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read portal materiais"
ON public.oraculo_portal_materiais FOR SELECT
USING (true);

CREATE POLICY "Admins manage portal materiais"
ON public.oraculo_portal_materiais FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
