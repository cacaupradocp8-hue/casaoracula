
-- Create vitrine_cards table
CREATE TABLE public.vitrine_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  descricao_curta TEXT,
  imagem TEXT,
  link_destino TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  estilo TEXT NOT NULL DEFAULT 'hero_unico' CHECK (estilo IN ('hero_unico', 'card_secundario')),
  visibilidade_role TEXT[] NOT NULL DEFAULT '{visitante}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vitrine_cards ENABLE ROW LEVEL SECURITY;

-- Public read for active cards
CREATE POLICY "Anyone can read active vitrine cards"
ON public.vitrine_cards FOR SELECT
USING (ativo = true);

-- Admin full access
CREATE POLICY "Admins full access vitrine cards"
ON public.vitrine_cards FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_vitrine_cards_updated_at
BEFORE UPDATE ON public.vitrine_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
