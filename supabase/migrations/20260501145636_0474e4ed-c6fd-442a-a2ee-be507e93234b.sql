
CREATE TABLE public.co_laboratorio_casos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  modo_entrada TEXT NOT NULL DEFAULT 'texto_livre',
  caso_texto TEXT,
  fala_cliente TEXT,
  duvida_terapeuta TEXT,
  ja_tentou TEXT,
  cliente_id UUID,
  analise_simbolica TEXT,
  perguntas_sugeridas JSONB DEFAULT '[]'::jsonb,
  riscos_eticos TEXT,
  simulacao_cliente TEXT,
  ferramenta_sugerida TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT modo_entrada_check CHECK (modo_entrada IN ('texto_livre', 'formulario', 'cliente_vinculado')),
  CONSTRAINT status_check CHECK (status IN ('rascunho', 'analisado', 'arquivado'))
);

ALTER TABLE public.co_laboratorio_casos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Terapeuta vê seus próprios casos"
ON public.co_laboratorio_casos FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Terapeuta cria seus próprios casos"
ON public.co_laboratorio_casos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Terapeuta atualiza seus próprios casos"
ON public.co_laboratorio_casos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Terapeuta apaga seus próprios casos"
ON public.co_laboratorio_casos FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_co_laboratorio_casos_updated_at
BEFORE UPDATE ON public.co_laboratorio_casos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_co_laboratorio_casos_user_id ON public.co_laboratorio_casos(user_id);
CREATE INDEX idx_co_laboratorio_casos_status ON public.co_laboratorio_casos(status);
