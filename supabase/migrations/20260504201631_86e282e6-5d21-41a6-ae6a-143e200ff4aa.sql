-- Allow admins to manage Laboratório 80/20 essence content
CREATE POLICY "Admins can insert essence 80/20"
  ON public.clube_obras_essencia_8020
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update essence 80/20"
  ON public.clube_obras_essencia_8020
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete essence 80/20"
  ON public.clube_obras_essencia_8020
  FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));