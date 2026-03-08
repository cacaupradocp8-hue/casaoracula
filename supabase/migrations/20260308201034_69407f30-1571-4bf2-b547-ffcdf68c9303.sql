
-- Jornada da Individuação reflections
CREATE TABLE public.jornada_individuacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  etapa_jornada text NOT NULL,
  reflexao_cliente text NOT NULL DEFAULT '',
  distritos_ativos text[] DEFAULT '{}',
  arquetipos_emergentes text[] DEFAULT '{}',
  data_registro timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_jornada_individuacao_client ON public.jornada_individuacao(client_id, data_registro DESC);

ALTER TABLE public.jornada_individuacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages jornada individuacao" ON public.jornada_individuacao
  FOR ALL TO authenticated
  USING (
    public.is_admin(auth.uid()) OR
    therapist_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid())
  )
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    therapist_id = auth.uid()
  );
