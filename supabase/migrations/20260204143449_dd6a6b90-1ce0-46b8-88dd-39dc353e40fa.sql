-- ============================================
-- GERADOR DE ROTEIRO - TEMPLATES E ESTRUTURA
-- Sistema híbrido: templates base + IA leve
-- ============================================

-- Templates de roteiro por camada
CREATE TABLE public.labirinto_roteiro_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_camada TEXT NOT NULL CHECK (tipo_camada IN ('fase', 'arquetipo', 'metafora', 'ritual')),
  camada_id UUID NOT NULL,
  secao TEXT NOT NULL CHECK (secao IN ('abertura', 'exploracao', 'intervencao', 'fechamento')),
  texto_base TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 1,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Roteiros gerados (persistência)
CREATE TABLE public.labirinto_roteiros_gerados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_case_id UUID REFERENCES public.session_cases(id),
  fase_id UUID REFERENCES public.labirinto_fases(id),
  arquetipo_id UUID REFERENCES public.labirinto_arquetipos(id),
  metafora_id UUID REFERENCES public.labirinto_metaforas(id),
  ritual_id UUID REFERENCES public.labirinto_rituais(id),
  
  -- Seções do roteiro (editáveis pela terapeuta)
  abertura TEXT,
  exploracao TEXT,
  intervencao TEXT,
  fechamento TEXT,
  
  -- Metadados
  gerado_por TEXT NOT NULL DEFAULT 'hibrido' CHECK (gerado_por IN ('template', 'hibrido', 'ia_completo')),
  editado BOOLEAN NOT NULL DEFAULT false,
  notas_terapeuta TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_roteiro_templates_camada ON public.labirinto_roteiro_templates(tipo_camada, camada_id);
CREATE INDEX idx_roteiros_gerados_user ON public.labirinto_roteiros_gerados(user_id);
CREATE INDEX idx_roteiros_gerados_session ON public.labirinto_roteiros_gerados(session_case_id);

-- RLS
ALTER TABLE public.labirinto_roteiro_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labirinto_roteiros_gerados ENABLE ROW LEVEL SECURITY;

-- Templates: leitura pública, escrita admin
CREATE POLICY "Templates leitura autenticados"
  ON public.labirinto_roteiro_templates FOR SELECT
  TO authenticated USING (ativo = true);

-- Roteiros gerados: apenas dono ou admin
CREATE POLICY "Roteiros gerados - owner read"
  ON public.labirinto_roteiros_gerados FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Roteiros gerados - owner insert"
  ON public.labirinto_roteiros_gerados FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Roteiros gerados - owner update"
  ON public.labirinto_roteiros_gerados FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Roteiros gerados - owner delete"
  ON public.labirinto_roteiros_gerados FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Trigger updated_at
CREATE TRIGGER update_labirinto_roteiro_templates_updated_at
  BEFORE UPDATE ON public.labirinto_roteiro_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_labirinto_roteiros_gerados_updated_at
  BEFORE UPDATE ON public.labirinto_roteiros_gerados
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();