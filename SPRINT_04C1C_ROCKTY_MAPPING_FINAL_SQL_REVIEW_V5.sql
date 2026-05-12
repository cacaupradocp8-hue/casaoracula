-- ==============================================================================
-- SPRINT_04C1C_ROCKTY_MAPPING_FINAL_SQL_REVIEW_V5.sql
-- ==============================================================================
-- STATUS: APENAS PARA REVISÃO (NÃO EXECUTAR)
-- DESCRIÇÃO: Implementação final do mapeamento Rockty e tratamento de pendências.
-- VERSÃO: V5 (Correção de bloqueadores V4 e diagnóstico de schema)
-- ==============================================================================

/*
DIAGNÓSTICO PRÉ-MIGRATION (Confirmado via leitura do banco):
1. Schema user_roles:
   - Colunas: id (uuid), user_id (uuid, UNIQUE), portal (portal_type).
   - Coluna 'role': NÃO EXISTE. Upsert deve focar apenas no 'portal'.
   - Trigger 'handle_new_user' já cria a linha inicial como 'visitante' no signup.

2. Triggers auth.users:
   - 1º handle_new_user (Garante que profile/user_roles existam).
   - 2º apply_pending_matricula (Consome pendências e atualiza portal).
   - Ordem segura confirmada.

3. rockty-webhook (Edge Function):
   - Envia payload.plan_id como _plan_id para o RPC process_webhook_subscription.
   - Atualmente não preenche external_subscription_id em matriculas_pendentes (apenas transaction_id).
   - Alteração na Edge Function será necessária para preencher as novas colunas.
*/

BEGIN;

-- 1. BACKUP DAS FUNÇÕES AFETADAS (Assinatura completa para segurança)
CREATE TABLE IF NOT EXISTS public._sprint_04c1c_function_backup (
    id SERIAL PRIMARY KEY,
    function_name TEXT,
    definition TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

INSERT INTO public._sprint_04c1c_function_backup (function_name, definition)
SELECT 'apply_pending_matricula', pg_get_functiondef(to_regprocedure('public.apply_pending_matricula()'));

INSERT INTO public._sprint_04c1c_function_backup (function_name, definition)
SELECT 'process_webhook_subscription', pg_get_functiondef(to_regprocedure('public.process_webhook_subscription(uuid, text, text, text, text, text, timestamptz, timestamptz, timestamptz, text, text)'));

-- 2. AJUSTE NO SCHEMA DE MATRICULAS_PENDENTES (Caso ainda não existam)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas_pendentes' AND column_name = 'external_subscription_id') THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN external_subscription_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas_pendentes' AND column_name = 'rockty_offer_id') THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN rockty_offer_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas_pendentes' AND column_name = 'plan_id') THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN plan_id TEXT;
    END IF;
END $$;

-- 3. TABELA DE MAPEAMENTO ROCKTY (Caso não exista)
CREATE TABLE IF NOT EXISTS public.rockty_offer_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rockty_offer_id TEXT UNIQUE NOT NULL,
    internal_plan_id TEXT NOT NULL REFERENCES public.plans(id),
    target_portal portal_type NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. ATUALIZAÇÃO DA FUNÇÃO apply_pending_matricula (Com proteção e Exception)
CREATE OR REPLACE FUNCTION public.apply_pending_matricula()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  pending RECORD;
  _log_msg TEXT;
