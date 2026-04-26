-- 1. CRIAR NOVAS TABELAS

CREATE TABLE public.clube_v2_obras (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    autor TEXT,
    descricao TEXT,
    capa_url TEXT,
    metadados JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clube_v2_ciclos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    obra_id UUID REFERENCES public.clube_v2_obras(id),
    titulo TEXT NOT NULL,
    subtitulo TEXT,
    descricao TEXT,
    status TEXT DEFAULT 'ativo',
    data_inicio DATE,
    data_fim DATE,
    configuracoes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clube_v2_portais (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ciclo_id UUID REFERENCES public.clube_v2_ciclos(id),
    titulo TEXT NOT NULL,
    descricao TEXT,
    ordem INTEGER DEFAULT 0,
    configuracoes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clube_v2_conteudos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    portal_id UUID REFERENCES public.clube_v2_portais(id),
    ciclo_id UUID REFERENCES public.clube_v2_ciclos(id),
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    conteudo_html TEXT,
    media_url TEXT,
    media_type TEXT,
    ordem INTEGER DEFAULT 0,
    dados_dinamicos JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clube_v2_encontros (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ciclo_id UUID REFERENCES public.clube_v2_ciclos(id),
    titulo TEXT NOT NULL,
    descricao TEXT,
    data_hora TIMESTAMP WITH TIME ZONE,
    link_reuniao TEXT,
    link_gravacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clube_v2_ferramentas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descricao TEXT,
    config_ia JSONB DEFAULT '{}'::jsonb,
    ativa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clube_v2_registros_usuario (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    entidade_tipo TEXT NOT NULL,
    entidade_id UUID NOT NULL,
    tipo_registro TEXT NOT NULL,
    valor JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. RLS
ALTER TABLE public.clube_v2_obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v2_ciclos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v2_portais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v2_conteudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v2_encontros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v2_ferramentas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v2_registros_usuario ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS
CREATE POLICY "Leitura pública v2_obras" ON public.clube_v2_obras FOR SELECT USING (true);
CREATE POLICY "Leitura pública v2_ciclos" ON public.clube_v2_ciclos FOR SELECT USING (true);
CREATE POLICY "Leitura pública v2_portais" ON public.clube_v2_portais FOR SELECT USING (true);
CREATE POLICY "Leitura pública v2_conteudos" ON public.clube_v2_conteudos FOR SELECT USING (true);
CREATE POLICY "Leitura pública v2_encontros" ON public.clube_v2_encontros FOR SELECT USING (true);
CREATE POLICY "Leitura pública v2_ferramentas" ON public.clube_v2_ferramentas FOR SELECT USING (true);
CREATE POLICY "Usuários v2_registros" ON public.clube_v2_registros_usuario FOR ALL USING (auth.uid() = user_id);

-- 4. MIGRAÇÃO

-- Obras
INSERT INTO public.clube_v2_obras (titulo, autor, capa_url)
SELECT DISTINCT titulo, autor_livro, capa_url FROM public.clube_livro_ciclos;

-- Ciclos
INSERT INTO public.clube_v2_ciclos (obra_id, titulo, subtitulo, descricao, configuracoes)
SELECT o.id, c.titulo, c.subtitulo, c.manifesto, 
       jsonb_build_object('ordem', c.ordem, 'ativo', c.ativo, 'por_que_este_livro', c.por_que_este_livro, 'como_ler', c.como_ler)
FROM public.clube_livro_ciclos c
JOIN public.clube_v2_obras o ON o.titulo = c.titulo;

-- Portais
INSERT INTO public.clube_v2_portais (ciclo_id, titulo, descricao, ordem)
SELECT nc.id, p.titulo, p.descricao, p.ordem
FROM public.clube_livro_portas p
JOIN public.clube_livro_ciclos lc ON p.ciclo_id = lc.id
JOIN public.clube_v2_ciclos nc ON nc.titulo = lc.titulo;

-- Conteúdos (Aulas)
INSERT INTO public.clube_v2_conteudos (portal_id, ciclo_id, tipo, titulo, descricao, conteudo_html, media_url, media_type, ordem)
SELECT np.id, nc.id, 'aula', a.titulo, a.descricao, a.conteudo, a.media_url, a.media_type, a.ordem
FROM public.clube_livro_aulas a
JOIN public.clube_livro_portas lp ON a.porta_id = lp.id
JOIN public.clube_v2_portais np ON np.titulo = lp.titulo
JOIN public.clube_v2_ciclos nc ON np.ciclo_id = nc.id;

-- Conteúdo Semanal
INSERT INTO public.clube_v2_conteudos (ciclo_id, tipo, titulo, descricao, dados_dinamicos, ordem)
SELECT nc.id, 'semanal', cs.podcast_titulo, cs.podcast_descricao, 
       jsonb_build_object(
           'semana_numero', cs.semana_numero,
           'podcast_audio_url', cs.podcast_audio_url,
           'carta_nome', cs.carta_nome,
           'carta_imagem_url', cs.carta_imagem_url,
           'pergunta_contemplativa', cs.pergunta_contemplativa,
           'pratica_titulo', cs.pratica_titulo,
           'jardim_prompt', cs.jardim_prompt,
           'treinamento_simulacao', cs.treinamento_simulacao
       ), cs.semana_numero
FROM public.clube_conteudo_semanal cs
JOIN public.clube_livro_ciclos lc ON cs.ciclo_id = lc.id
JOIN public.clube_v2_ciclos nc ON nc.titulo = lc.titulo;

-- Encontros
INSERT INTO public.clube_v2_encontros (ciclo_id, titulo, descricao, data_hora, link_reuniao, link_gravacao)
SELECT nc.id, e.titulo, e.descricao, e.data_encontro::timestamp with time zone, e.link_ao_vivo, e.replay_url
FROM public.clube_livro_encontros e
JOIN public.clube_livro_ciclos lc ON e.ciclo_id = lc.id
JOIN public.clube_v2_ciclos nc ON nc.titulo = lc.titulo;

-- 5. TRIGGERS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clube_v2_obras_updated_at BEFORE UPDATE ON public.clube_v2_obras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clube_v2_ciclos_updated_at BEFORE UPDATE ON public.clube_v2_ciclos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clube_v2_portais_updated_at BEFORE UPDATE ON public.clube_v2_portais FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clube_v2_conteudos_updated_at BEFORE UPDATE ON public.clube_v2_conteudos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clube_v2_encontros_updated_at BEFORE UPDATE ON public.clube_v2_encontros FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clube_v2_ferramentas_updated_at BEFORE UPDATE ON public.clube_v2_ferramentas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clube_v2_registros_usuario_updated_at BEFORE UPDATE ON public.clube_v2_registros_usuario FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
