
-- Oráculo das Estações: mapeamento do ritmo cíclico da psique
CREATE TABLE public.client_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  estacao TEXT NOT NULL CHECK (estacao IN ('primavera', 'verao', 'outono', 'inverno')),
  descricao TEXT,
  energia_predominante TEXT,
  necessidade_central TEXT,
  intervencao_sugerida TEXT,
  notas TEXT,
  data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists manage own client seasons"
  ON public.client_seasons FOR ALL TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

-- Fio de Ariadne: mapeamento de labirintos e padrões repetitivos
CREATE TABLE public.client_labyrinths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  nome_padrao TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL DEFAULT 'repetitivo' CHECK (tipo IN ('repetitivo', 'evitativo', 'circular', 'autoboicote')),
  severidade TEXT NOT NULL DEFAULT 'medio' CHECK (severidade IN ('leve', 'medio', 'intenso')),
  gatilhos TEXT[] DEFAULT '{}',
  acoes_ruptura TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'observacao', 'integrado')),
  sessoes_relacionadas INTEGER DEFAULT 0,
  ultima_ocorrencia DATE,
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_labyrinths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists manage own client labyrinths"
  ON public.client_labyrinths FOR ALL TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));
