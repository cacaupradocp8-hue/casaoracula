
CREATE TABLE public.sonho_estruturado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  imagens_principais TEXT,
  emocao_predominante TEXT,
  sensacao_corporal TEXT,
  amplificacao_pessoal JSONB DEFAULT '[]',
  amplificacao_arquetipica JSONB DEFAULT '[]',
  pergunta_compensar TEXT,
  pergunta_perspectiva TEXT,
  pergunta_conselho TEXT,
  resposta_ao_sonho TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sonho_estruturado ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own client sonhos"
  ON public.sonho_estruturado FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER set_sonho_estruturado_updated_at
  BEFORE UPDATE ON public.sonho_estruturado
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
