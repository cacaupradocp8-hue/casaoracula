-- Create table for SYNTHEIA creations/library
CREATE TABLE public.syntheia_creations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('sessao_individual', 'experiencia_grupo', 'ritual', 'produto_programa', 'aula_conteudo')),
  publico_alvo TEXT NOT NULL CHECK (publico_alvo IN ('mulher_individual', 'grupo_mulheres', 'publico_profissional')),
  momento_jornada TEXT NOT NULL CHECK (momento_jornada IN ('inicio', 'crise_transicao', 'integracao', 'fechamento')),
  tempo_disponivel TEXT NOT NULL CHECK (tempo_disponivel IN ('30min', '50min', '90min', 'jornada_multipla')),
  tema_principal TEXT NOT NULL,
  chave_simbolica TEXT,
  intencao_terapeutica TEXT,
  estrutura_pratica TEXT,
  suporte_linguagem TEXT,
  fechamento_integracao TEXT,
  tags TEXT[] DEFAULT '{}',
  titulo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.syntheia_creations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own creations
CREATE POLICY "Users can view their own syntheia creations"
ON public.syntheia_creations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own creations
CREATE POLICY "Users can create their own syntheia creations"
ON public.syntheia_creations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own creations
CREATE POLICY "Users can update their own syntheia creations"
ON public.syntheia_creations
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own creations
CREATE POLICY "Users can delete their own syntheia creations"
ON public.syntheia_creations
FOR DELETE
USING (auth.uid() = user_id);

-- Admin bypass
CREATE POLICY "Admin full access to syntheia creations"
ON public.syntheia_creations
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_syntheia_creations_updated_at
BEFORE UPDATE ON public.syntheia_creations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();