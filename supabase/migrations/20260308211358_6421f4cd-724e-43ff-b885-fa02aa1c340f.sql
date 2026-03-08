
CREATE TABLE public.mapeamento_complexos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  therapist_id UUID NOT NULL,
  registros_gatilhos JSONB NOT NULL DEFAULT '[]'::jsonb,
  padroes_identificados TEXT,
  personagem_ativado TEXT,
  nome_complexo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mapeamento_complexos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own mappings"
  ON public.mapeamento_complexos
  FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER update_mapeamento_complexos_updated_at
  BEFORE UPDATE ON public.mapeamento_complexos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
