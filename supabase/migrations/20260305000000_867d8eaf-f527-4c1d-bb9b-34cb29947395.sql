
-- Enums for pattern flags
CREATE TYPE public.pattern_scope_type AS ENUM ('client', 'group');
CREATE TYPE public.pattern_flag_type AS ENUM ('district_recurrence', 'door_recurrence', 'tower_recurrence', 'loop_detected', 'abalo_persistente', 'integration_signal', 'conduction_risk');
CREATE TYPE public.pattern_severity AS ENUM ('low', 'medium', 'high');

-- symbolic_insights table
CREATE TABLE public.symbolic_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type public.pattern_scope_type NOT NULL DEFAULT 'client',
  scope_id uuid NOT NULL,
  generated_for_range text NOT NULL,
  insights_json jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.symbolic_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users manage their symbolic insights"
  ON public.symbolic_insights FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.clientes c WHERE c.id = scope_id AND c.terapeuta_id = auth.uid()
  ))
  WITH CHECK (public.is_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.clientes c WHERE c.id = scope_id AND c.terapeuta_id = auth.uid()
  ));

-- pattern_flags table
CREATE TABLE public.pattern_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type public.pattern_scope_type NOT NULL DEFAULT 'client',
  scope_id uuid NOT NULL,
  flag_type public.pattern_flag_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  severity public.pattern_severity NOT NULL DEFAULT 'medium',
  supporting_data_json jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pattern_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users manage their pattern flags"
  ON public.pattern_flags FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.clientes c WHERE c.id = scope_id AND c.terapeuta_id = auth.uid()
  ))
  WITH CHECK (public.is_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.clientes c WHERE c.id = scope_id AND c.terapeuta_id = auth.uid()
  ));
