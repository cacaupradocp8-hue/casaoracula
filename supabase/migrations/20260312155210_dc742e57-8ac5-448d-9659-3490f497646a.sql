
-- Table to track journey milestone events for each user
CREATE TABLE public.jornada_habitante_eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evento TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, evento)
);

-- Enable RLS
ALTER TABLE public.jornada_habitante_eventos ENABLE ROW LEVEL SECURITY;

-- Users can read their own events
CREATE POLICY "Users read own events"
  ON public.jornada_habitante_eventos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Users can insert their own events
CREATE POLICY "Users insert own events"
  ON public.jornada_habitante_eventos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admin can do everything
CREATE POLICY "Admin full access"
  ON public.jornada_habitante_eventos FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));
