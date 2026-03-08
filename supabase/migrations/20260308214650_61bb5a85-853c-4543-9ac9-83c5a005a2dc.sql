
CREATE TABLE public.corpo_inconsciente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'mapeamento',
  mapeamento_tensoes JSONB DEFAULT '[]',
  diario_corpo_mente JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.corpo_inconsciente ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own client corpo"
  ON public.corpo_inconsciente FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER set_corpo_inconsciente_updated_at
  BEFORE UPDATE ON public.corpo_inconsciente
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
