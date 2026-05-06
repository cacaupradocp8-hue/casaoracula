-- 03_schema_tables_formacao_clube.sql
-- Objetivo: Estrutura acadêmica (Cursos, Aulas) e do Clube.
-- Comandos: ~10 tabelas.
-- Execução: Requer Bloco 02.
-- Dependências: 02_schema_tables_core.sql
-- Risco: Baixo.
-- Validação: Verificar tabelas 'cursos', 'modulos', 'aulas' e 'clube_v3_stations'.

-- Formação
CREATE TABLE IF NOT EXISTS public.cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descricao TEXT,
    thumbnail TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.modulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.aulas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo_id UUID REFERENCES public.modulos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    video_url TEXT,
    conteudo_markdown TEXT,
    ordem INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Clube V3
CREATE TABLE IF NOT EXISTS public.clube_v3_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clube_v3_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