BEGIN
  -- Tenta encontrar pendência
  SELECT * INTO pending
  FROM public.matriculas_pendentes
  WHERE email = NEW.email
    AND processado = false
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    BEGIN
      -- 1. Cria matrícula (usa mapping se disponível)
      INSERT INTO public.matriculas (user_id, curso_id, ativa, data_inicio)
      VALUES (NEW.id, COALESCE(pending.rockty_offer_id, pending.curso_id), true, now())
      ON CONFLICT (user_id, curso_id) DO UPDATE SET ativa = true;

      -- 2. Sincroniza portal em user_roles (DERIVADO)
      INSERT INTO public.user_roles (user_id, portal)
      VALUES (NEW.id, pending.portal_destino)
      ON CONFLICT (user_id) DO UPDATE SET portal = EXCLUDED.portal;

      -- 3. Sincroniza portal em profiles (DERIVADO)
      UPDATE public.profiles
      SET portal = pending.portal_destino,
          updated_at = now()
      WHERE id = NEW.id;

      -- 4. Marca como processado
      UPDATE public.matriculas_pendentes
      SET processado = true, 
          updated_at = now(),
          user_id = NEW.id  -- Vincula para rastreabilidade
      WHERE id = pending.id;

    EXCEPTION WHEN OTHERS THEN
      -- NUNCA TRAVA O SIGNUP. Registra erro no log e segue.
      GET STACKED DIAGNOSTICS _log_msg = MESSAGE_TEXT;
      
      INSERT INTO public.webhook_logs (provider, event_type, payload, processed, error)
      VALUES ('system', 'apply_pending_error', 
              jsonb_build_object('user_id', NEW.id, 'email', NEW.email, 'pending_id', pending.id), 
              false, _log_msg);
              
      UPDATE public.matriculas_pendentes
      SET processing_status = 'error',
          error_message = _log_msg,
          updated_at = now()
      WHERE id = pending.id;
    END;
  END IF;

  RETURN NEW;
END;
$function$;

