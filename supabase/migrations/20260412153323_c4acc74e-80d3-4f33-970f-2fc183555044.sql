
CREATE TABLE public.oraculo_portal_jardins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL REFERENCES public.oraculo_portais(id) ON DELETE CASCADE,
  jardim_psique text,
  jardim_oficio text,
  laboratorio_integracao text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(portal_id)
);

CREATE TRIGGER update_oraculo_portal_jardins_updated_at
BEFORE UPDATE ON public.oraculo_portal_jardins
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.oraculo_portal_jardins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read portal jardins"
ON public.oraculo_portal_jardins FOR SELECT
USING (true);

CREATE POLICY "Admins manage portal jardins"
ON public.oraculo_portal_jardins FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
