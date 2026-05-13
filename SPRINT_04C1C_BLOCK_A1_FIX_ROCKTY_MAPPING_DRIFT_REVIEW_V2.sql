/*
  SPRINT_04C1C_BLOCK_A1_FIX_ROCKTY_MAPPING_DRIFT_REVIEW_V2.sql

  OBJETIVO:
  Corrigir a divergência (drift) entre o banco de dados e a especificação do Bloco A (V2).
  - Ajustar portais na tabela public.plans (colunas: id, nome, portal_resultante, ativo).
  - Sincronizar public.rockty_offer_mapping (colunas: rockty_offer_id, plan_id, portal_destino, produto_nome, duracao_dias, ativo).

  REGRAS:
  - Não altera funções, triggers ou webhooks.
  - Não toca em assinaturas reais ou usuários.
  - Não faz DELETE amplo.
  - Operação idempotente.
*/

-- =============================================================================
-- 1. ESTADO ATUAL (ANTES)
-- =============================================================================
-- Listar os 3 planos atuais com colunas reais
SELECT 'PLANS_BEFORE' as snapshot, id, nome, portal_resultante, ativo
FROM public.plans
WHERE id IN ('clube_mensal', 'clube_anual', 'formacao_oracula')
ORDER BY id;

-- Listar todo o rockty_offer_mapping atual com colunas reais
SELECT 'MAPPING_BEFORE' as snapshot, rockty_offer_id, plan_id, portal_destino, produto_nome, duracao_dias, ativo
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
-- Não será feito DELETE amplo. Apenas garantimos a atualização/inserção das 4 oficiais.

-- Upsert das 4 ofertas oficiais
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
-- 3. VALIDAÇÃO (DEPOIS)
-- =============================================================================
-- Listar os 3 planos corrigidos
SELECT 'PLANS_AFTER' as snapshot, id, nome, portal_resultante, ativo
FROM public.plans
WHERE id IN ('clube_mensal', 'clube_anual', 'formacao_oracula')
ORDER BY id;

-- Listar as 4 linhas oficiais do mapping
SELECT 'MAPPING_AFTER' as snapshot, rockty_offer_id, plan_id, portal_destino, produto_nome, duracao_dias, ativo
FROM public.rockty_offer_mapping
WHERE rockty_offer_id IN (
    'karv9y4bewbdjcwbmvtwq',
    'mayikrzz0kc58ijeqs9a',
    '2tgmh6vsiki7fg0buxdfxq',
    'qqqmfhyjku7ou9kc70gg'
)
ORDER BY rockty_offer_id;

-- Confirmações finais
SELECT 
    (SELECT COUNT(*) FROM public.rockty_offer_mapping WHERE ativo = true) as total_active_mapping_rows,
    (SELECT COUNT(*) FROM public.rockty_offer_mapping WHERE rockty_offer_id = 'TEST_UNKNOWN_OFFER') as unknown_offer_exists;
