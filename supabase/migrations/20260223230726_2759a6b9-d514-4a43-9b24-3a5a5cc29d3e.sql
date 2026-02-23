
-- Track-level progress per user
CREATE TABLE public.clube_audio_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  track_id UUID NOT NULL REFERENCES public.clube_audio_tracks(id) ON DELETE CASCADE,
  posicao_segundos NUMERIC NOT NULL DEFAULT 0,
  concluido BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);

CREATE TRIGGER update_clube_audio_progress_updated_at
  BEFORE UPDATE ON public.clube_audio_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.clube_audio_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own progress
CREATE POLICY "users_own_progress" ON public.clube_audio_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin full access
CREATE POLICY "admin_progress" ON public.clube_audio_progress
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE INDEX idx_audio_progress_user ON public.clube_audio_progress(user_id);
CREATE INDEX idx_audio_progress_track ON public.clube_audio_progress(track_id);
