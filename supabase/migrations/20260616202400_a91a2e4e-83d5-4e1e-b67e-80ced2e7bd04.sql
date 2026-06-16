DROP POLICY IF EXISTS "Administradores e terapeutas podem ver feedbacks" ON public.conducao_clinica_feedback;

CREATE POLICY "Terapeutas e admins podem ver feedbacks"
ON public.conducao_clinica_feedback
FOR SELECT
TO authenticated
USING (auth.uid() = therapist_id OR public.is_admin(auth.uid()));