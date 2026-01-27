-- ============================================
-- CLUBE DO LIVRO ORACULAR - Estrutura Completa
-- ============================================

-- Ciclos de leitura (cada livro é um ciclo)
CREATE TABLE public.clube_livro_ciclos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  autor_livro TEXT,
  capa_url TEXT,
  por_que_este_livro TEXT,
  como_ler TEXT,
  manifesto TEXT,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  publicado BOOLEAN DEFAULT false,
  data_inicio DATE,
  data_fim DATE,
  portal_minimo public.portal_type DEFAULT 'aluna',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fases simbólicas de cada ciclo
CREATE TABLE public.clube_livro_fases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ciclo_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  icone TEXT,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Perguntas oraculares de cada fase
CREATE TABLE public.clube_livro_perguntas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fase_id UUID NOT NULL REFERENCES public.clube_livro_fases(id) ON DELETE CASCADE,
  texto_pergunta TEXT NOT NULL,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Respostas privadas das usuárias
CREATE TABLE public.clube_livro_respostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ciclo_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  fase_id UUID NOT NULL REFERENCES public.clube_livro_fases(id) ON DELETE CASCADE,
  pergunta_id UUID NOT NULL REFERENCES public.clube_livro_perguntas(id) ON DELETE CASCADE,
  resposta TEXT,
  salvo_jardim BOOLEAN DEFAULT false,
  jardim_registro_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Escuta guiada
CREATE TABLE public.clube_livro_escutas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ciclo_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  fase_id UUID REFERENCES public.clube_livro_fases(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL DEFAULT 'audio' CHECK (tipo IN ('audio', 'texto')),
  audio_url TEXT,
  texto_conteudo TEXT,
  duracao_segundos INT,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Encontros do círculo
CREATE TABLE public.clube_livro_encontros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ciclo_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  orientacao_encontro TEXT,
  data_encontro TIMESTAMPTZ,
  link_ao_vivo TEXT,
  replay_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clube_livro_ciclos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_livro_fases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_livro_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_livro_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_livro_escutas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_livro_encontros ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Ciclos
CREATE POLICY "Ciclos publicados visíveis para autenticados"
ON public.clube_livro_ciclos FOR SELECT
TO authenticated
USING (publicado = true AND ativo = true);

CREATE POLICY "Admin gerencia ciclos"
ON public.clube_livro_ciclos FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies - Fases
CREATE POLICY "Fases visíveis para autenticados"
ON public.clube_livro_fases FOR SELECT
TO authenticated
USING (ativo = true);

CREATE POLICY "Admin gerencia fases"
ON public.clube_livro_fases FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies - Perguntas
CREATE POLICY "Perguntas visíveis para autenticados"
ON public.clube_livro_perguntas FOR SELECT
TO authenticated
USING (ativo = true);

CREATE POLICY "Admin gerencia perguntas"
ON public.clube_livro_perguntas FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies - Respostas (privadas por usuária)
CREATE POLICY "Usuária vê próprias respostas"
ON public.clube_livro_respostas FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuária cria próprias respostas"
ON public.clube_livro_respostas FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuária atualiza próprias respostas"
ON public.clube_livro_respostas FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin vê todas respostas"
ON public.clube_livro_respostas FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies - Escutas
CREATE POLICY "Escutas visíveis para autenticados"
ON public.clube_livro_escutas FOR SELECT
TO authenticated
USING (ativo = true);

CREATE POLICY "Admin gerencia escutas"
ON public.clube_livro_escutas FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies - Encontros
CREATE POLICY "Encontros visíveis para autenticados"
ON public.clube_livro_encontros FOR SELECT
TO authenticated
USING (ativo = true);

CREATE POLICY "Admin gerencia encontros"
ON public.clube_livro_encontros FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Indexes
CREATE INDEX idx_clube_ciclos_ativo ON public.clube_livro_ciclos(ativo, publicado);
CREATE INDEX idx_clube_fases_ciclo ON public.clube_livro_fases(ciclo_id);
CREATE INDEX idx_clube_perguntas_fase ON public.clube_livro_perguntas(fase_id);
CREATE INDEX idx_clube_respostas_user ON public.clube_livro_respostas(user_id);
CREATE INDEX idx_clube_respostas_ciclo ON public.clube_livro_respostas(ciclo_id);
CREATE INDEX idx_clube_escutas_ciclo ON public.clube_livro_escutas(ciclo_id);
CREATE INDEX idx_clube_encontros_ciclo ON public.clube_livro_encontros(ciclo_id);

-- Triggers
CREATE TRIGGER update_clube_ciclos_updated_at
BEFORE UPDATE ON public.clube_livro_ciclos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clube_fases_updated_at
BEFORE UPDATE ON public.clube_livro_fases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clube_respostas_updated_at
BEFORE UPDATE ON public.clube_livro_respostas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clube_encontros_updated_at
BEFORE UPDATE ON public.clube_livro_encontros
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();