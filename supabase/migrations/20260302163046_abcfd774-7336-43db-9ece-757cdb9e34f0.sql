-- Allow admin to update and delete all projects
CREATE POLICY "Admin can update all projects"
ON public.estudio_projetos
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can delete all projects"
ON public.estudio_projetos
FOR DELETE
USING (public.is_admin(auth.uid()));
