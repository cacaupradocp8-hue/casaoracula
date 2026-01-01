-- Create junction table for salas ↔ ferramentas
CREATE TABLE public.sala_ferramentas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sala_id UUID NOT NULL REFERENCES public.salas(id) ON DELETE CASCADE,
  ferramenta_chave TEXT NOT NULL,
  ferramenta_nome TEXT NOT NULL,
  ferramenta_descricao TEXT DEFAULT '',
  icone TEXT DEFAULT 'wrench',
  rota TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sala_id, ferramenta_chave)
);

-- Enable RLS
ALTER TABLE public.sala_ferramentas ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view active ferramentas" 
ON public.sala_ferramentas 
FOR SELECT 
USING (ativa = true);

CREATE POLICY "Admins can manage all ferramentas" 
ON public.sala_ferramentas 
FOR ALL 
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Trigger for updated_at
CREATE TRIGGER update_sala_ferramentas_updated_at
BEFORE UPDATE ON public.sala_ferramentas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default ferramentas for existing salas
INSERT INTO public.sala_ferramentas (sala_id, ferramenta_chave, ferramenta_nome, ferramenta_descricao, icone, rota, ordem)
SELECT 
  s.id,
  'oraculo_perguntas',
  'Oráculo de Perguntas',
  'Explore perguntas para autoconhecimento',
  'sparkles',
  '/salas/oraculo-perguntas',
  1
FROM public.salas s WHERE s.nivel_minimo = 'NIVEL_0';

INSERT INTO public.sala_ferramentas (sala_id, ferramenta_chave, ferramenta_nome, ferramenta_descricao, icone, rota, ordem)
SELECT 
  s.id,
  'big5',
  'Big 5',
  'Avaliação de personalidade baseada nos 5 grandes fatores',
  'brain',
  '/salas/big5',
  1
FROM public.salas s WHERE s.nivel_minimo = 'NIVEL_1';

INSERT INTO public.sala_ferramentas (sala_id, ferramenta_chave, ferramenta_nome, ferramenta_descricao, icone, rota, ordem)
SELECT 
  s.id,
  'eneagrama',
  'Eneagrama',
  'Descubra seu tipo no Eneagrama',
  'circle',
  '/salas/eneagrama',
  1
FROM public.salas s WHERE s.nivel_minimo = 'NIVEL_2';