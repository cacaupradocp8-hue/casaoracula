-- ============================================
-- MEMBERS AREA - COURSES / MODULES / LESSONS
-- ============================================

-- ENUM for course pricing model
CREATE TYPE public.pricing_model AS ENUM ('free', 'one_time', 'subscription');

-- ENUM for content type
CREATE TYPE public.content_type AS ENUM ('text', 'video', 'audio', 'file', 'mixed');

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  descricao TEXT NOT NULL DEFAULT '',
  descricao_publica TEXT, -- Public description for marketplace
  capa_url TEXT,
  video_preview_url TEXT, -- Preview video for sales page
  
  -- Pricing
  pricing_model pricing_model NOT NULL DEFAULT 'free',
  preco DECIMAL(10,2),
  preco_promocional DECIMAL(10,2),
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  
  -- Access control
  portal_minimo portal_type NOT NULL DEFAULT 'visitante',
  requer_matricula BOOLEAN NOT NULL DEFAULT false,
  
  -- Status
  publicado BOOLEAN NOT NULL DEFAULT false,
  destaque BOOLEAN NOT NULL DEFAULT false, -- Featured course
  ordem INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  duracao_estimada TEXT, -- e.g., "8 horas", "12 semanas"
  nivel TEXT, -- e.g., "Iniciante", "Intermediário", "Avançado"
  tags TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- MODULES TABLE (within courses)
-- ============================================
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  
  ordem INTEGER NOT NULL DEFAULT 0,
  publicado BOOLEAN NOT NULL DEFAULT true,
  
  -- Drip content support
  disponivel_em DATE, -- NULL = immediately available
  dias_apos_matricula INTEGER, -- Alternative: X days after enrollment
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- LESSONS TABLE (within modules)
-- ============================================
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao_curta TEXT DEFAULT '',
  
  -- Content
  content_type content_type NOT NULL DEFAULT 'mixed',
  texto_aula TEXT,
  video_url TEXT,
  audio_url TEXT,
  pdf_url TEXT,
  materiais_url TEXT, -- Additional materials
  
  -- Metadata
  duracao_minutos INTEGER, -- Lesson duration
  ordem INTEGER NOT NULL DEFAULT 0,
  publicado BOOLEAN NOT NULL DEFAULT true,
  is_preview BOOLEAN NOT NULL DEFAULT false, -- Free preview lesson
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- COURSE ENROLLMENTS (one-time purchases or manual)
-- ============================================
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  
  -- Status
  ativo BOOLEAN NOT NULL DEFAULT true,
  
  -- Payment reference
  payment_provider TEXT, -- 'stripe', 'rockty', 'manual'
  payment_id TEXT, -- Stripe payment intent ID or Rockty transaction ID
  
  -- Access dates
  data_inicio TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_fim TIMESTAMPTZ, -- NULL = lifetime access
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, course_id)
);

-- ============================================
-- USER PROGRESS (per lesson)
-- ============================================
CREATE TABLE public.course_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  progress_percent INTEGER DEFAULT 0, -- For video/audio progress
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, lesson_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_courses_publicado ON public.courses(publicado);
CREATE INDEX idx_courses_destaque ON public.courses(destaque);
CREATE INDEX idx_course_modules_course_id ON public.course_modules(course_id);
CREATE INDEX idx_course_lessons_module_id ON public.course_lessons(module_id);
CREATE INDEX idx_course_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX idx_course_lesson_progress_user_id ON public.course_lesson_progress(user_id);
CREATE INDEX idx_course_lesson_progress_lesson_id ON public.course_lesson_progress(lesson_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Check if user has access to a course
CREATE OR REPLACE FUNCTION public.has_course_access(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    -- Admin always has access
    get_user_portal(_user_id) = 'admin'
    OR
    -- Free courses with appropriate portal level
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = _course_id
        AND c.pricing_model = 'free'
        AND c.publicado = true
        AND has_portal_access(_user_id, c.portal_minimo)
    )
    OR
    -- User has active enrollment
    EXISTS (
      SELECT 1 FROM public.course_enrollments e
      WHERE e.user_id = _user_id
        AND e.course_id = _course_id
        AND e.ativo = true
        AND (e.data_fim IS NULL OR e.data_fim > now())
    )
    OR
    -- Subscription-based course with active subscription + enrollment/matricula
    EXISTS (
      SELECT 1 FROM public.courses c
      JOIN public.subscriptions s ON s.user_id = _user_id
      WHERE c.id = _course_id
        AND c.pricing_model = 'subscription'
        AND c.publicado = true
        AND s.status IN ('active', 'past_due')
        AND has_portal_access(_user_id, c.portal_minimo)
    )
$$;

-- Check if lesson is available (drip content)
CREATE OR REPLACE FUNCTION public.is_lesson_available(_user_id UUID, _lesson_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    -- Admin always has access
    get_user_portal(_user_id) = 'admin'
    OR
    EXISTS (
      SELECT 1 
      FROM public.course_lessons l
      JOIN public.course_modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      LEFT JOIN public.course_enrollments e ON e.course_id = c.id AND e.user_id = _user_id
      WHERE l.id = _lesson_id
        AND l.publicado = true
        AND m.publicado = true
        AND c.publicado = true
        AND has_course_access(_user_id, c.id)
        AND (
          -- No drip restrictions
          (m.disponivel_em IS NULL AND m.dias_apos_matricula IS NULL)
          -- Date-based drip
          OR (m.disponivel_em IS NOT NULL AND m.disponivel_em <= CURRENT_DATE)
          -- Days after enrollment drip
          OR (m.dias_apos_matricula IS NOT NULL AND e.data_inicio IS NOT NULL 
              AND (e.data_inicio + (m.dias_apos_matricula || ' days')::INTERVAL) <= now())
        )
    )
$$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lesson_progress ENABLE ROW LEVEL SECURITY;

-- COURSES POLICIES
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (publicado = true OR get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

-- MODULES POLICIES
CREATE POLICY "Anyone can view published modules of published courses"
  ON public.course_modules FOR SELECT
  USING (
    publicado = true 
    AND EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.publicado = true)
    OR get_user_portal(auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can manage modules"
  ON public.course_modules FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

-- LESSONS POLICIES
CREATE POLICY "Anyone can view published lessons"
  ON public.course_lessons FOR SELECT
  USING (
    publicado = true
    AND EXISTS (
      SELECT 1 FROM public.course_modules m 
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id AND m.publicado = true AND c.publicado = true
    )
    OR get_user_portal(auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can manage lessons"
  ON public.course_lessons FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

-- ENROLLMENTS POLICIES
CREATE POLICY "Users can view own enrollments"
  ON public.course_enrollments FOR SELECT
  USING (auth.uid() = user_id OR get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Admins can manage all enrollments"
  ON public.course_enrollments FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Service role can manage enrollments"
  ON public.course_enrollments FOR ALL
  USING (auth.role() = 'service_role');

-- PROGRESS POLICIES
CREATE POLICY "Users can manage own progress"
  ON public.course_lesson_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON public.course_lesson_progress FOR SELECT
  USING (get_user_portal(auth.uid()) = 'admin');

-- ============================================
-- TRIGGERS for updated_at
-- ============================================
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON public.course_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at
  BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at
  BEFORE UPDATE ON public.course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_lesson_progress_updated_at
  BEFORE UPDATE ON public.course_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();