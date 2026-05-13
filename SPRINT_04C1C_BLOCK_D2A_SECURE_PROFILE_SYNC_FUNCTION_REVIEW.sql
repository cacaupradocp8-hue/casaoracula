-- SPRINT_04C1C_BLOCK_D2A_SECURE_PROFILE_SYNC_FUNCTION_REVIEW.sql
-- Objetivo: Resolver conflito entre webhook e trigger de proteção de perfis via Opção C (Função de Sincronização Segura).
-- Status: APENAS REVISÃO (NÃO EXECUTAR).

BEGIN;

/* 
  1. CRIAÇÃO DA FUNÇÃO DE SINCRONIZAÇÃO DE PERFIL
  - SECURITY DEFINER: Executa com privilégios do criador (owner).
  - Encapsula o bypass de configuração local 'app.system_process'.
*/
CREATE OR REPLACE FUNCTION public.system_sync_profile_access(
    _user_id UUID,
    _portal TEXT,
    _access_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER -- Crítico para bypass da trigger via owner
AS $$
BEGIN
    -- 1. Definir contexto de sistema para bypass da trigger
    PERFORM set_config('app.system_process', 'true', true);
    
    -- 2. Executar o UPDATE
    UPDATE public.profiles
    SET 
        portal = _portal,
        access_expires_at = _access_expires_at,
        updated_at = now()
    WHERE id = _user_id;

    -- 3. Restaurar contexto (segurança redundante)
    PERFORM set_config('app.system_process', 'false', true);
END;
$$;

-- 2. RESTRIÇÃO DE ACESSO À FUNÇÃO
REVOKE ALL ON FUNCTION public.system_sync_profile_access(UUID, TEXT, TIMESTAMP WITH TIME ZONE) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.system_sync_profile_access(UUID, TEXT, TIMESTAMP WITH TIME ZONE) FROM anon;
REVOKE ALL ON FUNCTION public.system_sync_profile_access(UUID, TEXT, TIMESTAMP WITH TIME ZONE) FROM authenticated;

/*
  3. ATUALIZAÇÃO DA TRIGGER FUNCTION DE PROTEÇÃO
  - Adiciona permissão para 'app.system_process' = 'true'.
*/
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Permite se for admin OU se for processo interno identificado
    IF (public.is_admin(auth.uid()) = true) OR (current_setting('app.system_process', true) = 'true') THEN
        RETURN NEW;
    END IF;

    -- Bloqueia alteração de campos sensíveis para usuários comuns
    IF (OLD.portal IS DISTINCT FROM NEW.portal) OR 
       (OLD.access_expires_at IS DISTINCT FROM NEW.access_expires_at) THEN
        RAISE EXCEPTION 'Acesso negado: apenas administradores podem alterar o portal ou data de expiração.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/*
  4. ATUALIZAÇÃO DA FUNÇÃO DE PROCESSAMENTO DE WEBHOOK
  - Substitui UPDATE direto por chamada à system_sync_profile_access.
*/
CREATE OR REPLACE FUNCTION public.process_webhook_subscription(
    _user_id UUID,
    _provider_id TEXT,
    _plan_id TEXT,
    _status TEXT,
    _start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    _end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    _metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _target_portal TEXT;
    _final_plan_id TEXT;
    _resolved_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- 1. Resolução de mapping Rockty (conforme requisito 7)
    SELECT internal_plan_id, portal_slug 
    INTO _final_plan_id, _target_portal
    FROM public.rockty_offer_mapping
    WHERE rockty_plan_id = _plan_id;

    -- Fallback caso não mapeado
    IF _final_plan_id IS NULL THEN
        _final_plan_id := _plan_id;
        _target_portal := 'assinante';
    END IF;

    -- 2. Resolver data de expiração conforme status
    -- Se ativo, expiração é NULL (acesso livre enquanto durar assinatura)
    -- Se cancelado/vencido, assume a data de fim enviada
    _resolved_end_date := CASE WHEN _status = 'active' THEN NULL ELSE _end_date END;

    -- 3. Upsert na tabela de subscriptions (Mantendo constraint unique e on conflict)
    INSERT INTO public.subscriptions (
        user_id, provider_subscription_id, plan_id, status, 
        current_period_start, current_period_end, metadata
    )
    VALUES (
        _user_id, _provider_id, _final_plan_id, _status, 
        _start_date, _end_date, _metadata
    )
    ON CONFLICT (user_id, provider_subscription_id) 
    DO UPDATE SET
        plan_id = EXCLUDED.plan_id,
        status = EXCLUDED.status,
        current_period_start = EXCLUDED.current_period_start,
        current_period_end = EXCLUDED.current_period_end,
        metadata = EXCLUDED.metadata,
        updated_at = now();

    -- 4. Atualizar User Role
    UPDATE public.user_roles
    SET 
        portal = _target_portal,
        updated_at = now()
    WHERE user_id = _user_id;

    -- 5. Sincronizar Profile via função dedicada (Requisito 1 e 4)
    -- Nota: process_webhook_subscription é SECURITY DEFINER e owner das funções,
    -- permitindo a chamada à função restrita system_sync_profile_access.
    PERFORM public.system_sync_profile_access(
        _user_id, 
        _target_portal, 
        _resolved_end_date
    );

END;
$$;

/*
  5. VALIDAÇÕES PÓS-EXECUÇÃO (SELECTS DE CONFERÊNCIA)
*/

-- 1. Confirmar definição da trigger function
SELECT pg_get_functiondef(p.oid) 
FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
WHERE n.nspname = 'public' AND p.proname = 'protect_profile_privileged_fields';

-- 2. Confirmar existência e privilégios da nova função
SELECT proname, prosecdef, proargtypes 
FROM pg_proc 
WHERE proname = 'system_sync_profile_access';

-- 3. Confirmar permissões revogadas (deve retornar vazio para public/anon/authenticated)
SELECT grantee, privilege_type 
FROM information_schema.routine_privileges 
WHERE routine_name = 'system_sync_profile_access' 
AND grantee IN ('PUBLIC', 'anon', 'authenticated');

-- 4. Confirmar que a trigger continua ENABLED
SELECT t.tgname, t.tgenabled 
FROM pg_trigger t 
JOIN pg_class c ON t.tgrelid = c.oid 
WHERE c.relname = 'profiles' AND t.tgname = 'protect_profile_privileged_fields_trigger';

-- 5. Confirmar chamada na process_webhook_subscription
SELECT pg_get_functiondef(p.oid) 
FROM pg_proc p 
WHERE p.proname = 'process_webhook_subscription';

-- 6. Confirmar integridade de outras funções
-- apply_pending_matricula não deve ter sido alterada (comparar com backup se necessário)
-- Webhook/Edge Function não alterados (verificação via hash ou data de modificação no sistema de arquivos)

/*
  6. PLANEJAMENTO DE TESTE: D.TEST-1-RETRY
  
  Objetivo: Repetir fluxo real Rockty (Clube Mensal) com segurança ativa.
  
  Passos:
  1. Identificar usuário de teste.
  2. Simular POST do Webhook Rockty para Clube Mensal.
  3. SEM DISABLE TRIGGER e SEM UPDATE MANUAL.
  
  Validações Esperadas:
  - subscriptions.plan_id = 'clube_mensal' (via mapping).
  - user_roles.portal = 'assinante'.
  - profiles.portal = 'assinante'.
  - status = 'active'.
  - Trigger protect_profile_privileged_fields_trigger bloqueando qualquer UPDATE manual externo.
*/

ROLLBACK; -- SEMPRE ROLLBACK NO MODO REVISÃO
