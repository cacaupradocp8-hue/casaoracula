-- ============================================
-- JARDIM DO GRUPO - Diário Terapêutico Coletivo
-- ============================================
-- Adaptado para grupos terapêuticos, foca no "campo coletivo"
-- e na "escuta do campo" ao invés de biografias individuais

CREATE TABLE public.jardim_grupo_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.group_sessions(id) ON DELETE SET NULL,
  therapist_id UUID NOT NULL,
  
  -- Contexto do Encontro
  fase_jornada_grupo TEXT,
  tema_simbolico TEXT,
  ritual_atual TEXT,
  
  -- 1. Clima do Campo (movimento coletivo)
  clima_movimento TEXT CHECK (clima_movimento IN ('expansao', 'recolhimento', 'tensao', 'fluidez', 'outro')),
  clima_descricao TEXT,
  escuta_campo TEXT,
  
  -- 2. Ecos da Jornada Coletiva
  movimentos_repetidos TEXT,
  escuta_coletiva TEXT,
  resistencias_grupais TEXT,
  
  -- 3. Ritual do Encontro
  ritual_realizado TEXT,
  resposta_campo TEXT,
  
  -- 4. Imagens, Símbolos e Frases
  imagens_emergentes TEXT,
  simbolos_coletivos TEXT,
  frase_semente_grupo TEXT,
  
  -- 5. Fechamento Ético (obrigatório)
  campo_fechado BOOLEAN DEFAULT false,
  ritual_fechamento TEXT,
  cuidado_proximo_encontro TEXT,
  
  -- 6. Notas Privadas da Terapeuta
  notas_privadas TEXT,
  
  -- Metadados
  data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_jardim_grupo_group_id ON public.jardim_grupo_registros(group_id);
CREATE INDEX idx_jardim_grupo_therapist_id ON public.jardim_grupo_registros(therapist_id);
CREATE INDEX idx_jardim_grupo_session_id ON public.jardim_grupo_registros(session_id);
CREATE INDEX idx_jardim_grupo_data ON public.jardim_grupo_registros(data_registro DESC);

-- Trigger para updated_at
CREATE TRIGGER update_jardim_grupo_registros_updated_at
  BEFORE UPDATE ON public.jardim_grupo_registros
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.jardim_grupo_registros ENABLE ROW LEVEL SECURITY;

-- Terapeuta pode gerenciar registros dos seus grupos
CREATE POLICY "Therapist manages group diary"
  ON public.jardim_grupo_registros
  FOR ALL
  USING (
    auth.uid() = therapist_id
    OR public.is_admin(auth.uid())
  )
  WITH CHECK (
    auth.uid() = therapist_id
    OR public.is_admin(auth.uid())
  );

-- Participantes podem VER registros do seu grupo (somente leitura)
CREATE POLICY "Participants view group diary"
  ON public.jardim_grupo_registros
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_participants gp
      WHERE gp.group_id = jardim_grupo_registros.group_id
        AND gp.cliente_id IN (
          SELECT c.id FROM public.clientes c WHERE c.terapeuta_id = auth.uid()
        )
        AND gp.ativo = true
    )
  );

-- Comentário
COMMENT ON TABLE public.jardim_grupo_registros IS 'Diário terapêutico coletivo para grupos - foca no campo grupal ao invés de biografias individuais';