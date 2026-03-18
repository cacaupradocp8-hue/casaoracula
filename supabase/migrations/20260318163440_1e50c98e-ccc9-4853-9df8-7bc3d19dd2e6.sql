DROP POLICY IF EXISTS "admin_manage_rules" ON public.cartographer_rules;

CREATE POLICY "admin_full_access_rules" ON public.cartographer_rules
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));