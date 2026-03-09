
CREATE TABLE public.atlas_arquetipos_registros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  arquetipos_selecionados TEXT[] NOT NULL DEFAULT '{}',
  arquetipos_descricao JSONB NOT NULL DEFAULT '{}'::jsonb,
  arquetipos_atividade JSONB NOT NULL DEFAULT '{}'::jsonb,
  arquetipos_situacoes JSONB NOT NULL DEFAULT '{}'::jsonb,
  dinamica_geral TEXT,
  conflitos_arquetipos TEXT,
  harmonias_arquetipos TEXT,
  arquetipo_dominante TEXT,
  arquetipo_dormindo TEXT,
  o_que_poderia_trazer TEXT,
  reflexao_dominante TEXT,
  atividade_media NUMERIC(3,1) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.atlas_arquetipos_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists manage own client atlas"
  ON public.atlas_arquetipos_registros
  FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER update_atlas_arquetipos_registros_updated_at
  BEFORE UPDATE ON public.atlas_arquetipos_registros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
