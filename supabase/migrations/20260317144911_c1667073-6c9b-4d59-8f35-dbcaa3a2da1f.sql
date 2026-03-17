
CREATE TABLE IF NOT EXISTS public.founding_archetypes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  titulo_simbolico TEXT,
  descricao TEXT,
  essencia TEXT,
  ferida_central TEXT,
  desejo_profundo TEXT,
  estrategia_sobrevivencia TEXT,
  sombra TEXT,
  caminho_evolucao TEXT,
  distrito_principal_id UUID REFERENCES public.city_districts(id) ON DELETE SET NULL,
  elemento TEXT,
  cor_principal TEXT,
  icone TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.founding_archetypes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read founding_archetypes"
  ON public.founding_archetypes FOR SELECT
  USING (true);

CREATE POLICY "Admin manage founding_archetypes"
  ON public.founding_archetypes FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
