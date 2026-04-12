
CREATE TABLE public.oraculo_portal_forjas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL REFERENCES public.oraculo_portais(id) ON DELETE CASCADE,
  cenario text,
  portal_ativo text,
  conto_sugerido text,
  ajuste_fino text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(portal_id)
);

CREATE TRIGGER update_oraculo_portal_forjas_updated_at
BEFORE UPDATE ON public.oraculo_portal_forjas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.oraculo_portal_forjas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read portal forjas"
ON public.oraculo_portal_forjas FOR SELECT
USING (true);

CREATE POLICY "Admins manage portal forjas"
ON public.oraculo_portal_forjas FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
