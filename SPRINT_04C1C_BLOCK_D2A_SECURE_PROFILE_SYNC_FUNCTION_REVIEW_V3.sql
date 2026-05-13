-- SPRINT_04C1C_BLOCK_D2A_SECURE_PROFILE_SYNC_FUNCTION_REVIEW_V3.sql
-- Objetivo: Resolver conflito entre webhook e trigger de proteção de perfis via Opção C (V3 - Segurança Reforçada).
-- Status: APENAS REVISÃO (NÃO EXECUTAR).

BEGIN;

/* 
  1. BACKUP DE SEGURANÇA
  - Armazena as definições atuais das funções que serão modificadas.
*/
CREATE TEMP TABLE function_backups AS
SELECT 
    p.proname, 
    pg_get_functiondef(p.oid) as definition,
    pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname IN ('protect_profile_privileged_fields', 'process_webhook_subscription');

-- Auditoria inicial de permissões da process_webhook_subscription
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.routine_privileges 
WHERE routine_name = 'process_webhook_subscription' 
AND grantee IN ('anon', 'authenticated', 'PUBLIC');

/* 
  2. CRIAÇÃO DA FUNÇÃO DE SINCRONIZAÇÃO DE PERFIL
  - SECURITY DEFINER: Executa com privilégios do owner para bypass da trigger.
  - Encapsula o bypass via 'app.system_process'.
*/
CREATE OR REPLACE FUNCTION public.system_sync_profile_access(
    _user_id UUID,
    _portal TEXT,
    _access_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 1. Ativar contexto de sistema (LOCAL para a transação)
    PERFORM set_config('app.system_process', 'true', true);
    
    -- 2. Executar o UPDATE sincronizado
    UPDATE public.profiles
    SET 
        portal = _portal,
        access_expires_at = _access_expires_at,
        updated_at = now()
    WHERE id = _user_id;

    -- 3. Resetar contexto (redundância de segurança)
    PERFORM set_config('app.system_process', 'false', true);
END;
$$;

-- Revogar execução pública e de papéis não autorizados
REVOKE ALL ON FUNCTION public.system_sync_profile_access(UUID, TEXT, TIMESTAMP WITH TIME ZONE) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.system_sync_profile_access(UUID, TEXT, TIMESTAMP WITH TIME ZONE) FROM anon;
REVOKE ALL ON FUNCTION public.system_sync_profile_access(UUID, TEXT, TIMESTAMP WITH TIME ZONE) FROM authenticated;

/*
  3. ATUALIZAÇÃO DA TRIGGER FUNCTION DE PROTEÇÃO
  - Agora permite alterações quando app.system_process for 'true'.
*/
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Bypass para admins ou processos de sistema autorizados
    IF (public.is_admin(auth.uid()) = true) OR (current_setting('app.system_process', true) = 'true') THEN
        RETURN NEW;
    END IF;

    -- Bloqueio de alteração manual em campos sensíveis
    IF (OLD.portal IS DISTINCT FROM NEW.portal) OR 
       (OLD.access_expires_at IS DISTINCT FROM NEW.access_expires_at) THEN
        RAISE EXCEPTION 'Acesso negado: apenas administradores podem alterar o portal ou data de expiração.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/*
  4. ATUALIZAÇÃO DA FUNÇÃO DE PROCESSAMENTO DE WEBHOOK (V3)
  - Assinatura real corrigida.
  - Mapping Rockty usando plan_id e portal_destino.
  - ON CONFLICT (user_id, provider).
*/
CREATE OR REPLACE FUNCTION public.process_webhook_subscription(
    _user_id UUID,
    _provider TEXT,
    _plan_id TEXT,
    _status TEXT,
    _portal TEXT,
    _subscription_status_profile TEXT,
    _current_period_start TIMESTAMP WITH TIME ZONE,
    _current_period_end TIMESTAMP WITH TIME ZONE,
    _next_billing_date TIMESTAMP WITH TIME ZONE,
    _external_subscription_id TEXT,
    _customer_name TEXT DEFAULT NULL
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
    -- 1. Resolução via rockty_offer_mapping (usando plan_id e portal_destino)
    SELECT plan_id, portal_destino 
    INTO _final_plan_id, _target_portal
    FROM public.rockty_offer_mapping
    WHERE rockty_offer_id = _plan_id; -- _plan_id aqui é o ID da oferta Rockty

    -- Fallback se não mapeado
    IF _final_plan_id IS NULL THEN
        _final_plan_id := _plan_id;
        _target_portal := _portal;
    END IF;

    -- 2. Resolver data de expiração
    _resolved_end_date := CASE WHEN _status = 'active' THEN NULL ELSE _current_period_end END;

    -- 3. Upsert Subscriptions
    INSERT INTO public.subscriptions (
        user_id, 
        provider,
        provider_subscription_id, 
        plan_id, 
        status, 
        current_period_start, 
        current_period_end,
        metadata
    )
    VALUES (
        _user_id, 
        _provider,
        _external_subscription_id, 
        _final_plan_id, 
        _status, 
        _current_period_start, 
        _current_period_end,
        jsonb_build_object('customer_name', _customer_name, 'next_billing_date', _next_billing_date)
    )
    ON CONFLICT (user_id, provider) -- CONSTRAINT: subscriptions_user_provider_unique
    DO UPDATE SET
        provider_subscription_id = EXCLUDED.provider_subscription_id,
        plan_id = EXCLUDED.plan_id,
        status = EXCLUDED.status,
        current_period_start = EXCLUDED.current_period_start,
        current_period_end = EXCLUDED.current_period_end,
        metadata = EXCLUDED.metadata,
        updated_at = now();

    -- 4. Sincronizar User Roles
    UPDATE public.user_roles
    SET 
        portal = _target_portal,
        updated_at = now()
    WHERE user_id = _user_id;

    -- 5. Sincronizar Profile via Função Segura (Caminho Privilegiado)
    PERFORM public.system_sync_profile_access(
        _user_id, 
        _target_portal, 
        _resolved_end_date
    );

END;
$$;

/*
  5. VALIDAÇÕES TÉCNICAS (CONFERÊNCIA)
*/

-- A. Trigger Status (Usando pg_trigger)
SELECT 
    tgname, 
    CASE tgenabled 
        WHEN 'O' THEN 'ENABLED' 
        WHEN 'D' THEN 'DISABLED' 
        ELSE 'OTHER' 
    END as status
FROM pg_trigger t 
JOIN pg_class c ON t.tgrelid = c.oid 
WHERE c.relname = 'profiles' AND t.tgname = 'protect_profile_privileged_fields_trigger';

-- B. Permissões system_sync_profile_access (Deve ser 0 linhas)
SELECT grantee, privilege_type 
FROM information_schema.routine_privileges 
WHERE routine_name = 'system_sync_profile_access' 
AND grantee IN ('PUBLIC', 'anon', 'authenticated');

-- C. Validação de Índices do Bloco C
SELECT indexname 
FROM pg_indexes 
WHERE indexname IN (
    'idx_subscriptions_provider_external_id_unique', 
    'idx_subscriptions_user_provider_plan_unique'
);

-- D. Validação de Lógica process_webhook_subscription
-- Deve conter: system_sync_profile_access, plan_id, portal_destino
-- Não deve conter: internal_plan_id
SELECT 
    CASE WHEN definition LIKE '%system_sync_profile_access%' THEN 'OK: Chama função segura' ELSE 'ERRO: Não chama função segura' END as check_func_call,
    CASE WHEN definition LIKE '%plan_id%' AND definition LIKE '%portal_destino%' THEN 'OK: Usa colunas corretas' ELSE 'ERRO: Colunas de mapping erradas' END as check_columns,
    CASE WHEN definition NOT LIKE '%internal_plan_id%' THEN 'OK: Não usa legacy id' ELSE 'ERRO: Usa internal_plan_id' END as check_legacy
FROM (SELECT pg_get_functiondef(p.oid) as definition FROM pg_proc p WHERE p.proname = 'process_webhook_subscription') s;

-- E. Audit Grant process_webhook_subscription
SELECT grantee, privilege_type 
FROM information_schema.routine_privileges 
WHERE routine_name = 'process_webhook_subscription';

-- F. Confirmar que constraints não foram tocadas
SELECT conname FROM pg_constraint WHERE conname = 'subscriptions_user_provider_unique';

ROLLBACK; -- MODO REVISÃO
