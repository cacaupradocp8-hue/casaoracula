-- Add permissive RLS policy for oraculo_perguntas to allow all authenticated users to read active questions
-- This is needed for the Quiz Oracular in the onboarding flow (visitors need to read questions)

CREATE POLICY "Allow authenticated users to read active questions"
ON public.oraculo_perguntas
FOR SELECT
USING (
  status = 'ativo'
  AND auth.uid() IS NOT NULL
);