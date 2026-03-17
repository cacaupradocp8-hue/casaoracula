
CREATE TABLE IF NOT EXISTS public.archetype_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archetype_id UUID NOT NULL REFERENCES public.founding_archetypes(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  tipo TEXT DEFAULT 'principal',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(archetype_id, tool_id)
);

ALTER TABLE public.archetype_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read archetype_tools"
  ON public.archetype_tools FOR SELECT
  USING (true);

CREATE POLICY "Admin manage archetype_tools"
  ON public.archetype_tools FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
