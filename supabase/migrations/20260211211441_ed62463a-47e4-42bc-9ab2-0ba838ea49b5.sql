-- Add missing UPDATE and DELETE RLS policies for big5_funcional_registros
CREATE POLICY "Users can update own big5 funcional records"
  ON public.big5_funcional_registros
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own big5 funcional records"
  ON public.big5_funcional_registros
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add therapist access via clientes table
CREATE POLICY "Therapists can view linked client big5 funcional records"
  ON public.big5_funcional_registros
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.terapeuta_id = auth.uid()
        AND c.id::text = big5_funcional_registros.user_id::text
        AND c.status = 'ativo'
    )
  );