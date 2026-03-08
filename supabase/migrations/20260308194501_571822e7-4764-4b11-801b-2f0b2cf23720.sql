
-- Add tipo_curso to courses if not exists
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS tipo_curso text DEFAULT 'formacao';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS requisitos text;

-- Projetos de Mestria for portal specialization
CREATE TABLE public.projetos_mestria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  arquivo_url text,
  status text NOT NULL DEFAULT 'pendente',
  feedback text,
  avaliador_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE public.projetos_mestria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own projetos" ON public.projetos_mestria
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manage all projetos" ON public.projetos_mestria
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
