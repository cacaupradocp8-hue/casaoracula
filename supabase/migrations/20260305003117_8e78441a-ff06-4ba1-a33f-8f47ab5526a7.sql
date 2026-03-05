
-- Create session_archetypes table
CREATE TABLE public.session_archetypes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  archetype_id UUID NOT NULL REFERENCES public.atlas_arquetipos_femininos(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.session_archetypes ENABLE ROW LEVEL SECURITY;

-- Therapist can manage their own client archetypes
CREATE POLICY "Therapist manages session archetypes"
ON public.session_archetypes
FOR ALL
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR client_id IN (SELECT id FROM public.clientes WHERE terapeuta_id = auth.uid())
)
WITH CHECK (
  public.is_admin(auth.uid())
  OR client_id IN (SELECT id FROM public.clientes WHERE terapeuta_id = auth.uid())
);

-- Index for performance
CREATE INDEX idx_session_archetypes_client ON public.session_archetypes(client_id);
CREATE INDEX idx_session_archetypes_session ON public.session_archetypes(session_id);
