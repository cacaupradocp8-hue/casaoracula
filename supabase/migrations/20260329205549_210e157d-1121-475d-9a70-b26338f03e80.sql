
-- Therapist adaptive profile
CREATE TABLE public.co_therapist_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estilo_conducao TEXT DEFAULT 'exploratório',
  linguagem TEXT DEFAULT 'simbólica',
  nivel_profundidade TEXT DEFAULT 'médio',
  padrao_decisao TEXT DEFAULT 'intuitivo',
  ferramentas_preferidas TEXT[] DEFAULT '{}',
  ferramentas_evitadas TEXT[] DEFAULT '{}',
  distritos_frequentes TEXT[] DEFAULT '{}',
  tendencias_json JSONB DEFAULT '{}',
  pontos_fortes TEXT[] DEFAULT '{}',
  pontos_cegos TEXT[] DEFAULT '{}',
  total_sessoes INTEGER DEFAULT 0,
  total_consultas_mentora INTEGER DEFAULT 0,
  ultima_analise TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Mentora feedback/tracking per session
CREATE TABLE public.co_mentora_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,
  cliente_id UUID,
  sugestao_exibida TEXT NOT NULL,
  sugestao_utilizada BOOLEAN DEFAULT false,
  ferramenta_sugerida TEXT,
  ferramenta_escolhida TEXT,
  tempo_uso_segundos INTEGER,
  feedback_tipo TEXT DEFAULT 'ignorada',
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Post-session AI feedback suggestions
CREATE TABLE public.co_mentora_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'sugestao',
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  baseado_em JSONB DEFAULT '{}',
  lido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.co_therapist_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_mentora_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_mentora_insights ENABLE ROW LEVEL SECURITY;

-- Therapist profile: own data or admin
CREATE POLICY "Users can view own profile" ON public.co_therapist_profile
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own profile" ON public.co_therapist_profile
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.co_therapist_profile
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Mentora feedback: own data or admin
CREATE POLICY "Users can view own feedback" ON public.co_mentora_feedback
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own feedback" ON public.co_mentora_feedback
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Mentora insights: own data or admin
CREATE POLICY "Users can view own insights" ON public.co_mentora_insights
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update own insights" ON public.co_mentora_insights
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Admin full access
CREATE POLICY "Admin full access feedback" ON public.co_mentora_feedback
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin full access insights" ON public.co_mentora_insights
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));
