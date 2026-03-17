
-- Drop old oracle_cards table
DROP TABLE IF EXISTS public.oracle_cards CASCADE;

-- Create new oracle_cards table
CREATE TABLE public.oracle_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  familia TEXT NOT NULL,
  numero INTEGER NOT NULL,
  subtitulo TEXT NULL,
  descricao_curta TEXT NULL,
  mensagem_simbolica TEXT NULL,
  pergunta_oracular TEXT NULL,
  aplicacao_terapeutica TEXT NULL,
  archetype_id UUID NOT NULL REFERENCES public.founding_archetypes(id),
  district_id UUID NULL REFERENCES public.city_districts(id),
  tool_id UUID NULL REFERENCES public.tools(id),
  elemento TEXT NULL,
  cor_principal TEXT NULL,
  icone TEXT NULL,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_oracle_cards_familia ON public.oracle_cards(familia);
CREATE INDEX idx_oracle_cards_archetype ON public.oracle_cards(archetype_id);
CREATE INDEX idx_oracle_cards_district ON public.oracle_cards(district_id);
CREATE INDEX idx_oracle_cards_numero ON public.oracle_cards(numero);

-- Updated_at trigger
CREATE TRIGGER update_oracle_cards_updated_at
  BEFORE UPDATE ON public.oracle_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.oracle_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active oracle cards"
  ON public.oracle_cards FOR SELECT
  USING (ativa = true);

CREATE POLICY "Admin full access oracle cards"
  ON public.oracle_cards FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
