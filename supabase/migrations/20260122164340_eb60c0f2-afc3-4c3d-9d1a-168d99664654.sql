-- Drop the problematic policy that references auth.users
DROP POLICY IF EXISTS "Admins can manage families" ON travessia_familias;

-- Create new policy using get_user_portal() function (avoids auth.users access)
CREATE POLICY "Admins can manage families"
ON travessia_familias
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type)
WITH CHECK (get_user_portal(auth.uid()) = 'admin'::portal_type);