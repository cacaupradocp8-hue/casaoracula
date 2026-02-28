-- Create a progress table for clube_livro_escutas audio tracking
CREATE TABLE IF NOT EXISTS public.clube_livro_escuta_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  escuta_id UUID NOT NULL REFERENCES public.clube_livro_escutas(id) ON DELETE CASCADE,
  posicao_segundos INTEGER NOT NULL DEFAULT 0,
  concluido BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, escuta_id)
);

-- Enable RLS
ALTER TABLE public.clube_livro_escuta_progress ENABLE ROW LEVEL SECURITY;

-- Users can read their own progress
CREATE POLICY "Users can view own escuta progress"
  ON public.clube_livro_escuta_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own escuta progress"
  ON public.clube_livro_escuta_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own escuta progress"
  ON public.clube_livro_escuta_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin full access
CREATE POLICY "Admin full access escuta progress"
  ON public.clube_livro_escuta_progress
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Indexes
CREATE INDEX idx_escuta_progress_user ON public.clube_livro_escuta_progress(user_id);
CREATE INDEX idx_escuta_progress_escuta ON public.clube_livro_escuta_progress(escuta_id);
