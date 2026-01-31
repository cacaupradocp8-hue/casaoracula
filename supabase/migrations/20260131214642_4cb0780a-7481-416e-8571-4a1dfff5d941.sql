-- Mapa Vivo da Heroína Oracular - Ferramenta de acompanhamento simbólico longitudinal

-- Tabela principal: Mapa Vivo da Heroína
CREATE TABLE public.mapa_vivo_heroina (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_case_id UUID NOT NULL REFERENCES public.session_cases(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  client_id UUID NOT NULL,
  
  -- Camada 1: Localização na Jornada
  fase_jornada TEXT CHECK (fase_jornada IN (
    'chamado_silenciado',
    'descida',
    'fragmentacao', 
    'sombra_revelada',
    'travessia',
    'reintegracao',
    'retorno_sabedoria'
  )),
  fase_descricao TEXT,
  
  -- Camada 2: Arquétipos Ativos
  arquetipo_predominante TEXT,
  arquetipo_tensao TEXT,
  arquetipo_emergente TEXT,
  dinamica_arquetipal TEXT,
  
  -- Camada 3: Narrativa Pessoal
  simbolo_recorrente TEXT,
  mito_pessoal TEXT,
  metafora_central TEXT,
  
  -- Camada 4: Ritual Sugerido
  ritual_tipo TEXT CHECK (ritual_tipo IN (
    'interno',
    'corporal', 
    'relacional',
    'simbolico_concreto',
    'ritual_tempo'
  )),
  ritual_descricao TEXT,
  ritual_realizado BOOLEAN DEFAULT false,
  ritual_observacoes TEXT,
  
  -- Camada 5: Movimento da Heroína
  movimento_heroina TEXT CHECK (movimento_heroina IN (
    'avancou',
    'resistiu',
    'ciclou'
  )),
  movimento_descricao TEXT,
  
  -- Camada 6: Espelho da Terapeuta (privado)
  espelho_toca_minha TEXT,
  espelho_risco_projecao TEXT,
  espelho_supervisao TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de histórico: Tracking longitudinal
CREATE TABLE public.mapa_vivo_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mapa_id UUID NOT NULL REFERENCES public.mapa_vivo_heroina(id) ON DELETE CASCADE,
  session_case_id UUID NOT NULL,
  therapist_id UUID NOT NULL,
  
  -- Snapshot da mudança
  fase_anterior TEXT,
  fase_nova TEXT,
  movimento TEXT,
  observacao TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_mapa_vivo_case ON public.mapa_vivo_heroina(session_case_id);
CREATE INDEX idx_mapa_vivo_therapist ON public.mapa_vivo_heroina(therapist_id);
CREATE INDEX idx_mapa_vivo_client ON public.mapa_vivo_heroina(client_id);
CREATE INDEX idx_mapa_historico_mapa ON public.mapa_vivo_historico(mapa_id);

-- Enable RLS
ALTER TABLE public.mapa_vivo_heroina ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapa_vivo_historico ENABLE ROW LEVEL SECURITY;

-- RLS Policies para mapa_vivo_heroina
CREATE POLICY "Terapeutas veem seus mapas"
  ON public.mapa_vivo_heroina FOR SELECT
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Terapeutas criam mapas"
  ON public.mapa_vivo_heroina FOR INSERT
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Terapeutas atualizam seus mapas"
  ON public.mapa_vivo_heroina FOR UPDATE
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Terapeutas deletam seus mapas"
  ON public.mapa_vivo_heroina FOR DELETE
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

-- RLS Policies para mapa_vivo_historico
CREATE POLICY "Terapeutas veem historico"
  ON public.mapa_vivo_historico FOR SELECT
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Terapeutas criam historico"
  ON public.mapa_vivo_historico FOR INSERT
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

-- Trigger para updated_at
CREATE TRIGGER update_mapa_vivo_updated_at
  BEFORE UPDATE ON public.mapa_vivo_heroina
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();