
CREATE TABLE public.espelho_conto_sugestoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria TEXT NOT NULL,
  pergunta TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.espelho_conto_sugestoes TO authenticated;
GRANT ALL ON public.espelho_conto_sugestoes TO service_role;

ALTER TABLE public.espelho_conto_sugestoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read active sugestoes"
  ON public.espelho_conto_sugestoes
  FOR SELECT
  TO authenticated
  USING (ativa = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins manage sugestoes"
  ON public.espelho_conto_sugestoes
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER trg_espelho_conto_sugestoes_updated_at
  BEFORE UPDATE ON public.espelho_conto_sugestoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_espelho_conto_sugestoes_cat_ordem
  ON public.espelho_conto_sugestoes (categoria, ordem);
