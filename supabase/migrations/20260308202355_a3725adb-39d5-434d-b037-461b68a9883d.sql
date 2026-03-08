
CREATE TABLE public.sonhos_cabalisticos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  therapist_id uuid NOT NULL,
  descricao_sonho text NOT NULL,
  simbolos_chave text[] NOT NULL DEFAULT '{}',
  interpretacao_ia text,
  distritos_relacionados text[] DEFAULT '{}',
  labirintos_potenciais text[] DEFAULT '{}',
  praticas_sugeridas text[] DEFAULT '{}',
  data_registro timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sonhos_cabalisticos ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_sonhos_cab_client ON public.sonhos_cabalisticos(client_id);
CREATE INDEX idx_sonhos_cab_therapist ON public.sonhos_cabalisticos(therapist_id);

CREATE POLICY "Therapist manages dream records" ON public.sonhos_cabalisticos
  FOR ALL TO authenticated
  USING (
    auth.uid() = therapist_id
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = sonhos_cabalisticos.client_id
        AND c.terapeuta_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = therapist_id
    OR public.is_admin(auth.uid())
  );
