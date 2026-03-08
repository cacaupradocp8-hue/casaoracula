
CREATE TABLE public.mapa_sombra (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  therapist_id UUID NOT NULL,
  irritacoes JSONB NOT NULL DEFAULT '[]'::jsonb,
  admiracoes JSONB NOT NULL DEFAULT '[]'::jsonb,
  sintese_sombra_negativa TEXT,
  sintese_sombra_dourada TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mapa_sombra ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own shadow maps"
  ON public.mapa_sombra
  FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER update_mapa_sombra_updated_at
  BEFORE UPDATE ON public.mapa_sombra
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
