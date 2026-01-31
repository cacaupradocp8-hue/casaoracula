-- ============================================
-- JORNADA — Tabelas para CRUD Admin e Progressão Automática
-- ============================================

-- 1. CONVITES DA JORNADA (gerenciados pelo admin)
CREATE TABLE public.jornada_convites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nivel TEXT NOT NULL CHECK (nivel IN ('iniciada', 'terapeuta', 'guardia')),
  texto TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. FRASES-SELO (rotativas, gerenciadas pelo admin)
CREATE TABLE public.jornada_frases_selo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  texto TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PROGRESSÃO AUTOMÁTICA (eventos que desbloqueiam conteúdo)
CREATE TABLE public.jornada_progressao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_evento TEXT NOT NULL,
  desbloqueio TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_jornada_convites_nivel ON public.jornada_convites(nivel);
CREATE INDEX idx_jornada_convites_ativo ON public.jornada_convites(ativo);
CREATE INDEX idx_jornada_progressao_user ON public.jornada_progressao(user_id);
CREATE INDEX idx_jornada_progressao_evento ON public.jornada_progressao(tipo_evento);

-- ============================================
-- RLS
-- ============================================
ALTER TABLE public.jornada_convites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jornada_frases_selo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jornada_progressao ENABLE ROW LEVEL SECURITY;

-- Convites: leitura pública, escrita admin
CREATE POLICY "Convites leitura pública" ON public.jornada_convites
  FOR SELECT USING (true);

CREATE POLICY "Convites admin gerencia" ON public.jornada_convites
  FOR ALL USING (public.is_admin(auth.uid()));

-- Frases-Selo: leitura pública, escrita admin
CREATE POLICY "Frases leitura pública" ON public.jornada_frases_selo
  FOR SELECT USING (true);

CREATE POLICY "Frases admin gerencia" ON public.jornada_frases_selo
  FOR ALL USING (public.is_admin(auth.uid()));

-- Progressão: usuário vê próprio, admin vê tudo
CREATE POLICY "Progressão própria leitura" ON public.jornada_progressao
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Progressão própria insert" ON public.jornada_progressao
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Progressão admin gerencia" ON public.jornada_progressao
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================
-- TRIGGERS updated_at
-- ============================================
CREATE TRIGGER update_jornada_convites_updated_at
  BEFORE UPDATE ON public.jornada_convites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jornada_frases_selo_updated_at
  BEFORE UPDATE ON public.jornada_frases_selo
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SEED DATA — Convites por nível
-- ============================================
INSERT INTO public.jornada_convites (nivel, texto, ordem) VALUES
  ('iniciada', 'O que precisa ser olhado antes de seguir?', 1),
  ('iniciada', 'Há algo que você evitou nomear essa semana?', 2),
  ('iniciada', 'Qual parte de você precisa de pausa?', 3),
  ('iniciada', 'O que você gostaria de acolher hoje?', 4),
  ('terapeuta', 'Antes de abrir um campo, você fechou o anterior?', 1),
  ('terapeuta', 'O que seu corpo absorveu das sessões?', 2),
  ('terapeuta', 'Há algo que você precisa devolver ao campo?', 3),
  ('terapeuta', 'Você se permitiu ser cuidada esta semana?', 4),
  ('guardia', 'O que você transmite sem perceber?', 1),
  ('guardia', 'Há um padrão nos grupos que você conduz?', 2),
  ('guardia', 'O que precisa ser protegido agora?', 3),
  ('guardia', 'Qual transmissão pede refinamento?', 4);

-- SEED DATA — Frases-Selo
INSERT INTO public.jornada_frases_selo (texto, ordem) VALUES
  ('Cada passo é uma escolha de presença.', 1),
  ('A jornada não se apressou para você chegar.', 2),
  ('O que se integra, não retorna como ferida.', 3),
  ('Caminhar devagar também é avançar.', 4),
  ('Honre o ritmo que o corpo pede.', 5);