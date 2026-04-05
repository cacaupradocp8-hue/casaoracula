
DROP VIEW IF EXISTS public.v_student_tracking;
CREATE OR REPLACE VIEW public.v_student_tracking
WITH (security_invoker = true)
AS
SELECT
  slp.*,
  p.nome,
  p.email,
  ur.portal
FROM public.student_learning_progress slp
JOIN public.profiles p ON p.id = slp.user_id
LEFT JOIN public.user_roles ur ON ur.user_id = slp.user_id;
