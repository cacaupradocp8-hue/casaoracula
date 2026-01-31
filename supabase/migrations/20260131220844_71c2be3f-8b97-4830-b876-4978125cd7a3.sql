-- ============================================
-- JARDIM DA HEROÍNA - Diário Simbólico Terapêutico
-- ============================================
-- Diário integrado ao Mapa Vivo para registros simbólicos

CREATE TABLE public.jardim_heroina_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_case_id UUID NOT NULL REFERENCES public.session_cases(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  mapa_vivo_id UUID REFERENCES public.mapa_vivo_heroina(id) ON DELETE SET NULL,
  
  -- Tipo de registro
  tipo_registro TEXT NOT NULL DEFAULT 'sessao' CHECK (tipo_registro IN ('sessao', 'entre_sessoes', 'reflexao')),
  
  -- Snapshot do Mapa Vivo no momento do registro
  fase_jornada_snapshot TEXT,
  arquetipo_snapshot TEXT,
  
  -- 1. Aterramento da Sessão
  aterramento_ficou_vivo TEXT,
  aterramento_imagem_central TEXT,
  aterramento_corpo_sentiu TEXT,
  
  -- 2. Ritual em Vivência
  ritual_vivendo TEXT,
  ritual_resistencia TEXT,
  ritual_movimento TEXT,
  
  -- 3. Sonhos, Imagens e Sinais
  sonhos_imagens TEXT,
  sinais_sincronicidades TEXT,
  memorias_emergentes TEXT,
  
  -- 4. Frase-Semente
  frase_semente TEXT,
  
  -- 5. Notas Privadas da Terapeuta
  notas_privadas TEXT,
  
  -- Metadados
  data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_jardim_heroina_session_case ON public.jardim_heroina_registros(session_case_id);
CREATE INDEX idx_jardim_heroina_therapist ON public.jardim_heroina_registros(therapist_id);
CREATE INDEX idx_jardim_heroina_data ON public.jardim_heroina_registros(data_registro DESC);

-- Enable RLS
ALTER TABLE public.jardim_heroina_registros ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Terapeutas podem ver registros de seus casos"
  ON public.jardim_heroina_registros FOR SELECT
  USING (
    therapist_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Terapeutas podem criar registros para seus casos"
  ON public.jardim_heroina_registros FOR INSERT
  WITH CHECK (
    therapist_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Terapeutas podem atualizar seus registros"
  ON public.jardim_heroina_registros FOR UPDATE
  USING (
    therapist_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Terapeutas podem deletar seus registros"
  ON public.jardim_heroina_registros FOR DELETE
  USING (
    therapist_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

-- Trigger para updated_at
CREATE TRIGGER update_jardim_heroina_updated_at
  BEFORE UPDATE ON public.jardim_heroina_registros
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();