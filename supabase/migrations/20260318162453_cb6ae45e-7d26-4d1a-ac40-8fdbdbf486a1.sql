
-- Cartographer Engine: stores each Bússola execution context
CREATE TABLE public.cartographer_engine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id),
  therapist_id UUID NOT NULL,
  trigger_type TEXT NOT NULL DEFAULT 'manual',
  fase_jornada TEXT DEFAULT 'inicio',
  modo_sessao TEXT DEFAULT 'oracula',
  distrito_ativo TEXT,
  torre_ativa TEXT,
  porta_ativa TEXT,
  arquetipo_regente_id UUID,
  input_snapshot JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cartographer Recommendations: stores each suggestion
CREATE TABLE public.cartographer_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engine_id UUID NOT NULL REFERENCES public.cartographer_engine(id) ON DELETE CASCADE,
  tool_principal_id UUID REFERENCES public.tools(id),
  tool_complementar_id UUID REFERENCES public.tools(id),
  distrito_sugerido TEXT,
  arquetipo_sugerido TEXT,
  pergunta_sugerida TEXT,
  ritual_sugerido TEXT,
  confianca INTEGER DEFAULT 70,
  aceita BOOLEAN,
  ferramenta_escolhida_id UUID REFERENCES public.tools(id),
  observacao_feedback TEXT,
  respondido_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cartographer_engine ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartographer_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS: therapist can manage own engine records, admin all
CREATE POLICY "therapist_own_engine" ON public.cartographer_engine
  FOR ALL TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "therapist_own_recommendations" ON public.cartographer_recommendations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cartographer_engine ce
      WHERE ce.id = cartographer_recommendations.engine_id
      AND (ce.therapist_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cartographer_engine ce
      WHERE ce.id = cartographer_recommendations.engine_id
      AND (ce.therapist_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

-- Index for fast lookups
CREATE INDEX idx_cart_engine_client ON public.cartographer_engine(client_id);
CREATE INDEX idx_cart_reco_engine ON public.cartographer_recommendations(engine_id);
