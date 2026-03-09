
CREATE TABLE public.relacionamentos_espelho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  relacionamentos_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  qualidades_admiradas JSONB NOT NULL DEFAULT '{}'::jsonb,
  qualidades_irritantes JSONB NOT NULL DEFAULT '{}'::jsonb,
  projecoes_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  padroes_recorrentes TEXT,
  padrao_central TEXT,
  reflexao_final TEXT,
  sintese_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.relacionamentos_espelho ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own records"
  ON public.relacionamentos_espelho
  FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));
