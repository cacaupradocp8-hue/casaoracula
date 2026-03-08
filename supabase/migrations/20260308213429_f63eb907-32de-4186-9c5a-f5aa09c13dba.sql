
CREATE TABLE public.diagnostico_ego (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  respostas_inflacao BOOLEAN[] DEFAULT '{}',
  respostas_deflacao BOOLEAN[] DEFAULT '{}',
  contagem_inflacao INTEGER DEFAULT 0,
  contagem_deflacao INTEGER DEFAULT 0,
  pergunta_integracao_resposta TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnostico_ego ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own client diagnosticos"
  ON public.diagnostico_ego FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER set_diagnostico_ego_updated_at
  BEFORE UPDATE ON public.diagnostico_ego
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
