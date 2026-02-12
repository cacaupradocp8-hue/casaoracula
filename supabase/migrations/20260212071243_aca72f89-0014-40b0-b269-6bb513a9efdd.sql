-- Fix Security Definer View: set v_formation_progress to SECURITY INVOKER
-- This ensures RLS policies of the querying user are enforced, not the view creator's
ALTER VIEW public.v_formation_progress SET (security_invoker = true);