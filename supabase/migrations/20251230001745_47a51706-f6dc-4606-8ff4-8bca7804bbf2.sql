
-- Criar tabela de Travessias
CREATE TABLE public.travessias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE CHECK (number >= 1 AND number <= 4),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  closing_ritual TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de Lições
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  travessia_id UUID NOT NULL REFERENCES public.travessias(id) ON DELETE CASCADE,
  order_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(travessia_id, order_number)
);

-- Criar tabela de Exercícios
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  order_number INTEGER NOT NULL DEFAULT 1,
  question TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reflection', 'writing', 'symbolic')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lesson_id, order_number)
);

-- Criar tabela de Itens da Biblioteca
CREATE TABLE public.library_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('conto', 'arquetipo', 'pergunta', 'ritual')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  portal_level_required portal_type NOT NULL DEFAULT 'visitante',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de Progresso do Usuário
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Criar tabela de Favoritos
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  library_item_id UUID NOT NULL REFERENCES public.library_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, library_item_id)
);

-- Criar tabela de Respostas de Exercícios
CREATE TABLE public.exercise_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.travessias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_responses ENABLE ROW LEVEL SECURITY;

-- Políticas para Travessias
CREATE POLICY "Admins can manage travessias"
ON public.travessias
FOR ALL
USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Authenticated users can view travessias"
ON public.travessias
FOR SELECT
TO authenticated
USING (true);

-- Políticas para Lessons
CREATE POLICY "Admins can manage lessons"
ON public.lessons
FOR ALL
USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Authenticated users can view lessons"
ON public.lessons
FOR SELECT
TO authenticated
USING (true);

-- Políticas para Exercises
CREATE POLICY "Admins can manage exercises"
ON public.exercises
FOR ALL
USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Authenticated users can view exercises"
ON public.exercises
FOR SELECT
TO authenticated
USING (true);

-- Políticas para Library Items
CREATE POLICY "Admins can manage library items"
ON public.library_items
FOR ALL
USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can view items based on portal level"
ON public.library_items
FOR SELECT
TO authenticated
USING (
  public.has_portal_access(auth.uid(), portal_level_required)
);

-- Políticas para User Progress
CREATE POLICY "Users can view own progress"
ON public.user_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.user_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
ON public.user_progress
FOR SELECT
USING (public.get_user_portal(auth.uid()) = 'admin');

-- Políticas para User Favorites
CREATE POLICY "Users can manage own favorites"
ON public.user_favorites
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all favorites"
ON public.user_favorites
FOR SELECT
USING (public.get_user_portal(auth.uid()) = 'admin');

-- Políticas para Exercise Responses
CREATE POLICY "Users can manage own responses"
ON public.exercise_responses
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all responses"
ON public.exercise_responses
FOR SELECT
USING (public.get_user_portal(auth.uid()) = 'admin');

-- Triggers para updated_at
CREATE TRIGGER update_travessias_updated_at
BEFORE UPDATE ON public.travessias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_library_items_updated_at
BEFORE UPDATE ON public.library_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exercise_responses_updated_at
BEFORE UPDATE ON public.exercise_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
