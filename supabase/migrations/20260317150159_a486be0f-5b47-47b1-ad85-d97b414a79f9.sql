
CREATE TABLE IF NOT EXISTS public.client_archetype_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  arquitipo_regente_id UUID REFERENCES public.founding_archetypes(id) ON DELETE SET NULL,
  arquitipo_sombra_id UUID REFERENCES public.founding_archetypes(id) ON DELETE SET NULL,
  arquitipo_evolucao_id UUID REFERENCES public.founding_archetypes(id) ON DELETE SET NULL,
  fonte TEXT DEFAULT 'diagnostico',
  observacoes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id)
);

ALTER TABLE public.client_archetype_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read client_archetype_state"
  ON public.client_archetype_state FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin manage client_archetype_state"
  ON public.client_archetype_state FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
