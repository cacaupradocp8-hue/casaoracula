-- SPRINT_04C1B_PRE_MIGRATION_DRY_RUN.sql
-- Objetivo: Diagnóstico de dados antes da execução do Plano V3.2
-- Apenas comandos SELECT. Sem alterações no banco.

-- 1. Verificar se IDs de planos existem na tabela plans
SELECT id, portal FROM public.plans 
WHERE id IN ('clube_mensal', 'clube_anual', 'formacao_oracula');

-- 2. Pendências atuais em matriculas_pendentes
SELECT id, email, curso_id, portal_destino, produto_rockty as offer_id_atual, processado, created_at
FROM public.matriculas_pendentes
WHERE processado = false;

-- 3. Pendências com offer_id (produto_rockty) mapeável vs desconhecido
-- Mapeáveis: karv9y4bewbdjcwbmvtwq, mayikrzz0kc58ijeqs9a, j7mvkqg0pobcjg458yq0, p1j8mzrkwk1b7pveq7za, v7z4q6rxn80a9dge3mw1
SELECT 
  produto_rockty as offer_id,
  COUNT(*) as total,
  CASE 
    WHEN produto_rockty IN ('karv9y4bewbdjcwbmvtwq', 'mayikrzz0kc58ijeqs9a', 'j7mvkqg0pobcjg458yq0', 'p1j8mzrkwk1b7pveq7za', 'v7z4q6rxn80a9dge3mw1') THEN 'MAPEÁVEL'
    WHEN produto_rockty LIKE 'TEST_%' THEN 'TESTE'
    ELSE 'DESCONHECIDO'
  END as status_mapeamento
FROM public.matriculas_pendentes
GROUP BY produto_rockty;

-- 4. Verificar pendências TEST_ específicas
SELECT id, email, produto_rockty, created_at
FROM public.matriculas_pendentes
WHERE produto_rockty LIKE 'TEST_%';

-- 5. Detectar possíveis conflitos para UNIQUE(provider, external_subscription_id) WHERE external_subscription_id IS NOT NULL
SELECT provider, external_subscription_id, COUNT(*) as duplicatas
FROM public.subscriptions
WHERE external_subscription_id IS NOT NULL
GROUP BY provider, external_subscription_id
HAVING COUNT(*) > 1;

-- 6. Detectar possíveis conflitos para UNIQUE(user_id, provider, plan_id)
SELECT user_id, provider, plan_id, COUNT(*) as duplicatas
FROM public.subscriptions
GROUP BY user_id, provider, plan_id
HAVING COUNT(*) > 1;

-- 7. Divergências de Portal (profiles vs user_roles)
SELECT 
    p.id as user_id, 
    p.email, 
    p.portal as profile_portal, 
    ur.portal as role_portal,
    p.updated_at
FROM public.profiles p
JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.portal::text <> ur.portal::text;
