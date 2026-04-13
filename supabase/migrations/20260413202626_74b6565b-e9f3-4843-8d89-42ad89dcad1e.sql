
CREATE TABLE public.heroina_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('reflexao', 'alerta', 'movimento')),
  texto TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.heroina_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active insights"
ON public.heroina_insights FOR SELECT TO authenticated
USING (ativo = true);

CREATE POLICY "Admin can manage insights"
ON public.heroina_insights FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
