
CREATE TABLE public.rituais_integracao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  aprendizados_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  o_que_deixo TEXT,
  o_que_levo TEXT,
  simbolo_transicao TEXT,
  elementos_ritual JSONB NOT NULL DEFAULT '[]'::jsonb,
  intencao TEXT,
  compromisso TEXT,
  data_ritual DATE,
  reflexao_final TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rituais_integracao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own rituais"
  ON public.rituais_integracao
  FOR ALL TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));