-- 5. ATUALIZAÇÃO DA FUNÇÃO process_webhook_subscription (Com Mapping e Segurança)
CREATE OR REPLACE FUNCTION public.process_webhook_subscription(
    _user_id uuid, 
    _provider text, 
    _plan_id text, -- Pode vir Rockty Offer ID aqui
    _status text, 
    _portal text, 
    _subscription_status_profile text, 
    _current_period_start timestamp with time zone, 
    _current_period_end timestamp with time zone, 
    _next_billing_date timestamp with time zone, 
    _external_subscription_id text, 
    _customer_name text DEFAULT NULL::text
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _sub_id uuid;
  _result jsonb;
  _internal_plan_id text;
  _target_portal portal_type;
  _existing_user_id uuid;
BEGIN
  -- SEGURANÇA: Verifica se o external_subscription_id já pertence a outro usuário
  IF _external_subscription_id IS NOT NULL THEN
      SELECT user_id INTO _existing_user_id 
      FROM public.subscriptions 
      WHERE external_subscription_id = _external_subscription_id 
      LIMIT 1;

      IF _existing_user_id IS NOT NULL AND _existing_user_id <> _user_id THEN
          RETURN jsonb_build_object(
              'success', false,
              'error', 'Subscription belongs to another user',
              'existing_user_id', _existing_user_id
          );
      END IF;
  END IF;

  -- MAPEAMENTO: Resolve Rockty Offer ID -> Internal Plan ID
  SELECT internal_plan_id, target_portal INTO _internal_plan_id, _target_portal
  FROM public.rockty_offer_mapping
  WHERE rockty_offer_id = _plan_id;

  -- Se não mapeado, mantém o que veio do webhook (retrocompatibilidade)
  IF _internal_plan_id IS NULL THEN
      _internal_plan_id := _plan_id;
      _target_portal := _portal::portal_type;
  END IF;

  -- 1. Upsert Subscription
  INSERT INTO subscriptions (
      user_id, provider, plan_id, status, 
      current_period_start, current_period_end, next_billing_date, 
      external_subscription_id, last_event_at
  )
  VALUES (
      _user_id, _provider, _internal_plan_id, _status, 
      _current_period_start, _current_period_end, _next_billing_date, 
      _external_subscription_id, now()
  )
  ON CONFLICT (user_id, provider) DO UPDATE SET
    plan_id = EXCLUDED.plan_id,
    status = EXCLUDED.status,
    current_period_start = COALESCE(EXCLUDED.current_period_start, subscriptions.current_period_start),
    current_period_end = COALESCE(EXCLUDED.current_period_end, subscriptions.current_period_end),
    next_billing_date = EXCLUDED.next_billing_date,
    external_subscription_id = COALESCE(EXCLUDED.external_subscription_id, subscriptions.external_subscription_id),
    last_event_at = now(),
    updated_at = now()
  RETURNING id INTO _sub_id;

  -- 2. Sincroniza profiles
  UPDATE profiles SET
    portal = _target_portal,
    subscription_status = _subscription_status_profile,
    access_expires_at = CASE WHEN _status = 'active' THEN NULL ELSE access_expires_at END,
    nome = COALESCE(_customer_name, nome),
    updated_at = now()
  WHERE id = _user_id;

  -- 3. Sincroniza user_roles
  INSERT INTO user_roles (user_id, portal)
  VALUES (_user_id, _target_portal)
  ON CONFLICT (user_id) DO UPDATE SET portal = EXCLUDED.portal;

  _result := jsonb_build_object(
    'success', true,
    'subscription_id', _sub_id,
    'plan_id_used', _internal_plan_id,
    'portal_used', _target_portal
  );

  RETURN _result;
END;
$function$;

-- 6. CARGA INICIAL DE MAPEAMENTO (Aprovado em V2/V3)
INSERT INTO public.rockty_offer_mapping (rockty_offer_id, internal_plan_id, target_portal, description)
VALUES 
    ('clube_mensal', 'clube_mensal', 'assinante', 'Assinatura Mensal Clube Oracular'),
    ('clube_anual', 'clube_anual', 'assinante', 'Assinatura Anual Clube Oracular'),
    ('formacao_oracula', 'formacao_oracula', 'aluna', 'Formação Orácula (Portal Aluna)')
ON CONFLICT (rockty_offer_id) DO UPDATE SET
    internal_plan_id = EXCLUDED.internal_plan_id,
    target_portal = EXCLUDED.target_portal;

COMMIT;

-- ==============================================================================
-- BLOCO DE MANUTENÇÃO E BACKFILL (COMENTADO - OPCIONAL)
-- ==============================================================================
/*
BEGIN;
-- Sincronizar matriculas_pendentes legadas com rockty_offer_id
UPDATE public.matriculas_pendentes 
SET rockty_offer_id = curso_id 
WHERE rockty_offer_id IS NULL 
AND curso_id IN ('clube_mensal', 'clube_anual', 'formacao_oracula', 'TEST_UNKNOWN_OFFER');

-- Sincronizar portals divergentes (Exemplo de validação antes de rodar)
-- SELECT p.id, p.portal as profile_portal, r.portal as role_portal
-- FROM profiles p JOIN user_roles r ON p.id = r.user_id WHERE p.portal <> r.portal;

-- Atualização forçada:
-- UPDATE user_roles r SET portal = p.portal FROM profiles p WHERE r.user_id = p.id AND r.portal <> p.portal;
COMMIT;
*/

-- ==============================================================================
-- SCRIPT DE ROLLBACK (DOWN)
-- ==============================================================================
/*
BEGIN;
DO $$ 
DECLARE 
  def_apply TEXT;
  def_webhook TEXT;
BEGIN
  SELECT definition INTO def_apply FROM public._sprint_04c1c_function_backup WHERE function_name = 'apply_pending_matricula' ORDER BY id DESC LIMIT 1;
  IF def_apply IS NOT NULL THEN EXECUTE def_apply; END IF;

  SELECT definition INTO def_webhook FROM public._sprint_04c1c_function_backup WHERE function_name = 'process_webhook_subscription' ORDER BY id DESC LIMIT 1;
  IF def_webhook IS NOT NULL THEN EXECUTE def_webhook; END IF;
END$$;
COMMIT;
*/
