
-- Drop the problematic SELECT policy that references auth.users
DROP POLICY IF EXISTS "Users can read relevant invitations" ON public.co_convites;

-- Recreate it using auth.jwt() instead of querying auth.users
CREATE POLICY "Users can read relevant invitations"
ON public.co_convites
FOR SELECT
TO authenticated
USING (
  terapeuta_id = auth.uid()
  OR email = (auth.jwt()->>'email')
);
