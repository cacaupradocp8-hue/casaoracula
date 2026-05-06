-- 05_schema_tables_clinico_casa_maquinas.sql
-- Objetivo: Suporte ao Diário Clínico e automações (IA).
-- Comandos: ~10 tabelas.
-- Execução: Requer Bloco 02.
-- Dependências: 02_schema_tables_core.sql
-- Risco: Baixo.
-- Validação: Tabelas 'diario_clinico', 'ai_agents' visíveis.

-- Diário Clínico (Soberano)
CREATE TABLE IF NOT EXISTS public.diario_clinico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data_registro DATE DEFAULT CURRENT_DATE,
    conteudo TEXT,
    humor TEXT,
    insights_ia JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Casa das Máquinas (IA)
CREATE TABLE IF NOT EXISTS public.ai_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    system_prompt TEXT,
    model TEXT DEFAULT 'gpt-4o',
    created_at TIMESTAMPTZ DEFAULT now()
);
