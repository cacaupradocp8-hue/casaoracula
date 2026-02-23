
-- ============================================
-- CLUBE DO LIVRO ORACULAR — ESTAÇÕES SIMBÓLICAS
-- Nova estrutura: Estações → Livro-Eixo → Lab 80/20
-- ============================================

-- Tabela principal: Estações Simbólicas
CREATE TABLE public.clube_estacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero INT NOT NULL,
  titulo TEXT NOT NULL,
  subtitulo TEXT NOT NULL,
  fase_lunar TEXT,
  livro_titulo TEXT NOT NULL,
  livro_autor TEXT,
  livro_capa_url TEXT,
  -- Laboratório 80/20 — Bloco 1: Essência
  essencia_nucleo TEXT,
  essencia_tensao TEXT,
  essencia_transformacao TEXT,
  -- Laboratório 80/20 — Bloco 2: Tradução Profissional
  traducao_aula TEXT,
  traducao_sessao TEXT,
  traducao_circulo TEXT,
  -- Laboratório 80/20 — Bloco 3: Aplicação Pessoal
  aplicacao_reflexao TEXT,
  aplicacao_acao TEXT,
  -- Estado
  ativa BOOLEAN DEFAULT false,
  publicada BOOLEAN DEFAULT false,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de registros das usuárias (Bloco 4)
CREATE TABLE public.clube_estacao_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  estacao_id UUID NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
  texto TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clube_estacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_estacao_registros ENABLE ROW LEVEL SECURITY;

-- RLS: Estações visíveis para todos os autenticados (publicadas) + admin vê tudo
CREATE POLICY "Estações publicadas visíveis para autenticados"
  ON public.clube_estacoes FOR SELECT
  USING (publicada = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admin gerencia estações"
  ON public.clube_estacoes FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS: Registros — usuária vê/cria/edita apenas os seus; admin vê tudo
CREATE POLICY "Usuária vê próprios registros"
  ON public.clube_estacao_registros FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Usuária cria próprios registros"
  ON public.clube_estacao_registros FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuária edita próprios registros"
  ON public.clube_estacao_registros FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuária deleta próprios registros"
  ON public.clube_estacao_registros FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger updated_at
CREATE TRIGGER update_clube_estacoes_updated_at
  BEFORE UPDATE ON public.clube_estacoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clube_estacao_registros_updated_at
  BEFORE UPDATE ON public.clube_estacao_registros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
