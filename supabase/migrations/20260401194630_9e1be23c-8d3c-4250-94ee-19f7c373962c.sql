
CREATE TABLE public.co_orientacao_sugestoes_ia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  terapeuta_id UUID NOT NULL,
  sugestao_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  aceito_json JSONB DEFAULT NULL,
  editado BOOLEAN NOT NULL DEFAULT false,
  ignorado BOOLEAN NOT NULL DEFAULT false,
  orientacao_id UUID REFERENCES public.co_orientacoes(id) ON DELETE SET NULL,
  justificativa_clinica TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.co_orientacao_sugestoes_ia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist can view own suggestions"
ON public.co_orientacao_sugestoes_ia FOR SELECT
TO authenticated
USING (terapeuta_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Therapist can create suggestions"
ON public.co_orientacao_sugestoes_ia FOR INSERT
TO authenticated
WITH CHECK (terapeuta_id = auth.uid());

CREATE POLICY "Therapist can update own suggestions"
ON public.co_orientacao_sugestoes_ia FOR UPDATE
TO authenticated
USING (terapeuta_id = auth.uid());

CREATE TRIGGER update_co_orientacao_sugestoes_ia_updated_at
BEFORE UPDATE ON public.co_orientacao_sugestoes_ia
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_co_orientacao_sugestoes_ia_cliente ON public.co_orientacao_sugestoes_ia(cliente_id);
CREATE INDEX idx_co_orientacao_sugestoes_ia_terapeuta ON public.co_orientacao_sugestoes_ia(terapeuta_id);
