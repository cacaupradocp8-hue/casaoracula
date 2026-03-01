
-- Tour pela Obra: orientação simbólica antes dos Portais
CREATE TABLE public.book_tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  jornada TEXT NOT NULL DEFAULT 'Heroína',
  onde_entra_jornada TEXT,
  habilidade_simbolica TEXT,
  o_que_nao_fazer TEXT,
  como_atravessar TEXT,
  quando_encerrar TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(book_id)
);

ALTER TABLE public.book_tours ENABLE ROW LEVEL SECURITY;

-- Anyone can read active tours
CREATE POLICY "Tours are readable by authenticated users"
  ON public.book_tours FOR SELECT
  USING (ativo = true OR public.is_admin(auth.uid()));

-- Only admins can manage
CREATE POLICY "Admins can manage tours"
  ON public.book_tours FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_book_tours_updated_at
  BEFORE UPDATE ON public.book_tours
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
