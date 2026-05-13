/*
  SPRINT_04C1C_BLOCK_A1_FIX_ROCKTY_MAPPING_DRIFT_REVIEW.sql

  OBJETIVO:
  Corrigir a divergência (drift) entre o banco de dados e a especificação do Bloco A.
  - Ajustar portais na tabela public.plans.
  - Sincronizar public.rockty_offer_mapping com a matriz oficial de 4 ofertas.

  REGRAS:
  - Não altera funções, triggers ou webhooks.
  - Não toca em assinaturas reais ou usuários.
  - Operação idempotente.
*/

-- =============================================================================
-- 1. ESTADO ATUAL (ANTES)
-- =============================================================================
SELECT 'PLANS_BEFORE' as snapshot, id, portal_resultante, produto_nome
FROM public.plans
WHERE id IN ('clube_mensal', 'clube_anual', 'formacao_oracula')
ORDER BY id;

SELECT 'MAPPING_BEFORE' as snapshot, rockty_offer_id, plan_id, portal_destino, duracao_dias
FROM public.rockty_offer_mapping
ORDER BY rockty_offer_id;

-- =============================================================================
-- 2. CORREÇÃO (DML)
-- =============================================================================
BEGIN;

-- A. Corrigir Portais na tabela Plans
UPDATE public.plans
SET portal_resultante = 'assinante',
    updated_at = now()
WHERE id IN ('clube_mensal', 'clube_anual');

UPDATE public.plans
SET portal_resultante = 'aluna',
    updated_at = now()
WHERE id = 'formacao_oracula';

-- B. Sincronizar Rockty Offer Mapping (Matriz Oficial)
-- Remove ofertas que não deveriam estar no mapping (ex: TEST_UNKNOWN_OFFER)
DELETE FROM public.rockty_offer_mapping
WHERE rockty_offer_id NOT IN (
    'karv9y4bewbdjcwbmvtwq',
    'mayikrzz0kc58ijeqs9a',
    '2tgmh6vsiki7fg0buxdfxq',
    'qqqmfhyjku7ou9kc70gg'
);

-- Upsert das 4 ofertas oficiais
INSERT INTO public.rockty_offer_mapping (rockty_offer_id, plan_id, portal_destino, produto_nome, duracao_dias)
VALUES 
    ('karv9y4bewbdjcwbmvtwq', 'clube_mensal', 'assinante', 'Clube Oráculo (Mensal)', 30),
    ('mayikrzz0kc58ijeqs9a', 'clube_mensal', 'assinante', 'Clube Oráculo (Mensal)', 30),
    ('2tgmh6vsiki7fg0buxdfxq', 'clube_anual', 'assinante', 'Clube Oráculo (Anual)', 365),
    ('qqqmfhyjku7ou9kc70gg', 'formacao_oracula', 'aluna', 'Formação Oráculo', 365)
ON CONFLICT (rockty_offer_id) DO UPDATE 
SET plan_id = EXCLUDED.plan_id,
    portal_destino = EXCLUDED.portal_destino,
    produto_nome = EXCLUDED.produto_nome,
    duracao_dias = EXCLUDED.duracao_dias,
    updated_at = now();

COMMIT;

-- =============================================================================
-- 3. VALIDAÇÃO (DEPOIS)
-- =============================================================================
SELECT 'PLANS_AFTER' as snapshot, id, portal_resultante, produto_nome
FROM public.plans
WHERE id IN ('clube_mensal', 'clube_anual', 'formacao_oracula')
ORDER BY id;

SELECT 'MAPPING_AFTER' as snapshot, rockty_offer_id, plan_id, portal_destino, duracao_dias
FROM public.rockty_offer_mapping
ORDER BY rockty_offer_id;

-- Confirmação de contagem e ausência de ruído
SELECT 
    (SELECT COUNT(*) FROM public.rockty_offer_mapping) as total_mapping_rows,
    (SELECT COUNT(*) FROM public.rockty_offer_mapping WHERE rockty_offer_id = 'TEST_UNKNOWN_OFFER') as unknown_offer_count;
