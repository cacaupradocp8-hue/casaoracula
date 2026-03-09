
CREATE TABLE public.cartografia_complexos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  complexos_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  gatilhos_gerais TEXT,
  padrao_central TEXT,
  complexo_dominante TEXT,
  complexo_latente TEXT,
  reflexao_origem TEXT,
  reflexao_final TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cartografia_complexos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own complexos"
  ON public.cartografia_complexos
  FOR ALL TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));
