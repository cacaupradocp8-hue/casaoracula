
-- 1. co_training_cases
CREATE TABLE public.co_training_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  nivel TEXT NOT NULL DEFAULT 'guiado',
  tema TEXT,
  caso_texto TEXT NOT NULL,
  distrito_esperado TEXT,
  estado_esperado TEXT,
  movimento_esperado TEXT,
  hipotese_esperada TEXT,
  vetor_esperado TEXT,
  ferramenta_principal TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. co_training_case_signals
CREATE TABLE public.co_training_case_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.co_training_cases(id) ON DELETE CASCADE,
  sinal TEXT NOT NULL,
  ordem INTEGER DEFAULT 0
);

-- 3. co_training_case_possible_readings
CREATE TABLE public.co_training_case_possible_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.co_training_cases(id) ON DELETE CASCADE,
  leitura TEXT NOT NULL,
  tipo TEXT NOT NULL,
  observacao TEXT
);

-- 4. co_training_case_feedbacks
CREATE TABLE public.co_training_case_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.co_training_cases(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  gatilho TEXT,
  feedback_texto TEXT NOT NULL
);

-- 5. co_training_attempts
CREATE TABLE public.co_training_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES public.co_training_cases(id) ON DELETE CASCADE,
  resposta_o_que_acontece TEXT,
  resposta_parece_o_que TEXT,
  resposta_distrito TEXT,
  resposta_estado TEXT,
  resposta_movimento TEXT,
  resposta_hipotese TEXT,
  resposta_vetor TEXT,
  resposta_ferramenta TEXT,
  feedback_final TEXT,
  status TEXT DEFAULT 'rascunho',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. co_training_progress
CREATE TABLE public.co_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nivel_atual TEXT,
  casos_concluidos INTEGER DEFAULT 0,
  ultimo_case_id UUID REFERENCES public.co_training_cases(id),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_co_training_signals_case ON public.co_training_case_signals(case_id);
CREATE INDEX idx_co_training_readings_case ON public.co_training_case_possible_readings(case_id);
CREATE INDEX idx_co_training_feedbacks_case ON public.co_training_case_feedbacks(case_id);
CREATE INDEX idx_co_training_attempts_user ON public.co_training_attempts(user_id);
CREATE INDEX idx_co_training_attempts_case ON public.co_training_attempts(case_id);
CREATE INDEX idx_co_training_progress_user ON public.co_training_progress(user_id);

-- Validation trigger for nivel
CREATE OR REPLACE FUNCTION public.co_validate_training_case_nivel()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.nivel NOT IN ('guiado', 'semi_guiado', 'livre') THEN
    RAISE EXCEPTION 'nivel must be guiado, semi_guiado or livre';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_co_training_cases_nivel
  BEFORE INSERT OR UPDATE ON public.co_training_cases
  FOR EACH ROW EXECUTE FUNCTION public.co_validate_training_case_nivel();

-- Validation trigger for reading tipo
CREATE OR REPLACE FUNCTION public.co_validate_training_reading_tipo()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.tipo NOT IN ('esperada', 'aceitavel', 'erro_comum') THEN
    RAISE EXCEPTION 'tipo must be esperada, aceitavel or erro_comum';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_co_training_readings_tipo
  BEFORE INSERT OR UPDATE ON public.co_training_case_possible_readings
  FOR EACH ROW EXECUTE FUNCTION public.co_validate_training_reading_tipo();

-- Validation trigger for feedback tipo
CREATE OR REPLACE FUNCTION public.co_validate_training_feedback_tipo()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.tipo NOT IN ('coerente', 'ajuste', 'erro') THEN
    RAISE EXCEPTION 'tipo must be coerente, ajuste or erro';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_co_training_feedbacks_tipo
  BEFORE INSERT OR UPDATE ON public.co_training_case_feedbacks
  FOR EACH ROW EXECUTE FUNCTION public.co_validate_training_feedback_tipo();

-- Validation trigger for attempt status
CREATE OR REPLACE FUNCTION public.co_validate_training_attempt_status()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status NOT IN ('rascunho', 'concluido') THEN
    RAISE EXCEPTION 'status must be rascunho or concluido';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_co_training_attempts_status
  BEFORE INSERT OR UPDATE ON public.co_training_attempts
  FOR EACH ROW EXECUTE FUNCTION public.co_validate_training_attempt_status();
