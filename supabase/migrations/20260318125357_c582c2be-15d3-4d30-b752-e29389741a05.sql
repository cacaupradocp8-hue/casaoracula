
-- Create custom_oracles table first (referenced by FK)
CREATE TABLE IF NOT EXISTS public.custom_oracles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descricao TEXT NULL,
  created_by UUID NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  ordem INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.custom_oracles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access on custom_oracles"
ON public.custom_oracles FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Published custom_oracles readable by authenticated"
ON public.custom_oracles FOR SELECT TO authenticated
USING (status = 'published');

-- Create custom_oracle_cards table
CREATE TABLE IF NOT EXISTS public.custom_oracle_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_oracle_id UUID NOT NULL REFERENCES public.custom_oracles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL,
  mensagem TEXT NULL,
  pergunta TEXT NULL,
  aplicacao TEXT NULL,
  ordem INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.custom_oracle_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access on custom_oracle_cards"
ON public.custom_oracle_cards FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Published oracle cards readable by authenticated"
ON public.custom_oracle_cards FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.custom_oracles co
  WHERE co.id = custom_oracle_cards.custom_oracle_id
  AND co.status = 'published'
));
