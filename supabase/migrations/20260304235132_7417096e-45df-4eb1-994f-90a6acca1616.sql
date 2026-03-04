
-- Create session_interventions table (usage_count already added in previous migration)
CREATE TABLE IF NOT EXISTS public.session_interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  intervention_id uuid REFERENCES public.interventions(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.session_interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their session interventions"
  ON public.session_interventions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
    OR public.is_admin(auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
    OR public.is_admin(auth.uid())
  );
