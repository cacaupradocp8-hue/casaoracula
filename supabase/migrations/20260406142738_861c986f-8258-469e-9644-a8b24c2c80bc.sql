
-- =============================================
-- 1. co_training_attempts — RLS
-- =============================================
ALTER TABLE public.co_training_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own attempts"
ON public.co_training_attempts FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own attempts"
ON public.co_training_attempts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own attempts"
ON public.co_training_attempts FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admin full access attempts"
ON public.co_training_attempts FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- =============================================
-- 2. co_training_progress — RLS
-- =============================================
ALTER TABLE public.co_training_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own progress"
ON public.co_training_progress FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progress"
ON public.co_training_progress FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own progress"
ON public.co_training_progress FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admin full access progress"
ON public.co_training_progress FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- =============================================
-- 3. co_training_cases — RLS (pedagógico, leitura aberta)
-- =============================================
ALTER TABLE public.co_training_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read active cases"
ON public.co_training_cases FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admin manage cases"
ON public.co_training_cases FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- =============================================
-- 4. co_training_case_feedbacks — RLS
-- =============================================
ALTER TABLE public.co_training_case_feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read feedbacks"
ON public.co_training_case_feedbacks FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admin manage feedbacks"
ON public.co_training_case_feedbacks FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- =============================================
-- 5. co_training_case_possible_readings — RLS
-- =============================================
ALTER TABLE public.co_training_case_possible_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read readings"
ON public.co_training_case_possible_readings FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admin manage readings"
ON public.co_training_case_possible_readings FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- =============================================
-- 6. co_training_case_signals — RLS
-- =============================================
ALTER TABLE public.co_training_case_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read signals"
ON public.co_training_case_signals FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admin manage signals"
ON public.co_training_case_signals FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- =============================================
-- 7. ai_recommendations — Restringir SELECT
-- =============================================
DROP POLICY IF EXISTS "Authenticated read ai_recommendations" ON public.ai_recommendations;

CREATE POLICY "Therapist reads own client recommendations"
ON public.ai_recommendations FOR SELECT TO authenticated
USING (
  public.is_admin(auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.clientes c
    WHERE c.id = ai_recommendations.client_id
      AND c.terapeuta_id = auth.uid()
      AND c.status IN ('ativo', 'pausado')
  )
);

-- =============================================
-- 8. client_archetype_state — Restringir SELECT
-- =============================================
DROP POLICY IF EXISTS "Public read client_archetype_state" ON public.client_archetype_state;

CREATE POLICY "Therapist reads own client archetype state"
ON public.client_archetype_state FOR SELECT TO authenticated
USING (
  public.is_admin(auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.clientes c
    WHERE c.id = client_archetype_state.client_id
      AND c.terapeuta_id = auth.uid()
      AND c.status IN ('ativo', 'pausado')
  )
);

-- =============================================
-- 9. client_city_state — Restringir SELECT
-- =============================================
DROP POLICY IF EXISTS "Authenticated read client_city_state" ON public.client_city_state;

CREATE POLICY "Therapist reads own client city state"
ON public.client_city_state FOR SELECT TO authenticated
USING (
  public.is_admin(auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.clientes c
    WHERE c.id = client_city_state.client_id
      AND c.terapeuta_id = auth.uid()
      AND c.status IN ('ativo', 'pausado')
  )
);
