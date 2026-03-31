
-- Fix overly permissive SELECT policy on co_convites
DROP POLICY IF EXISTS "Authenticated users can read invitations by token" ON public.co_convites;

-- Only allow reading own invitations (as therapist) or invitations addressed to own email
CREATE POLICY "Users can read relevant invitations"
  ON public.co_convites FOR SELECT
  TO authenticated
  USING (
    terapeuta_id = auth.uid()
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
