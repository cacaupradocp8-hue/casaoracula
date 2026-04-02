
-- Cases
CREATE TABLE public.co_sim_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  nivel INTEGER NOT NULL DEFAULT 1 CHECK (nivel BETWEEN 1 AND 3),
  tipo TEXT NOT NULL DEFAULT 'misto' CHECK (tipo IN ('individual', 'grupo', 'misto')),
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 0,
  leitura_mentora TEXT,
  ferramenta_sugerida TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_sim_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view active sim cases" ON public.co_sim_cases FOR SELECT TO authenticated USING (ativo = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage sim cases" ON public.co_sim_cases FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Steps
CREATE TABLE public.co_sim_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.co_sim_cases(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL DEFAULT 1,
  situacao_texto TEXT NOT NULL,
  pergunta TEXT NOT NULL DEFAULT 'O que você faz?',
  objetivo_oculto TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_sim_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view sim steps" ON public.co_sim_steps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage sim steps" ON public.co_sim_steps FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Options
CREATE TABLE public.co_sim_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id UUID NOT NULL REFERENCES public.co_sim_steps(id) ON DELETE CASCADE,
  texto_opcao TEXT NOT NULL,
  tipo_resultado TEXT NOT NULL DEFAULT 'erro' CHECK (tipo_resultado IN ('correto', 'erro', 'parcial')),
  feedback_texto TEXT,
  explicacao_simbolica TEXT,
  proximo_step_id UUID REFERENCES public.co_sim_steps(id) ON DELETE SET NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_sim_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view sim options" ON public.co_sim_options FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage sim options" ON public.co_sim_options FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Progress
CREATE TABLE public.co_sim_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  case_id UUID NOT NULL REFERENCES public.co_sim_cases(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES public.co_sim_steps(id) ON DELETE CASCADE,
  escolha_id UUID NOT NULL REFERENCES public.co_sim_options(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_sim_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own sim progress" ON public.co_sim_progress FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Users insert own sim progress" ON public.co_sim_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage sim progress" ON public.co_sim_progress FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Indexes
CREATE INDEX idx_co_sim_steps_case ON public.co_sim_steps(case_id);
CREATE INDEX idx_co_sim_options_step ON public.co_sim_options(step_id);
CREATE INDEX idx_co_sim_progress_user ON public.co_sim_progress(user_id);
CREATE INDEX idx_co_sim_progress_case ON public.co_sim_progress(user_id, case_id);

-- Triggers
CREATE TRIGGER update_co_sim_cases_updated_at BEFORE UPDATE ON public.co_sim_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
