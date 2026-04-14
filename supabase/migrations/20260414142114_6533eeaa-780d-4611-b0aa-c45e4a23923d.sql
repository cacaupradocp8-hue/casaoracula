
-- Tabela de estado unificado da CidaDELA
CREATE TABLE public.user_cidadela_estado (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  voz TEXT,
  distrito_atual TEXT,
  distritos_ativados TEXT[] DEFAULT '{}',
  intensidade_por_distrito JSONB DEFAULT '{}',
  competencias JSONB DEFAULT '{}',
  historico_travessias JSONB DEFAULT '[]',
  ultimo_movimento TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_cidadela_estado ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own estado"
  ON public.user_cidadela_estado FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own estado"
  ON public.user_cidadela_estado FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own estado"
  ON public.user_cidadela_estado FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all estados"
  ON public.user_cidadela_estado FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_user_cidadela_estado_updated_at
  BEFORE UPDATE ON public.user_cidadela_estado
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar distrito aos casos de treinamento
ALTER TABLE public.co_sim_cases ADD COLUMN IF NOT EXISTS distrito TEXT;
