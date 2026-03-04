
-- CidaDELA Oracle Cards (separate from existing oracle_cards/decks system)
CREATE TABLE public.cidadela_oracle_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  family TEXT NOT NULL,
  district_id UUID REFERENCES public.districts(id),
  keyword TEXT,
  description TEXT,
  base_question TEXT,
  suggested_tool_id UUID REFERENCES public.tools(id),
  suggested_intervention_id UUID,
  color_hex TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CidaDELA Oracle Usage Stats
CREATE TABLE public.cidadela_oracle_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cidadela_oracle_cards(id) ON DELETE CASCADE,
  count INTEGER NOT NULL DEFAULT 1,
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, card_id)
);

-- Add cidadela oracle card to sessions
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS cidadela_card_id UUID REFERENCES public.cidadela_oracle_cards(id);

-- RLS
ALTER TABLE public.cidadela_oracle_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cidadela_oracle_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read cidadela cards" ON public.cidadela_oracle_cards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage cidadela cards" ON public.cidadela_oracle_cards FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Therapist read usage" ON public.cidadela_oracle_usage FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()) OR public.is_admin(auth.uid()));
CREATE POLICY "Therapist insert usage" ON public.cidadela_oracle_usage FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()) OR public.is_admin(auth.uid()));
CREATE POLICY "Therapist update usage" ON public.cidadela_oracle_usage FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()) OR public.is_admin(auth.uid()));
