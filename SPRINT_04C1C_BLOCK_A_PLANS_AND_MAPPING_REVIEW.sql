-- ==============================================================================
-- SPRINT_04C1C_BLOCK_A_PLANS_AND_MAPPING_REVIEW.sql
-- ==============================================================================
-- STATUS: APENAS PARA REVISÃO (NÃO EXECUTAR)
-- ESCOPO: BLOCO A - Infraestrutura de Planos e Mapeamento de Ofertas Rockty
-- VERSÃO: V1 (Matriz Oficial Rockty IDs)
-- ==============================================================================

BEGIN;

-- 1. CRIAÇÃO DE PLANOS AUSENTES (Idempotente)
-- Garante que os IDs internos existam para serem referenciados pelo mapping
INSERT INTO public.plans (id, nome, descricao, portal_resultante, ativo)
VALUES 
    ('clube_mensal', 'Clube Oracular - Mensal', 'Assinatura mensal recorrente via Rockty', 'assinante', true),
    ('clube_anual', 'Clube Oracular - Anual', 'Assinatura anual recorrente via Rockty', 'assinante', true),
    ('formacao_oracula', 'Formação Orácula', 'Acesso completo à Formação Orácula', 'aluna', true)
ON CONFLICT (id) DO UPDATE SET
    portal_resultante = EXCLUDED.portal_resultante,
    ativo = EXCLUDED.ativo;

-- 2. CRIAÇÃO DA TABELA DE MAPEAMENTO ROCKTY
CREATE TABLE IF NOT EXISTS public.rockty_offer_mapping (
    rockty_offer_id TEXT PRIMARY KEY,
    internal_plan_id TEXT NOT NULL REFERENCES public.plans(id),
    portal_destino portal_type NOT NULL,
    produto_nome TEXT,
    duracao_dias INTEGER,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. INSERÇÃO DA MATRIZ OFICIAL (IDs REAIS ROCKTY)
-- Mapeia os hashes da Rockty para nossos planos internos e portais
INSERT INTO public.rockty_offer_mapping (
    rockty_offer_id, 
    internal_plan_id, 
    portal_destino, 
    produto_nome, 
    duracao_dias
)
VALUES 
    -- Clube Mensal
    ('karv9y4bewbdjcwbmvtwq', 'clube_mensal', 'assinante', 'Clube Oracular Mensal (ID 1)', 30),
    ('mayikrzz0kc58ijeqs9a', 'clube_mensal', 'assinante', 'Clube Oracular Mensal (ID 2)', 30),
    
    -- Clube Anual
    ('2tgmh6vsiki7fg0buxdfxq', 'clube_anual', 'assinante', 'Clube Oracular Anual', 365),
    
    -- Formação Orácula
    ('qqqmfhyjku7ou9kc70gg', 'formacao_oracula', 'aluna', 'Formação Orácula', 365)
ON CONFLICT (rockty_offer_id) DO UPDATE SET
    internal_plan_id = EXCLUDED.internal_plan_id,
    portal_destino = EXCLUDED.portal_destino,
    produto_nome = EXCLUDED.produto_nome,
    duracao_dias = EXCLUDED.duracao_dias,
    updated_at = now();

COMMIT;

-- ==============================================================================
-- VALIDAÇÕES PÓS-MIGRATION (SELECTS DE CONFERÊNCIA)
-- ==============================================================================

-- 1. Verificar se os planos internos existem
SELECT id, nome, portal_resultante, ativo 
FROM public.plans 
WHERE id IN ('clube_mensal', 'clube_anual', 'formacao_oracula');

-- 2. Verificar o mapeamento (Deve conter 4 linhas)
SELECT 
    rockty_offer_id, 
    internal_plan_id, 
    portal_destino, 
    duracao_dias, 
    produto_nome
FROM public.rockty_offer_mapping
ORDER BY internal_plan_id;

-- 3. Confirmar que Formação Orácula aponta para portal ALUNA
SELECT rockty_offer_id, internal_plan_id, portal_destino 
FROM public.rockty_offer_mapping 
WHERE internal_plan_id = 'formacao_oracula';

-- 4. Confirmar que TEST_UNKNOWN_OFFER NÃO existe no mapping
-- Se retornar 0 linhas, está correto.
SELECT count(*) as unknown_mapping_count
FROM public.rockty_offer_mapping 
WHERE rockty_offer_id = 'TEST_UNKNOWN_OFFER';
