
CREATE TABLE public.praticas_mudra (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  therapist_id uuid NOT NULL,
  mudra_nome text NOT NULL,
  distrito_associado text,
  anotacoes_pratica text,
  data_pratica timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.praticas_mudra ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_praticas_mudra_client ON public.praticas_mudra(client_id);
CREATE INDEX idx_praticas_mudra_therapist ON public.praticas_mudra(therapist_id);

CREATE POLICY "Therapist manages mudra practices" ON public.praticas_mudra
  FOR ALL TO authenticated
  USING (
    auth.uid() = therapist_id
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = praticas_mudra.client_id
        AND c.terapeuta_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = therapist_id
    OR public.is_admin(auth.uid())
  );
