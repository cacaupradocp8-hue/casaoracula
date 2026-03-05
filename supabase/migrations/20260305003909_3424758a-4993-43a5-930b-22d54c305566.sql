
CREATE TABLE public.archetypal_profile_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  dominant_archetype TEXT,
  shadow_archetype TEXT,
  psychic_movement TEXT,
  evolution_call TEXT,
  clinical_question TEXT,
  source_data_json JSONB DEFAULT '{}'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.archetypal_profile_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own client snapshots"
ON public.archetypal_profile_snapshots
FOR ALL TO authenticated
USING (
  public.is_admin(auth.uid())
  OR client_id IN (SELECT id FROM public.clientes WHERE terapeuta_id = auth.uid())
)
WITH CHECK (
  public.is_admin(auth.uid())
  OR client_id IN (SELECT id FROM public.clientes WHERE terapeuta_id = auth.uid())
);

CREATE INDEX idx_profile_snapshots_client ON public.archetypal_profile_snapshots(client_id);
