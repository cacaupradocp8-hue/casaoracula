
-- ============================================
-- ESTÚDIO ORACULAR - Tabelas
-- ============================================

-- 1) Blocos base do método
CREATE TABLE public.studio_method_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  instrucao TEXT NOT NULL DEFAULT '',
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.studio_method_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access on studio_method_blocks"
  ON public.studio_method_blocks FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated can read active studio_method_blocks"
  ON public.studio_method_blocks FOR SELECT
  TO authenticated
  USING (ativo = true);

-- 2) Eixos do método
CREATE TABLE public.studio_method_axes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  instrucao_especifica TEXT NOT NULL DEFAULT '',
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.studio_method_axes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access on studio_method_axes"
  ON public.studio_method_axes FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated can read active studio_method_axes"
  ON public.studio_method_axes FOR SELECT
  TO authenticated
  USING (ativo = true);

-- 3) Episódios
CREATE TYPE public.studio_episode_status AS ENUM ('draft', 'published');
CREATE TYPE public.studio_episode_visibility AS ENUM ('exclusive', 'public', 'public_full');

CREATE TABLE public.studio_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livro TEXT NOT NULL,
  capitulo TEXT NOT NULL DEFAULT '',
  eixo_id UUID REFERENCES public.studio_method_axes(id) ON DELETE SET NULL,
  texto_base TEXT NOT NULL DEFAULT '',
  intencao_terapeutica TEXT NOT NULL DEFAULT '',
  visibility public.studio_episode_visibility NOT NULL DEFAULT 'exclusive',
  status public.studio_episode_status NOT NULL DEFAULT 'draft',
  
  -- Conteúdo gerado
  roteiro_completo TEXT,
  versao_resumida TEXT,
  
  -- Áudio
  voz_escolhida TEXT DEFAULT 'suave',
  audio_full_url TEXT,
  audio_public_url TEXT,
  
  -- Metadata
  titulo TEXT,
  descricao TEXT,
  duracao_segundos INT,
  imagem_capa_url TEXT,
  
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.studio_episodes ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins full access on studio_episodes"
  ON public.studio_episodes FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Members can read published episodes
CREATE POLICY "Members can read published episodes"
  ON public.studio_episodes FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Anon can read public published episodes (for RSS)
CREATE POLICY "Anon can read public published episodes"
  ON public.studio_episodes FOR SELECT
  TO anon
  USING (status = 'published' AND visibility IN ('public', 'public_full'));

-- Triggers
CREATE TRIGGER update_studio_method_blocks_updated_at
  BEFORE UPDATE ON public.studio_method_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_studio_method_axes_updated_at
  BEFORE UPDATE ON public.studio_method_axes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_studio_episodes_updated_at
  BEFORE UPDATE ON public.studio_episodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
