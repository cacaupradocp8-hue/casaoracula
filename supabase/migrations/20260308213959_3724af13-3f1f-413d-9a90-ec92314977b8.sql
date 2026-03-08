
CREATE TABLE public.imaginacao_ativa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  ponto_partida_tipo TEXT,
  ponto_partida_detalhes TEXT,
  descricao_figura TEXT,
  dialogo_registros JSONB DEFAULT '[]',
  negociacao_registro TEXT,
  registro_pos_sessao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.imaginacao_ativa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own client imaginacao"
  ON public.imaginacao_ativa FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER set_imaginacao_ativa_updated_at
  BEFORE UPDATE ON public.imaginacao_ativa
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
