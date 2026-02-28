
-- Estações do Ano Oracular
CREATE TABLE public.oracular_seasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_estacao TEXT NOT NULL,
  simbolo TEXT,
  periodo TEXT,
  foco_travessia TEXT,
  aplicacao_profissional TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.oracular_seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estações visíveis para todos autenticados"
  ON public.oracular_seasons FOR SELECT
  USING (true);

CREATE POLICY "Admin pode gerenciar estações"
  ON public.oracular_seasons FOR ALL
  USING (public.is_admin(auth.uid()));

-- Vínculo livro ↔ estação
CREATE TABLE public.season_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID NOT NULL REFERENCES public.oracular_seasons(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'satelite' CHECK (tipo IN ('eixo', 'satelite')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(season_id, book_id)
);

ALTER TABLE public.season_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vínculos visíveis para todos autenticados"
  ON public.season_books FOR SELECT
  USING (true);

CREATE POLICY "Admin pode gerenciar vínculos"
  ON public.season_books FOR ALL
  USING (public.is_admin(auth.uid()));
