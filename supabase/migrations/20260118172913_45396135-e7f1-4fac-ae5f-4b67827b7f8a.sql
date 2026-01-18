-- Fix P1: Add proper WITH CHECK to INSERT policies
-- Also add admin bypass to symbolic_template_sessions

-- Fix session_cases INSERT policy
DROP POLICY IF EXISTS "Therapists can create cases for linked clients" ON public.session_cases;
CREATE POLICY "Therapists can create cases for linked clients"
ON public.session_cases
FOR INSERT
WITH CHECK (auth.uid() = therapist_id);

-- Fix narrative_maps INSERT policy
DROP POLICY IF EXISTS "Therapists can create narrative maps" ON public.narrative_maps;
CREATE POLICY "Therapists can create narrative maps"
ON public.narrative_maps
FOR INSERT
WITH CHECK (auth.uid() = therapist_id);

-- Fix session_scripts INSERT policy
DROP POLICY IF EXISTS "Therapists can create scripts" ON public.session_scripts;
CREATE POLICY "Therapists can create scripts"
ON public.session_scripts
FOR INSERT
WITH CHECK (auth.uid() = therapist_id);

-- Fix post_session_closures INSERT policy
DROP POLICY IF EXISTS "Therapists can create closures" ON public.post_session_closures;
CREATE POLICY "Therapists can create closures"
ON public.post_session_closures
FOR INSERT
WITH CHECK (auth.uid() = therapist_id);

-- Fix session_oracle_draws INSERT policy
DROP POLICY IF EXISTS "Therapists can create oracle draws" ON public.session_oracle_draws;
CREATE POLICY "Therapists can create oracle draws"
ON public.session_oracle_draws
FOR INSERT
WITH CHECK (auth.uid() = therapist_id);

-- Fix symbolic_template_sessions INSERT policy
DROP POLICY IF EXISTS "Users can create their own template sessions" ON public.symbolic_template_sessions;
CREATE POLICY "Users can create their own template sessions"
ON public.symbolic_template_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add admin bypass to symbolic_template_sessions
DROP POLICY IF EXISTS "Admins can manage all template sessions" ON public.symbolic_template_sessions;
CREATE POLICY "Admins can manage all template sessions"
ON public.symbolic_template_sessions
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);