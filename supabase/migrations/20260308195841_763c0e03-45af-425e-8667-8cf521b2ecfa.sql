
-- Journey events timeline table
CREATE TABLE public.journey_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo text NOT NULL, -- sessao, distrito_ativado, distrito_integrado, porta_atravessada, labirinto_desvelado, arquetipo_convocado, travessia_concluida
  titulo text NOT NULL,
  descricao text,
  data_evento timestamptz NOT NULL DEFAULT now(),
  metadata_json jsonb DEFAULT '{}',
  session_id uuid REFERENCES public.sessions(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Therapist journey reflections
CREATE TABLE public.journey_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conteudo text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, therapist_id)
);

-- Indexes
CREATE INDEX idx_journey_events_client ON public.journey_events(client_id, data_evento DESC);
CREATE INDEX idx_journey_reflections_client ON public.journey_reflections(client_id, therapist_id);

-- RLS
ALTER TABLE public.journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_reflections ENABLE ROW LEVEL SECURITY;

-- Events: therapist who owns the client or admin
CREATE POLICY "Therapist can manage journey events" ON public.journey_events
  FOR ALL TO authenticated
  USING (
    public.is_admin(auth.uid()) OR
    therapist_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid())
  )
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    therapist_id = auth.uid()
  );

-- Reflections: therapist who owns the client or admin
CREATE POLICY "Therapist can manage journey reflections" ON public.journey_reflections
  FOR ALL TO authenticated
  USING (
    public.is_admin(auth.uid()) OR
    therapist_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid())
  )
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    therapist_id = auth.uid()
  );
