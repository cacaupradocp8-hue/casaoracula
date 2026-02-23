
-- Jornadas do Clube do Livro
CREATE TABLE public.clube_jornadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estacao_id UUID NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  nome TEXT NOT NULL,
  subtitulo TEXT,
  descricao TEXT,
  icone TEXT,
  cor TEXT,
  ordem INT NOT NULL DEFAULT 0,
  ativa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(estacao_id, slug)
);

-- Portais do Clube do Livro (8 blocos de conteúdo)
CREATE TABLE public.clube_portais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jornada_id UUID NOT NULL REFERENCES public.clube_jornadas(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  nome TEXT NOT NULL,
  subtitulo TEXT,
  icone TEXT,
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  -- 8 blocos de conteúdo (HTML rico)
  texto_simbolico TEXT,
  essencia_8020 TEXT,
  raiz_psiquica TEXT,
  aplicacao_pessoal TEXT,
  aplicacao_profissional TEXT,
  jardim_psique TEXT,
  jardim_heroina TEXT,
  laboratorio_8020 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(jornada_id, slug)
);

-- RLS
ALTER TABLE public.clube_jornadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_portais ENABLE ROW LEVEL SECURITY;

-- Leitura pública (conteúdo publicado)
CREATE POLICY "Jornadas ativas são visíveis" ON public.clube_jornadas
  FOR SELECT USING (ativa = true);

CREATE POLICY "Portais ativos são visíveis" ON public.clube_portais
  FOR SELECT USING (ativo = true);

-- Admin CRUD
CREATE POLICY "Admin gerencia jornadas" ON public.clube_jornadas
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin gerencia portais" ON public.clube_portais
  FOR ALL USING (public.is_admin(auth.uid()));

-- Triggers updated_at
CREATE TRIGGER update_clube_jornadas_updated_at
  BEFORE UPDATE ON public.clube_jornadas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clube_portais_updated_at
  BEFORE UPDATE ON public.clube_portais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
