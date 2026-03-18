
CREATE TABLE public.cartographer_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  prioridade INTEGER DEFAULT 1,
  distrito TEXT NULL,
  arquetipo TEXT NULL,
  torre TEXT NULL,
  porta TEXT NULL,
  ferramenta_origem_slug TEXT NULL,
  fase_jornada TEXT NULL,
  ferramenta_principal_slug TEXT NOT NULL,
  ferramenta_complementar_slug TEXT NULL,
  pergunta TEXT NULL,
  ritual TEXT NULL,
  confianca_base INTEGER DEFAULT 70,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cartographer_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_manage_rules" ON public.cartographer_rules
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "authenticated_read_active_rules" ON public.cartographer_rules
  FOR SELECT TO authenticated
  USING (ativa = true);

CREATE INDEX idx_cart_rules_priority ON public.cartographer_rules(prioridade DESC);
