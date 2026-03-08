
CREATE TABLE public.escrita_nao_censurada (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  conteudo_escrita TEXT,
  prompt_utilizado TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.escrita_nao_censurada ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own client escritas"
  ON public.escrita_nao_censurada FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER set_escrita_nao_censurada_updated_at
  BEFORE UPDATE ON public.escrita_nao_censurada
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
