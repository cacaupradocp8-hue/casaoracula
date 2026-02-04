-- Tabela para registrar passagens rituais da usuária
CREATE TABLE IF NOT EXISTS public.heroina_ritual_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  ritual_id UUID NOT NULL REFERENCES labirinto_rituais(id) ON DELETE CASCADE,
  reflexao TEXT,
  completado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.heroina_ritual_registros ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own ritual registros"
  ON public.heroina_ritual_registros FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ritual registros"
  ON public.heroina_ritual_registros FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ritual registros"
  ON public.heroina_ritual_registros FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access ritual registros"
  ON public.heroina_ritual_registros FOR ALL
  USING (public.is_admin(auth.uid()));

-- Index for performance
CREATE INDEX idx_heroina_ritual_registros_user ON public.heroina_ritual_registros(user_id);
CREATE INDEX idx_heroina_ritual_registros_ritual ON public.heroina_ritual_registros(ritual_id);