
-- Enum for travessia level
CREATE TYPE public.co_travessia_nivel AS ENUM ('iniciante', 'intermediario', 'avancado');

-- Travessias table
CREATE TABLE public.co_travessias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  livro_base TEXT,
  nivel co_travessia_nivel NOT NULL DEFAULT 'iniciante',
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.co_travessias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active travessias"
  ON public.co_travessias FOR SELECT TO authenticated
  USING (ativo = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage travessias"
  ON public.co_travessias FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Encontros table
CREATE TABLE public.co_travessia_encontros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  travessia_id UUID NOT NULL REFERENCES public.co_travessias(id) ON DELETE CASCADE,
  numero_encontro INTEGER NOT NULL CHECK (numero_encontro BETWEEN 1 AND 4),
  titulo TEXT NOT NULL,
  abertura_texto TEXT,
  reflexoes TEXT[] DEFAULT '{}',
  ferramenta_sugerida TEXT,
  pratica_texto TEXT,
  integracao_texto TEXT,
  conducao_terapeuta TEXT,
  objetivo_encontro TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (travessia_id, numero_encontro)
);

ALTER TABLE public.co_travessia_encontros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view encontros"
  ON public.co_travessia_encontros FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage encontros"
  ON public.co_travessia_encontros FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Respostas table
CREATE TABLE public.co_travessia_respostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  travessia_id UUID NOT NULL REFERENCES public.co_travessias(id) ON DELETE CASCADE,
  encontro_id UUID NOT NULL REFERENCES public.co_travessia_encontros(id) ON DELETE CASCADE,
  resposta_texto TEXT,
  resposta_integracao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, encontro_id)
);

ALTER TABLE public.co_travessia_respostas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own respostas"
  ON public.co_travessia_respostas FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own respostas"
  ON public.co_travessia_respostas FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own respostas"
  ON public.co_travessia_respostas FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all respostas"
  ON public.co_travessia_respostas FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_co_travessias_updated_at
  BEFORE UPDATE ON public.co_travessias
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_co_travessia_encontros_updated_at
  BEFORE UPDATE ON public.co_travessia_encontros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_co_travessia_respostas_updated_at
  BEFORE UPDATE ON public.co_travessia_respostas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_co_travessia_respostas_user ON public.co_travessia_respostas(user_id);
CREATE INDEX idx_co_travessia_encontros_travessia ON public.co_travessia_encontros(travessia_id);
