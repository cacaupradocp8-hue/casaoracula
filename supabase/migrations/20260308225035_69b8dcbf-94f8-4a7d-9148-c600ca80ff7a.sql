
-- Forum posts per course module
CREATE TABLE public.course_module_forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.course_module_forum_posts(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  is_instructor_reply BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_forum_posts_module ON public.course_module_forum_posts(module_id);
CREATE INDEX idx_forum_posts_parent ON public.course_module_forum_posts(parent_id);

ALTER TABLE public.course_module_forum_posts ENABLE ROW LEVEL SECURITY;

-- Enrolled users + admin can read forum posts
CREATE POLICY "Users with course access can read forum posts"
  ON public.course_module_forum_posts FOR SELECT
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.course_modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id
        AND public.has_course_access(auth.uid(), c.id)
    )
  );

-- Enrolled users can create posts
CREATE POLICY "Enrolled users can create forum posts"
  ON public.course_module_forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      public.is_admin(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.course_modules m
        JOIN public.courses c ON c.id = m.course_id
        WHERE m.id = module_id
          AND public.has_course_access(auth.uid(), c.id)
      )
    )
  );

-- Users can update own posts
CREATE POLICY "Users can update own forum posts"
  ON public.course_module_forum_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Users can delete own posts, admin can delete any
CREATE POLICY "Users can delete own forum posts"
  ON public.course_module_forum_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Work submissions for assessments
CREATE TABLE public.course_work_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  feedback TEXT,
  nota NUMERIC,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.course_work_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own submissions"
  ON public.course_work_submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own submissions"
  ON public.course_work_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can update submissions"
  ON public.course_work_submissions FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);
