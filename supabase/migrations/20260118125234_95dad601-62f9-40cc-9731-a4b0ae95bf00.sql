
-- =====================================================
-- SESSION ROOM MODULE - DATABASE SCHEMA
-- =====================================================

-- 1) session_cases - Main case container
CREATE TABLE public.session_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2) narrative_maps - 7 Layers decoding
CREATE TABLE public.narrative_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.session_cases(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Layer 1: Fact
  layer1_fact_event TEXT,
  layer1_context TEXT,
  layer1_trigger TEXT,
  -- Layer 2: Emotion
  layer2_emotion_main TEXT,
  layer2_intensity INTEGER CHECK (layer2_intensity >= 0 AND layer2_intensity <= 10),
  layer2_emotion_secondary TEXT,
  -- Layer 3: Image
  layer3_scene TEXT,
  layer3_central_element TEXT,
  layer3_climate TEXT,
  -- Layer 4: Archetype
  layer4_archetype_main TEXT,
  layer4_archetype_conflict TEXT,
  layer4_protects TEXT,
  -- Layer 5: Feminine Shadow
  layer5_prohibition TEXT,
  layer5_strategy TEXT,
  layer5_cost TEXT,
  -- Layer 6: Repetition
  layer6_first_memory TEXT,
  layer6_pattern TEXT,
  layer6_current_repeat TEXT,
  -- Layer 7: Soul Invitation
  layer7_invitation TEXT,
  layer7_ego_resistance TEXT,
  layer7_small_gesture TEXT,
  -- Summaries (structured, not interpretation)
  summary_core TEXT,
  summary_archetype TEXT,
  summary_repetition TEXT,
  summary_invitation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3) session_scripts - Generated session script
CREATE TABLE public.session_scripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.session_cases(id) ON DELETE CASCADE,
  narrative_map_id UUID REFERENCES public.narrative_maps(id) ON DELETE SET NULL,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opening_question TEXT,
  opening_gesture TEXT,
  exploration_questions TEXT,
  intervention_type TEXT CHECK (intervention_type IN ('short_story', 'metaphor', 'writing', 'visualization')),
  intervention_prompt TEXT,
  closing_name TEXT,
  closing_seal TEXT,
  closing_leave_open TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4) post_session_closures - Close the field
CREATE TABLE public.post_session_closures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.session_cases(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  moved TEXT,
  left_open TEXT,
  do_not_touch TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5) session_oracle_draws - Oracle draws for sessions
CREATE TABLE public.session_oracle_draws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.session_cases(id) ON DELETE SET NULL,
  mode TEXT NOT NULL CHECK (mode IN ('symbolic_card', 'tarot', 'numerology', 'radiesthesia')),
  axis_narrative TEXT,
  axis_archetype TEXT,
  axis_movement TEXT,
  oracle_image TEXT,
  mediator_symbol TEXT,
  suggested_rite TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_session_cases_therapist ON public.session_cases(therapist_id);
CREATE INDEX idx_session_cases_client ON public.session_cases(client_id);
CREATE INDEX idx_session_cases_status ON public.session_cases(status);
CREATE INDEX idx_narrative_maps_case ON public.narrative_maps(case_id);
CREATE INDEX idx_narrative_maps_therapist ON public.narrative_maps(therapist_id);
CREATE INDEX idx_session_scripts_case ON public.session_scripts(case_id);
CREATE INDEX idx_post_session_closures_case ON public.post_session_closures(case_id);
CREATE INDEX idx_session_oracle_draws_therapist ON public.session_oracle_draws(therapist_id);
CREATE INDEX idx_session_oracle_draws_case ON public.session_oracle_draws(case_id);

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE public.session_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.narrative_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_session_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_oracle_draws ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - session_cases
-- =====================================================
CREATE POLICY "Therapists can view own cases"
ON public.session_cases FOR SELECT
USING (
  therapist_id = auth.uid()
  OR get_user_portal(auth.uid()) = 'admin'
);

CREATE POLICY "Therapists can create cases for linked clients"
ON public.session_cases FOR INSERT
WITH CHECK (
  therapist_id = auth.uid()
  AND is_linked_therapist(auth.uid(), client_id)
);

CREATE POLICY "Therapists can update own cases"
ON public.session_cases FOR UPDATE
USING (therapist_id = auth.uid())
WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can delete own cases"
ON public.session_cases FOR DELETE
USING (therapist_id = auth.uid());

-- =====================================================
-- RLS POLICIES - narrative_maps
-- =====================================================
CREATE POLICY "Therapists can view own narrative maps"
ON public.narrative_maps FOR SELECT
USING (
  therapist_id = auth.uid()
  OR get_user_portal(auth.uid()) = 'admin'
);

CREATE POLICY "Therapists can create narrative maps"
ON public.narrative_maps FOR INSERT
WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can update own narrative maps"
ON public.narrative_maps FOR UPDATE
USING (therapist_id = auth.uid())
WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can delete own narrative maps"
ON public.narrative_maps FOR DELETE
USING (therapist_id = auth.uid());

-- =====================================================
-- RLS POLICIES - session_scripts
-- =====================================================
CREATE POLICY "Therapists can view own scripts"
ON public.session_scripts FOR SELECT
USING (
  therapist_id = auth.uid()
  OR get_user_portal(auth.uid()) = 'admin'
);

CREATE POLICY "Therapists can create scripts"
ON public.session_scripts FOR INSERT
WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can update own scripts"
ON public.session_scripts FOR UPDATE
USING (therapist_id = auth.uid())
WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can delete own scripts"
ON public.session_scripts FOR DELETE
USING (therapist_id = auth.uid());

-- =====================================================
-- RLS POLICIES - post_session_closures
-- =====================================================
CREATE POLICY "Therapists can view own closures"
ON public.post_session_closures FOR SELECT
USING (
  therapist_id = auth.uid()
  OR get_user_portal(auth.uid()) = 'admin'
);

CREATE POLICY "Therapists can create closures"
ON public.post_session_closures FOR INSERT
WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can delete own closures"
ON public.post_session_closures FOR DELETE
USING (therapist_id = auth.uid());

-- =====================================================
-- RLS POLICIES - session_oracle_draws
-- =====================================================
CREATE POLICY "Therapists can view own oracle draws"
ON public.session_oracle_draws FOR SELECT
USING (
  therapist_id = auth.uid()
  OR get_user_portal(auth.uid()) = 'admin'
);

CREATE POLICY "Therapists can create oracle draws"
ON public.session_oracle_draws FOR INSERT
WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can update own oracle draws"
ON public.session_oracle_draws FOR UPDATE
USING (therapist_id = auth.uid())
WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can delete own oracle draws"
ON public.session_oracle_draws FOR DELETE
USING (therapist_id = auth.uid());

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================
CREATE TRIGGER update_session_cases_updated_at
  BEFORE UPDATE ON public.session_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_narrative_maps_updated_at
  BEFORE UPDATE ON public.narrative_maps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_session_scripts_updated_at
  BEFORE UPDATE ON public.session_scripts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
