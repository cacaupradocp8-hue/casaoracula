
-- Enum for pattern types
CREATE TYPE public.pattern_stat_type AS ENUM ('district', 'tower', 'oracle_card', 'intervention', 'archetype', 'tool');

-- Main stats table
CREATE TABLE public.client_pattern_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  pattern_type public.pattern_stat_type NOT NULL,
  pattern_name TEXT NOT NULL,
  occurrence_count INTEGER NOT NULL DEFAULT 1,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, pattern_type, pattern_name)
);

ALTER TABLE public.client_pattern_stats ENABLE ROW LEVEL SECURITY;

-- RLS: therapist can see their own clients' patterns, admin sees all
CREATE POLICY "Therapists see own client patterns"
  ON public.client_pattern_stats FOR SELECT TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = client_pattern_stats.client_id
        AND c.terapeuta_id = auth.uid()
    )
  );

CREATE POLICY "Therapists insert own client patterns"
  ON public.client_pattern_stats FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = client_pattern_stats.client_id
        AND c.terapeuta_id = auth.uid()
    )
  );

CREATE POLICY "Therapists update own client patterns"
  ON public.client_pattern_stats FOR UPDATE TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = client_pattern_stats.client_id
        AND c.terapeuta_id = auth.uid()
    )
  );

-- Function to upsert a pattern stat
CREATE OR REPLACE FUNCTION public.upsert_pattern_stat(
  _client_id UUID,
  _pattern_type public.pattern_stat_type,
  _pattern_name TEXT
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.client_pattern_stats (client_id, pattern_type, pattern_name, occurrence_count, last_seen_at)
  VALUES (_client_id, _pattern_type, _pattern_name, 1, now())
  ON CONFLICT (client_id, pattern_type, pattern_name)
  DO UPDATE SET
    occurrence_count = client_pattern_stats.occurrence_count + 1,
    last_seen_at = now();
END;
$$;
