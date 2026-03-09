
CREATE TABLE public.conselho_partes_internas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  partes_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  dialogos_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  tema_conselho TEXT,
  sabedoria_integrada TEXT,
  decisao_conselho TEXT,
  reflexao_final TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.conselho_partes_internas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own conselho"
  ON public.conselho_partes_internas
  FOR ALL TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));
