-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 4: Quotas and Templates Integration Migration
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 2: Add case limits to plan_limits
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.plan_limits 
ADD COLUMN IF NOT EXISTS max_cases INTEGER NOT NULL DEFAULT -1;

-- Set initial values for case limits per portal
UPDATE public.plan_limits SET max_cases = 3 WHERE portal = 'visitante';
UPDATE public.plan_limits SET max_cases = 50 WHERE portal = 'pre_iniciada';
UPDATE public.plan_limits SET max_cases = -1 WHERE portal = 'iniciada';
UPDATE public.plan_limits SET max_cases = -1 WHERE portal = 'admin';

-- Create function to check if user can create new cases
CREATE OR REPLACE FUNCTION public.check_case_limit(_therapist_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN get_user_portal(_therapist_id) = 'admin' THEN true
    ELSE (
      -- Check if limit is -1 (unlimited)
      (SELECT COALESCE(max_cases, -1) FROM plan_limits WHERE portal = get_user_portal(_therapist_id)) = -1
      OR
      -- Count active cases and compare to limit
      (
        SELECT COUNT(*) FROM session_cases 
        WHERE therapist_id = _therapist_id AND status != 'archived'
      ) < (
        SELECT COALESCE(max_cases, -1) FROM plan_limits WHERE portal = get_user_portal(_therapist_id)
      )
    )
  END
$$;

-- Create function to get case quota info
CREATE OR REPLACE FUNCTION public.get_case_quota(_therapist_id uuid)
RETURNS TABLE(used_cases bigint, max_cases integer, can_create boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    (SELECT COUNT(*) FROM session_cases WHERE therapist_id = _therapist_id AND status != 'archived') as used_cases,
    (SELECT COALESCE(pl.max_cases, -1) FROM plan_limits pl WHERE pl.portal = get_user_portal(_therapist_id)) as max_cases,
    check_case_limit(_therapist_id) as can_create
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 3: Add case_id to symbolic_template_sessions
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.symbolic_template_sessions
ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES public.session_cases(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_template_sessions_case_id 
ON public.symbolic_template_sessions(case_id);

-- Create index for client lookups
CREATE INDEX IF NOT EXISTS idx_template_sessions_cliente_id 
ON public.symbolic_template_sessions(cliente_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 4: Ensure tool tables have proper case linkage columns
-- These may already exist based on earlier migrations
-- ═══════════════════════════════════════════════════════════════════════════

-- Add indexes for case lookups on tool record tables (if not exist)
CREATE INDEX IF NOT EXISTS idx_big5_registros_caso_id 
ON public.big5_registros(caso_id);

CREATE INDEX IF NOT EXISTS idx_eneagrama_registros_caso_id 
ON public.eneagrama_registros(caso_id);