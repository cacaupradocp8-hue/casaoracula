
-- Add missing columns to existing oracle_cards if needed
ALTER TABLE public.oracle_cards ADD COLUMN IF NOT EXISTS keyword TEXT;
ALTER TABLE public.oracle_cards ADD COLUMN IF NOT EXISTS base_question TEXT;
ALTER TABLE public.oracle_cards ADD COLUMN IF NOT EXISTS suggested_tool_id UUID REFERENCES public.tools(id);
ALTER TABLE public.oracle_cards ADD COLUMN IF NOT EXISTS suggested_intervention_id UUID;
ALTER TABLE public.oracle_cards ADD COLUMN IF NOT EXISTS color_hex TEXT;
ALTER TABLE public.oracle_cards ADD COLUMN IF NOT EXISTS ordem INTEGER DEFAULT 0;

-- Create oracle_usage_stats if not exists
CREATE TABLE IF NOT EXISTS public.oracle_usage_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  oracle_card_id UUID NOT NULL REFERENCES public.oracle_cards(id) ON DELETE CASCADE,
  count INTEGER NOT NULL DEFAULT 1,
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, oracle_card_id)
);

-- Add oracle_card_id to sessions
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS oracle_card_id UUID REFERENCES public.oracle_cards(id);

-- RLS for usage stats
ALTER TABLE public.oracle_usage_stats ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'oracle_usage_stats' AND policyname = 'Read own client oracle stats') THEN
    CREATE POLICY "Read own client oracle stats" ON public.oracle_usage_stats FOR SELECT TO authenticated
      USING (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()) OR public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'oracle_usage_stats' AND policyname = 'Insert own client oracle stats') THEN
    CREATE POLICY "Insert own client oracle stats" ON public.oracle_usage_stats FOR INSERT TO authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()) OR public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'oracle_usage_stats' AND policyname = 'Update own client oracle stats') THEN
    CREATE POLICY "Update own client oracle stats" ON public.oracle_usage_stats FOR UPDATE TO authenticated
      USING (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()) OR public.is_admin(auth.uid()));
  END IF;
END $$;
