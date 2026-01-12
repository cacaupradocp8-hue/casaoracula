-- A) LABORATÓRIO DE LEITURA
CREATE TABLE public.lab_casos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  tema TEXT NOT NULL,
  nivel TEXT NOT NULL DEFAULT 'iniciante',
  contexto TEXT,
  perguntas JSONB DEFAULT '[]'::jsonb,
  hipoteses TEXT,
  ferramentas_sugeridas JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'rascunho',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lab_casos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all lab_casos"
  ON public.lab_casos FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can view published lab_casos"
  ON public.lab_casos FOR SELECT
  USING (status = 'publicado');

CREATE TRIGGER update_lab_casos_updated_at
  BEFORE UPDATE ON public.lab_casos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- B) LIMITES DE CLIENTES POR PORTAL
CREATE TABLE public.plan_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portal portal_type NOT NULL UNIQUE,
  max_clientes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage plan_limits"
  ON public.plan_limits FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view plan_limits"
  ON public.plan_limits FOR SELECT
  USING (true);

-- Insert default limits
INSERT INTO public.plan_limits (portal, max_clientes) VALUES
  ('visitante', 0),
  ('pre_iniciada', 3),
  ('iniciada', -1),
  ('admin', -1);

CREATE TRIGGER update_plan_limits_updated_at
  BEFORE UPDATE ON public.plan_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- C) PROGRESSO DAS ALUNAS
CREATE TABLE public.formacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.formacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage formacoes"
  ON public.formacoes FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view active formacoes"
  ON public.formacoes FOR SELECT
  USING (status = 'ativo');

CREATE TABLE public.formacao_modulos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  formacao_id UUID NOT NULL REFERENCES public.formacoes(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.formacao_modulos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage formacao_modulos"
  ON public.formacao_modulos FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view formacao_modulos"
  ON public.formacao_modulos FOR SELECT
  USING (true);

CREATE TABLE public.progresso_aluna (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  formacao_id UUID NOT NULL REFERENCES public.formacoes(id) ON DELETE CASCADE,
  modulo_id UUID NOT NULL REFERENCES public.formacao_modulos(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'em_progresso',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, modulo_id)
);

ALTER TABLE public.progresso_aluna ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all progresso_aluna"
  ON public.progresso_aluna FOR SELECT
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can manage own progresso"
  ON public.progresso_aluna FOR ALL
  USING (auth.uid() = user_id);

CREATE TRIGGER update_formacoes_updated_at
  BEFORE UPDATE ON public.formacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_formacao_modulos_updated_at
  BEFORE UPDATE ON public.formacao_modulos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progresso_aluna_updated_at
  BEFORE UPDATE ON public.progresso_aluna
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();