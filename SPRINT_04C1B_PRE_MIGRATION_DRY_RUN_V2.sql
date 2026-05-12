-- SPRINT_04C1B_PRE_MIGRATION_DRY_RUN_V2.sql
-- 
-- Objetivo: Diagnóstico pré-migração Sprint 04C1.
-- Regras: APENAS SELECT. Sem alterações de estado no banco.
-- Matriz Oficial: 
--   karv9y4bewbdjcwbmvtwq -> clube_mensal
--   mayikrzz0kc58ijeqs9a -> clube_mensal
--   2tgmh6vsiki7fg0buxdfxq -> clube_anual
--   qqqmfhyjku7ou9kc70gg -> formacao_oracula

-- 1. Verificação de Integridade Referencial (Plans necessários)
SELECT 
    'PLANS_MISSING' as check_type,
    id as missing_plan_id
FROM (SELECT unnest(ARRAY['clube_mensal', 'clube_anual', 'formacao_oracula']) as id) required_plans
WHERE NOT EXISTS (SELECT 1 FROM public.plans p WHERE p.id = required_plans.id);

-- 2. Diagnóstico de Matriculas Pendentes (Classificação)
WITH classificacao AS (
    SELECT 
        id,
        email,
        curso_id as offer_id,
        CASE 
            WHEN curso_id IN ('karv9y4bewbdjcwbmvtwq', 'mayikrzz0kc58ijeqs9a', '2tgmh6vsiki7fg0buxdfxq', 'qqqmfhyjku7ou9kc70gg') THEN 'OFICIAL_MAPEAVEL'
            WHEN curso_id LIKE 'TEST_%' THEN 'TEST_MODE'
            WHEN curso_id IN ('j7mvkqg0pobcjg458yq0', 'p1j8mzrkwk1b7pveq7za', 'v7z4q6rxn80a9dge3mw1') THEN 'EXTRA_LEGADO'
            ELSE 'DESCONHECIDO'
        END as status_mapeamento
    FROM public.matriculas_pendentes
)
SELECT 
    status_mapeamento,
    COUNT(*),
    json_agg(json_build_object('email', email, 'offer_id', offer_id)) as amostra
FROM classificacao
GROUP BY status_mapeamento;

-- 3. Detalhamento de Conflitos Potenciais em Subscriptions
-- 3.1 Violação da nova Unique (provider, external_subscription_id)
-- Filtramos IDs nulos pois a unique será "WHERE external_subscription_id IS NOT NULL"
SELECT 
    'UNIQUE_EXTERNAL_VIOLATION' as conflict_type,
    provider,
    external_subscription_id,
    COUNT(*),
    json_agg(user_id) as users_involved
FROM public.subscriptions
WHERE external_subscription_id IS NOT NULL
GROUP BY provider, external_subscription_id
HAVING COUNT(*) > 1;

-- 3.2 Violação da nova Unique (user_id, provider, plan_id)
SELECT 
    'UNIQUE_USER_PLAN_VIOLATION' as conflict_type,
    user_id,
    provider,
    plan_id,
    COUNT(*),
    json_agg(id) as subscription_ids
FROM public.subscriptions
GROUP BY user_id, provider, plan_id
HAVING COUNT(*) > 1;

-- 4. Divergências de Portal (Profiles vs User Roles)
SELECT 
    u.email,
    p.user_id,
    p.portal as profile_portal,
    ur.portal as role_portal,
    ur.role,
    p.created_at,
    p.updated_at,
    'DIVERGENTE' as status
FROM public.profiles p
JOIN public.user_roles ur ON p.user_id = ur.user_id
JOIN auth.users u ON p.user_id = u.id
WHERE p.portal::text <> ur.portal::text;

-- 5. Verificação de Webhooks Repetidos (Idempotência)
SELECT 
    'DUPLICATE_WEBHOOK_PAYLOADS' as check_type,
    (payload->>'id') as rockty_id,
    COUNT(*)
FROM public.webhook_logs
WHERE provider = 'rockty'
GROUP BY 1
HAVING COUNT(*) > 1;
