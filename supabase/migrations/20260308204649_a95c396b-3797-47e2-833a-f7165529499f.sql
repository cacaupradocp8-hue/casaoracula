
CREATE TABLE public.reflexoes_jornada (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  therapist_id uuid NOT NULL,
  texto text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reflexoes_jornada ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_reflexoes_jornada_client ON public.reflexoes_jornada(client_id);
CREATE INDEX idx_reflexoes_jornada_therapist ON public.reflexoes_jornada(therapist_id);

CREATE POLICY "therapist_manage_own" ON public.reflexoes_jornada
  FOR ALL TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER update_reflexoes_jornada_updated_at
  BEFORE UPDATE ON public.reflexoes_jornada
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
