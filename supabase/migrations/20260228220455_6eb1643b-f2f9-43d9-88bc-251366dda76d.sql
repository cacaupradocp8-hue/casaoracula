
-- Template fixo do Lab 80/20 por estação
CREATE TABLE public.season_labs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID NOT NULL REFERENCES public.oracular_seasons(id) ON DELETE CASCADE,
  nucleo_vivo TEXT,
  tensao_central TEXT,
  essencia_transformadora TEXT,
  traducao_aula TEXT,
  traducao_sessao TEXT,
  traducao_circulo TEXT,
  pergunta_aplicacao_1 TEXT,
  pergunta_aplicacao_2 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(season_id)
);

ALTER TABLE public.season_labs ENABLE ROW LEVEL SECURITY;

-- Todos podem ler (filtragem de acesso no frontend)
CREATE POLICY "Anyone can read season_labs"
  ON public.season_labs FOR SELECT
  USING (true);

-- Apenas admin pode modificar
CREATE POLICY "Admin can manage season_labs"
  ON public.season_labs FOR ALL
  USING (public.is_admin(auth.uid()));

-- Registro de conclusão do lab por usuária
CREATE TABLE public.lab_8020_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  season_id UUID NOT NULL REFERENCES public.oracular_seasons(id) ON DELETE CASCADE,
  resposta_1 TEXT,
  resposta_2 TEXT,
  insight_livre TEXT,
  concluido BOOLEAN NOT NULL DEFAULT false,
  concluido_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, season_id)
);

ALTER TABLE public.lab_8020_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own lab progress"
  ON public.lab_8020_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab progress"
  ON public.lab_8020_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lab progress"
  ON public.lab_8020_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can read all lab progress"
  ON public.lab_8020_progress FOR SELECT
  USING (public.is_admin(auth.uid()));
