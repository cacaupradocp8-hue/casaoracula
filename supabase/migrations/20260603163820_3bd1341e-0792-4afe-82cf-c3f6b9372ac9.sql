DROP POLICY IF EXISTS "Allow public read access to active cases" ON public.co_camara_sussurro_casos;

CREATE POLICY "Authenticated users can read active cases"
ON public.co_camara_sussurro_casos
FOR SELECT
TO authenticated
USING (ativo = true);