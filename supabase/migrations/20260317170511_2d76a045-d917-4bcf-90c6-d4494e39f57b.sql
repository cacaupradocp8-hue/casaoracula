CREATE TABLE public.oracle_spread_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spread_id UUID NOT NULL REFERENCES public.oracle_spreads(id) ON DELETE CASCADE,
  posicao INTEGER NOT NULL,
  nome TEXT NOT NULL,
  pergunta TEXT NULL,
  descricao TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_spread_positions_spread ON public.oracle_spread_positions(spread_id);

ALTER TABLE public.oracle_spread_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read spread positions"
  ON public.oracle_spread_positions FOR SELECT
  USING (true);

CREATE POLICY "Admin full access spread positions"
  ON public.oracle_spread_positions FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));