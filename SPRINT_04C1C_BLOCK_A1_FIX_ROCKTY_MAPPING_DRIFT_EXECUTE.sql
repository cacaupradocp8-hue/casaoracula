/*
  SPRINT_04C1C_BLOCK_A1_FIX_ROCKTY_MAPPING_DRIFT_EXECUTE.sql

  OBJETIVO:
  Executar a correção definitiva da divergência (drift) do Bloco A.
  - Ajustar portais na tabela public.plans.
  - Sincronizar public.rockty_offer_mapping com a matriz oficial de 4 ofertas.

  REGRAS:
  - Não altera funções, triggers ou webhooks.
  - Não toca em assinaturas reais, usuários ou pendências.
  - Não faz DELETE amplo.
  - Operação idempotente.
*/

-- =============================================================================
-- 1. ESTADO ATUAL (ANTES)
-- =============================================================================
SELECT 'PLANS_BEFORE' as snapshot, id, nome, portal_resultante, ativo
FROM public.plans
WHERE id IN ('clube_mensal', 'clube_anual', 'formacao_oracula')
ORDER BY id;

SELECT 'OFFICIAL_MAPPING_BEFORE' as snapshot, rockty_offer_id, plan_id, portal_destino, produto_nome, duracao_dias, ativo
FROM public.rockty_offer_mapping
WHERE rockty_offer_id IN (
    'karv9y4bewbdjcwbmvtwq',
    'mayikrzz0kc58ijeqs9a',
    '2tgmh6vsiki7fg0buxdfxq',
    'qqqmfhyjku7ou9kc70gg'
)
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

-- B. Sincronizar Rockty Offer Mapping (Upsert da Matriz Oficial)
INSERT INTO public.rockty_offer_mapping (rockty_offer_id, plan_id, portal_destino, produto_nome, duracao_dias, ativo)
VALUES 
    ('karv9y4bewbdjcwbmvtwq', 'clube_mensal', 'assinante', 'Clube Oráculo (Mensal)', 30, true),
    ('mayikrzz0kc58ijeqs9a', 'clube_mensal', 'assinante', 'Clube Oráculo (Mensal)', 30, true),
    ('2tgmh6vsiki7fg0buxdfxq', 'clube_anual', 'assinante', 'Clube Oráculo (Anual)', 365, true),
    ('qqqmfhyjku7ou9kc70gg', 'formacao_oracula', 'aluna', 'Formação Oráculo', 365, true)
ON CONFLICT (rockty_offer_id) DO UPDATE 
SET plan_id = EXCLUDED.plan_id,
    portal_destino = EXCLUDED.portal_destino,
    produto_nome = EXCLUDED.produto_nome,
    duracao_dias = EXCLUDED.duracao_dias,
    ativo = EXCLUDED.ativo,
    updated_at = now();

COMMIT;

-- =============================================================================
-- 3. VALIDAÇÕES FINAIS (DEPOIS)
-- =============================================================================

-- A) Listar os 3 plans corrigidos
SELECT 'PLANS_AFTER' as snapshot, id, nome, portal_resultante, ativo
FROM public.plans
WHERE id IN ('clube_mensal', 'clube_anual', 'formacao_oracula')
ORDER BY id;

-- B) Listar as 4 linhas oficiais corrigidas
SELECT 'OFFICIAL_MAPPING_AFTER' as snapshot, rockty_offer_id, plan_id, portal_destino, produto_nome, duracao_dias, ativo
FROM public.rockty_offer_mapping
WHERE rockty_offer_id IN (
  'karv9y4bewbdjcwbmvtwq',
  'mayikrzz0kc58ijeqs9a',
  '2tgmh6vsiki7fg0buxdfxq',
  'qqqmfhyjku7ou9kc70gg'
)
ORDER BY rockty_offer_id;

-- C) Confirmar official_mapping_count = 4
SELECT COUNT(*) AS official_mapping_count
FROM public.rockty_offer_mapping
WHERE rockty_offer_id IN (
  'karv9y4bewbdjcwbmvtwq',
  'mayikrzz0kc58ijeqs9a',
  '2tgmh6vsiki7fg0buxdfxq',
  'qqqmfhyjku7ou9kc70gg'
);

-- D) Confirmar TEST_UNKNOWN_OFFER ausente
SELECT COUNT(*) AS unknown_offer_exists
FROM public.rockty_offer_mapping
WHERE rockty_offer_id = 'TEST_UNKNOWN_OFFER';

-- E) Listar mappings extras (apenas auditoria)
SELECT 'EXTRA_MAPPINGS' as snapshot, rockty_offer_id, plan_id, portal_destino, ativo
FROM public.rockty_offer_mapping
WHERE rockty_offer_id NOT IN (
  'karv9y4bewbdjcwbmvtwq',
  'mayikrzz0kc58ijeqs9a',
  '2tgmh6vsiki7fg0buxdfxq',
  'qqqmfhyjku7ou9kc70gg'
)
ORDER BY rockty_offer_id;
