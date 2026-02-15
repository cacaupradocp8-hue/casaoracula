
-- =============================================
-- FASE 1: ATELIÊ INSTITUCIONAL — TABELAS CORE
-- =============================================

-- 1) JORNADAS
CREATE TABLE public.jornadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  icone TEXT DEFAULT 'Compass',
  cor_acento TEXT DEFAULT 'amber',
  ordem INTEGER NOT NULL DEFAULT 0,
  ativa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jornadas visíveis para autenticados" ON public.jornadas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin gerencia jornadas" ON public.jornadas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal = 'admin')
  );

-- Seed das 4 jornadas
INSERT INTO public.jornadas (nome, descricao, ordem) VALUES
  ('Jornada da Heroína', 'A travessia arquetípica do feminino', 1),
  ('Jornada da Sombra', 'Integração dos aspectos sombrios', 2),
  ('Jornada do Instinto', 'Reconexão com a sabedoria instintiva', 3),
  ('Jornada do Corpo', 'O corpo como território simbólico', 4);

-- 2) PORTAIS
CREATE TABLE public.portais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jornada_id UUID NOT NULL REFERENCES public.jornadas(id) ON DELETE CASCADE,
  modulo_id UUID REFERENCES public.modulos_formativos(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  objetivo TEXT,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'revisado', 'publicado', 'arquivado')),
  motor_geracao TEXT DEFAULT 'padrao' CHECK (motor_geracao IN ('padrao', 'agente_casa_oracula')),
  nivel_conteudo TEXT DEFAULT 'certificada' CHECK (nivel_conteudo IN ('certificada', 'mentorada')),
  portal_minimo TEXT DEFAULT 'visitante',
  capa_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.portais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portais publicados visíveis" ON public.portais
  FOR SELECT USING (
    status = 'publicado' 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal = 'admin')
  );

CREATE POLICY "Admin gerencia portais" ON public.portais
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal = 'admin')
  );

-- 3) AULAS
CREATE TABLE public.aulas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portal_id UUID NOT NULL REFERENCES public.portais(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  conteudo_gerado JSONB,
  conteudo_raw TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'revisado', 'publicado', 'arquivado')),
  motor_geracao TEXT DEFAULT 'padrao' CHECK (motor_geracao IN ('padrao', 'agente_casa_oracula')),
  nivel_conteudo TEXT DEFAULT 'certificada' CHECK (nivel_conteudo IN ('certificada', 'mentorada')),
  duracao TEXT,
  tom TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.aulas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aulas publicadas visíveis" ON public.aulas
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.portais WHERE portais.id = aulas.portal_id AND portais.status = 'publicado')
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal = 'admin')
  );

CREATE POLICY "Admin gerencia aulas" ON public.aulas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal = 'admin')
  );

-- 4) MISSOES
CREATE TABLE public.missoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portal_id UUID REFERENCES public.portais(id) ON DELETE CASCADE,
  aula_id UUID REFERENCES public.aulas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  criterios_conclusao TEXT,
  compartilhamento_opcional BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'ativa', 'concluida', 'arquivada')),
  ordem INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.missoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Missões visíveis para autenticados" ON public.missoes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin gerencia missões" ON public.missoes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal = 'admin')
  );

-- Triggers de updated_at
CREATE TRIGGER update_jornadas_updated_at BEFORE UPDATE ON public.jornadas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portais_updated_at BEFORE UPDATE ON public.portais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aulas_updated_at BEFORE UPDATE ON public.aulas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_missoes_updated_at BEFORE UPDATE ON public.missoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices
CREATE INDEX idx_portais_jornada ON public.portais(jornada_id);
CREATE INDEX idx_portais_status ON public.portais(status);
CREATE INDEX idx_aulas_portal ON public.aulas(portal_id);
CREATE INDEX idx_aulas_status ON public.aulas(status);
CREATE INDEX idx_missoes_portal ON public.missoes(portal_id);
CREATE INDEX idx_missoes_aula ON public.missoes(aula_id);
