-- Create table to track user progress on conteudo_aulas
CREATE TABLE public.user_aula_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  aula_id uuid NOT NULL REFERENCES public.conteudo_aulas(id) ON DELETE CASCADE,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, aula_id)
);

-- Enable RLS
ALTER TABLE public.user_aula_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own progress"
ON public.user_aula_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.user_aula_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
ON public.user_aula_progress
FOR SELECT
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Index for faster queries
CREATE INDEX idx_user_aula_progress_user_id ON public.user_aula_progress(user_id);
CREATE INDEX idx_user_aula_progress_aula_id ON public.user_aula_progress(aula_id);