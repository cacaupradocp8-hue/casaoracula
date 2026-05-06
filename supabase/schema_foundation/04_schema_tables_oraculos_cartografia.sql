-- 04_schema_tables_oraculos_cartografia.sql
-- Objetivo: Tabelas dos Oráculos (Decks, Cards) e Cartografias Oníricas.
-- Comandos: ~8 tabelas.
-- Execução: Requer Bloco 02.
-- Dependências: 02_schema_tables_core.sql
-- Risco: Baixo.
-- Validação: Tabelas 'decks', 'cards', 'cartografia_cycles' visíveis.

-- Oráculos
CREATE TABLE IF NOT EXISTS public.decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    image_url TEXT,
    meaning_upright TEXT,
    meaning_reversed TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Cartografia
CREATE TABLE IF NOT EXISTS public.cartografia_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);
