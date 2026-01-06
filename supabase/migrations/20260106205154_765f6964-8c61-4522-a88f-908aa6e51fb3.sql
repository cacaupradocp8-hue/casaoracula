-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  portal_id UUID REFERENCES public.conteudo_travessias(id) ON DELETE SET NULL,
  sala_id UUID REFERENCES public.salas(id) ON DELETE SET NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE public.quiz_perguntas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz options table
CREATE TABLE public.quiz_opcoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pergunta_id UUID NOT NULL REFERENCES public.quiz_perguntas(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  valor_pontuacao INTEGER NOT NULL DEFAULT 0,
  categoria TEXT DEFAULT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz results definitions table
CREATE TABLE public.quiz_resultados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  titulo_simbolico TEXT NOT NULL,
  texto_interpretativo TEXT NOT NULL,
  pontuacao_minima INTEGER DEFAULT NULL,
  pontuacao_maxima INTEGER DEFAULT NULL,
  categoria TEXT DEFAULT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user quiz responses table
CREATE TABLE public.quiz_respostas_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  resultado_id UUID REFERENCES public.quiz_resultados(id) ON DELETE SET NULL,
  respostas JSONB DEFAULT '[]',
  pontuacao_total INTEGER DEFAULT 0,
  categoria_resultado TEXT DEFAULT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_quiz_perguntas_quiz_id ON public.quiz_perguntas(quiz_id);
CREATE INDEX idx_quiz_opcoes_pergunta_id ON public.quiz_opcoes(pergunta_id);
CREATE INDEX idx_quiz_resultados_quiz_id ON public.quiz_resultados(quiz_id);
CREATE INDEX idx_quiz_respostas_user_id ON public.quiz_respostas_usuario(user_id);
CREATE INDEX idx_quiz_respostas_quiz_id ON public.quiz_respostas_usuario(quiz_id);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_opcoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_resultados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_respostas_usuario ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
CREATE POLICY "Admins can manage quizzes"
  ON public.quizzes FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

CREATE POLICY "Anyone can view active quizzes"
  ON public.quizzes FOR SELECT
  USING (ativo = true);

-- RLS Policies for quiz_perguntas
CREATE POLICY "Admins can manage quiz questions"
  ON public.quiz_perguntas FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

CREATE POLICY "Anyone can view active questions"
  ON public.quiz_perguntas FOR SELECT
  USING (ativo = true);

-- RLS Policies for quiz_opcoes
CREATE POLICY "Admins can manage quiz options"
  ON public.quiz_opcoes FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

CREATE POLICY "Anyone can view options"
  ON public.quiz_opcoes FOR SELECT
  USING (true);

-- RLS Policies for quiz_resultados
CREATE POLICY "Admins can manage quiz results"
  ON public.quiz_resultados FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

CREATE POLICY "Anyone can view results"
  ON public.quiz_resultados FOR SELECT
  USING (true);

-- RLS Policies for quiz_respostas_usuario
CREATE POLICY "Admins can view all user responses"
  ON public.quiz_respostas_usuario FOR SELECT
  USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

CREATE POLICY "Users can manage own responses"
  ON public.quiz_respostas_usuario FOR ALL
  USING (auth.uid() = user_id);

-- Update trigger for quizzes
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for quiz_perguntas
CREATE TRIGGER update_quiz_perguntas_updated_at
  BEFORE UPDATE ON public.quiz_perguntas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for quiz_resultados
CREATE TRIGGER update_quiz_resultados_updated_at
  BEFORE UPDATE ON public.quiz_resultados
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();