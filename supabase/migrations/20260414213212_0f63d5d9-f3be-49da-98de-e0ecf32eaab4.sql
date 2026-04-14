
-- Tabela de perfil comportamental derivado da Cartografia
CREATE TABLE public.co_cartografia_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cartografia_id UUID UNIQUE,
  contexto TEXT NOT NULL DEFAULT 'clube',
  medias_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  profile_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  oracula_inicial TEXT,
  intensidade_oracular TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index para busca por usuária
CREATE INDEX idx_co_cartografia_profile_user ON public.co_cartografia_profile (user_id);

-- RLS
ALTER TABLE public.co_cartografia_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profiles"
  ON public.co_cartografia_profile FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own profiles"
  ON public.co_cartografia_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles"
  ON public.co_cartografia_profile FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger updated_at
CREATE TRIGGER set_co_cartografia_profile_updated_at
  BEFORE UPDATE ON public.co_cartografia_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
