
-- =============================================
-- STUDENT LEARNING EVENTS (lightweight tracking)
-- =============================================
CREATE TABLE public.student_learning_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  context_area TEXT NOT NULL, -- clube, treinamento, biblioteca, jardim-da-psique, formacao
  action_type TEXT NOT NULL,  -- opened, completed, asked_question, played_audio, saved_reflection, started_practice, finished_practice
  object_type TEXT,           -- livro, ciclo, estacao, pratica, audio, aula, modulo, ferramenta
  object_id TEXT,
  metadata_short JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sle_user_id ON public.student_learning_events(user_id);
CREATE INDEX idx_sle_context ON public.student_learning_events(context_area);
CREATE INDEX idx_sle_created ON public.student_learning_events(created_at DESC);
CREATE INDEX idx_sle_user_context ON public.student_learning_events(user_id, context_area, created_at DESC);

ALTER TABLE public.student_learning_events ENABLE ROW LEVEL SECURITY;

-- Admins can read all events
CREATE POLICY "Admins can read all learning events"
  ON public.student_learning_events FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Users can insert their own events
CREATE POLICY "Users can insert own learning events"
  ON public.student_learning_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- STUDENT LEARNING PROGRESS (consolidated metrics)
-- =============================================
CREATE TABLE public.student_learning_progress (
  user_id UUID NOT NULL PRIMARY KEY,
  current_track TEXT DEFAULT 'formacao',
  current_book_id UUID,
  current_cycle_id UUID,
  current_station TEXT,
  progress_percent SMALLINT DEFAULT 0,
  lessons_completed INT DEFAULT 0,
  practices_started INT DEFAULT 0,
  practices_completed INT DEFAULT 0,
  questions_to_ai_count INT DEFAULT 0,
  reflections_count INT DEFAULT 0,
  training_cases_completed INT DEFAULT 0,
  last_access_at TIMESTAMPTZ,
  engagement_level TEXT DEFAULT 'baixo', -- baixo, medio, alto
  consistency_pattern TEXT DEFAULT 'interrompido', -- interrompido, ocasional, consistente
  current_bottleneck TEXT,
  learning_pattern TEXT,
  pedagogical_signal TEXT,
  suggested_next_step TEXT,
  ready_for_next_step BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.student_learning_progress ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage all progress"
  ON public.student_learning_progress FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Users can read their own progress
CREATE POLICY "Users can read own progress"
  ON public.student_learning_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- FUNCTION: refresh progress for a single user
-- =============================================
CREATE OR REPLACE FUNCTION public.refresh_student_progress(_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _total_events INT;
  _last_access TIMESTAMPTZ;
  _lessons INT;
  _practices_s INT;
  _practices_c INT;
  _questions INT;
  _reflections INT;
  _training INT;
  _engagement TEXT;
  _consistency TEXT;
  _days_since_last INT;
  _active_days_30 INT;
  _pattern TEXT;
  _signal TEXT;
  _next_step TEXT;
  _ready BOOLEAN;
  _bottleneck TEXT;
BEGIN
  -- Count metrics from events
  SELECT COUNT(*) INTO _total_events
  FROM student_learning_events WHERE user_id = _user_id;

  SELECT MAX(created_at) INTO _last_access
  FROM student_learning_events WHERE user_id = _user_id;

  SELECT COUNT(*) INTO _lessons
  FROM student_learning_events
  WHERE user_id = _user_id AND action_type = 'completed' AND object_type IN ('aula', 'modulo');

  SELECT COUNT(*) INTO _practices_s
  FROM student_learning_events
  WHERE user_id = _user_id AND action_type = 'started_practice';

  SELECT COUNT(*) INTO _practices_c
  FROM student_learning_events
  WHERE user_id = _user_id AND action_type = 'finished_practice';

  SELECT COUNT(*) INTO _questions
  FROM student_learning_events
  WHERE user_id = _user_id AND action_type = 'asked_question';

  SELECT COUNT(*) INTO _reflections
  FROM student_learning_events
  WHERE user_id = _user_id AND action_type = 'saved_reflection';

  SELECT COUNT(*) INTO _training
  FROM student_learning_events
  WHERE user_id = _user_id AND context_area = 'treinamento' AND action_type = 'completed';

  -- Engagement level
  _days_since_last := EXTRACT(DAY FROM now() - COALESCE(_last_access, now() - interval '999 days'));

  SELECT COUNT(DISTINCT DATE(created_at)) INTO _active_days_30
  FROM student_learning_events
  WHERE user_id = _user_id AND created_at > now() - interval '30 days';

  IF _active_days_30 >= 12 THEN _engagement := 'alto';
  ELSIF _active_days_30 >= 4 THEN _engagement := 'medio';
  ELSE _engagement := 'baixo';
  END IF;

  -- Consistency pattern
  IF _active_days_30 >= 12 THEN _consistency := 'consistente';
  ELSIF _active_days_30 >= 4 THEN _consistency := 'ocasional';
  ELSE _consistency := 'interrompido';
  END IF;

  -- Learning pattern and pedagogical signal
  IF _practices_c > 0 AND _practices_c >= _practices_s * 0.7 AND _lessons > 0 THEN
    _pattern := 'praticante_ativa';
    _signal := 'engajamento consistente';
    _ready := true;
  ELSIF _questions > _practices_c * 3 AND _practices_c < 2 THEN
    _pattern := 'conceitual_sem_pratica';
    _signal := 'precisa de mais aplicação prática';
    _ready := false;
  ELSIF _lessons > 3 AND _practices_s = 0 THEN
    _pattern := 'consumidora_passiva';
    _signal := 'consome conteúdo sem praticar';
    _ready := false;
  ELSIF _days_since_last > 14 THEN
    _pattern := 'ausente';
    _signal := 'risco de abandono';
    _ready := false;
  ELSIF _days_since_last > 7 AND _engagement = 'baixo' THEN
    _pattern := 'estagnou';
    _signal := 'estagnação na estação atual';
    _ready := false;
  ELSE
    _pattern := 'em_progresso';
    _signal := 'em desenvolvimento';
    _ready := false;
  END IF;

  -- Bottleneck
  IF _practices_s > 0 AND _practices_c = 0 THEN
    _bottleneck := 'praticas_incompletas';
  ELSIF _lessons = 0 AND _total_events > 5 THEN
    _bottleneck := 'sem_conclusao_aulas';
  ELSE
    _bottleneck := NULL;
  END IF;

  -- Next step
  IF _ready THEN
    _next_step := 'pronta para avançar';
  ELSIF _pattern = 'conceitual_sem_pratica' THEN
    _next_step := 'iniciar prática guiada';
  ELSIF _pattern = 'consumidora_passiva' THEN
    _next_step := 'experimentar ferramenta simbólica';
  ELSIF _pattern = 'ausente' THEN
    _next_step := 'reengajar com conteúdo leve';
  ELSE
    _next_step := 'continuar trilha atual';
  END IF;

  -- Upsert progress
  INSERT INTO student_learning_progress (
    user_id, lessons_completed, practices_started, practices_completed,
    questions_to_ai_count, reflections_count, training_cases_completed,
    last_access_at, engagement_level, consistency_pattern,
    current_bottleneck, learning_pattern, pedagogical_signal,
    suggested_next_step, ready_for_next_step, updated_at
  ) VALUES (
    _user_id, _lessons, _practices_s, _practices_c,
    _questions, _reflections, _training,
    _last_access, _engagement, _consistency,
    _bottleneck, _pattern, _signal,
    _next_step, _ready, now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    lessons_completed = EXCLUDED.lessons_completed,
    practices_started = EXCLUDED.practices_started,
    practices_completed = EXCLUDED.practices_completed,
    questions_to_ai_count = EXCLUDED.questions_to_ai_count,
    reflections_count = EXCLUDED.reflections_count,
    training_cases_completed = EXCLUDED.training_cases_completed,
    last_access_at = EXCLUDED.last_access_at,
    engagement_level = EXCLUDED.engagement_level,
    consistency_pattern = EXCLUDED.consistency_pattern,
    current_bottleneck = EXCLUDED.current_bottleneck,
    learning_pattern = EXCLUDED.learning_pattern,
    pedagogical_signal = EXCLUDED.pedagogical_signal,
    suggested_next_step = EXCLUDED.suggested_next_step,
    ready_for_next_step = EXCLUDED.ready_for_next_step,
    updated_at = now();
END;
$$;

-- =============================================
-- VIEW: admin overview of student progress with profile info
-- =============================================
CREATE OR REPLACE VIEW public.v_student_tracking AS
SELECT
  slp.*,
  p.nome,
  p.email,
  ur.portal
FROM public.student_learning_progress slp
JOIN public.profiles p ON p.id = slp.user_id
LEFT JOIN public.user_roles ur ON ur.user_id = slp.user_id;
