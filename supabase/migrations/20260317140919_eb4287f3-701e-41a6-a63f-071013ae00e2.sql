
CREATE TABLE IF NOT EXISTS public.city_districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  funcao_simbolica TEXT,
  quando_ativo TEXT,
  cor_principal TEXT,
  icone TEXT,
  ordem INTEGER DEFAULT 1,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_city_districts_slug ON public.city_districts(slug);

ALTER TABLE public.city_districts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "city_districts_read" ON public.city_districts FOR SELECT USING (true);
CREATE POLICY "city_districts_admin_write" ON public.city_districts FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
