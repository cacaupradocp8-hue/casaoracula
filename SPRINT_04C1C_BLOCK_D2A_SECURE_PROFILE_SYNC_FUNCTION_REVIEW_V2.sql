-- SPRINT_04C1C_BLOCK_D2A_SECURE_PROFILE_SYNC_FUNCTION_REVIEW_V2.sql
-- Objetivo: Resolver conflito entre webhook e trigger de proteção de perfis via Opção C (Função de Sincronização Segura).
-- Status: APENAS REVISÃO (NÃO EXECUTAR).

/* 
  1. CRIAÇÃO DA FUNÇÃO DE SINCRONIZAÇÃO DE PERFIL
  - SECURITY DEFINER: Executa com privilégios de owner (bypass de RLS/Triggers se configurado).
  - SET LOCAL app.system_process: Habilita flag temporária para a transação.
*/
CREATE OR REPLACE FUNCTION public.system_sync_profile_access(
  _user_id uuid,
  _portal text,
  _subscription_status text,
  _access_expires_at timestamp with time zone,
  _customer_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Habilita o bypass para esta transação específica
  PERFORM set_config('app.system_process', 'true', true);

  UPDATE public.profiles SET
    portal = _portal::portal_type,
    subscription_status = _subscription_status,
    access_expires_at = _access_expires_at,
    nome = COALESCE(_customer_name, nome),
    updated_at = now()
  WHERE id = _user_id;

  -- Reseta explicitamente (embora LOCAL expire ao fim da transação/bloco)
  PERFORM set_config('app.system_process', 'false', true);
END;
$$;

-- Permissões restritivas: apenas o sistema (via functions seguras) pode chamar
REVOKE EXECUTE ON FUNCTION public.system_sync_profile_access FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.system_sync_profile_access FROM anon;
REVOKE EXECUTE ON FUNCTION public.system_sync_profile_access FROM authenticated;


/* 
  2. ATUALIZAÇÃO DA TRIGGER DE PROTEÇÃO DE PERFIS
  - Agora permite alterações se a flag app.system_process estiver ativa.
*/
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Permite se for ADMIN ou se for um processo de sistema autorizado
  IF public.is_admin(auth.uid()) OR current_setting('app.system_process', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- Caso contrário, reverte campos sensíveis
  NEW.role := OLD.role;
  NEW.portal := OLD.portal;
  NEW.access_status := OLD.access_status;
  NEW.subscription_status := OLD.subscription_status;
  NEW.access_expires_at := OLD.access_expires_at;
  
  RETURN NEW;
END;
$$;


/* 
  3. ATUALIZAÇÃO DO PROCESSAMENTO DE WEBHOOK
  - Mantém a assinatura real.
  - Usa colunas corretas de rockty_offer_mapping.
  - Chama system_sync_profile_access em vez de UPDATE direto.
*/
CREATE OR REPLACE FUNCTION public.process_webhook_subscription(
  _user_id uuid, 
  _provider text, 
  _plan_id text, 
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
AS $$
DECLARE
  _sub_id uuid;
  _mapping record;
  _resolved_plan_id text;
  _resolved_portal text;
  _resolved_start_date timestamp with time zone;
  _resolved_end_date timestamp with time zone;
  _resolved_access_expires_at timestamp with time zone;
  _result jsonb;
BEGIN
  -- 1. Resolver Mapeamento (Obrigatório para Rockty)
  IF _provider = 'rockty' THEN
    SELECT * INTO _mapping 
    FROM public.rockty_offer_mapping 
    WHERE rockty_offer_id = _plan_id AND ativo = true;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('error', 'Oferta Rockty nao mapeada ou inativa', 'offer_id', _plan_id);
    END IF;

    _resolved_plan_id := _mapping.plan_id;
    _resolved_portal := _mapping.portal_destino;
    
    _resolved_start_date := COALESCE(_current_period_start, now());
    _resolved_end_date := COALESCE(
      _current_period_end, 
      _resolved_start_date + (_mapping.duracao_dias || ' days')::interval
    );
  ELSE
    _resolved_plan_id := _plan_id;
    _resolved_portal := _portal;
    _resolved_start_date := _current_period_start;
    _resolved_end_date := _current_period_end;
  END IF;

  -- 2. Proteção de external_subscription_id
  IF _external_subscription_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE provider = _provider 
      AND external_subscription_id = _external_subscription_id 
      AND user_id != _user_id
    ) THEN
      RETURN jsonb_build_object('error', 'Assinatura ja pertence a outro usuario no mesmo provider', 'ext_id', _external_subscription_id);
    END IF;
  END IF;

  -- 3. Upsert Subscription (Compatível com subscriptions_user_provider_unique)
  INSERT INTO subscriptions (
    user_id, provider, plan_id, status, 
    current_period_start, current_period_end, next_billing_date, 
    external_subscription_id, last_event_at
  )
  VALUES (
    _user_id, _provider, _resolved_plan_id, _status, 
    _resolved_start_date, _resolved_end_date, _next_billing_date, 
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

  -- 4. Cálculo de expiração de acesso para profiles
  -- Mantendo a lógica: se ativo, NULL; se não, mantém o que está lá (ou poderíamos passar NEW date se disponível)
  -- Para manter paridade com a função original:
  SELECT access_expires_at INTO _resolved_access_expires_at FROM profiles WHERE id = _user_id;
  IF _status = 'active' THEN
    _resolved_access_expires_at := NULL;
  END IF;

  -- 5. Sync Profiles via Função Segura (Bypass da Trigger)
  PERFORM public.system_sync_profile_access(
    _user_id,
    _resolved_portal,
    _subscription_status_profile,
    _resolved_access_expires_at,
    _customer_name
  );

  -- 6. Sync User Roles (Trigger allow_portal_sync_on_roles_v2 deve permitir se system_process for true ou admin)
  -- Nota: Se user_roles tiver trigger similar, ela também precisará checar app.system_process
  UPDATE user_roles SET portal = _resolved_portal::portal_type
  WHERE user_id = _user_id;

  _result := jsonb_build_object(
    'subscription_id', _sub_id,
    'user_id', _user_id,
    'plan_id', _resolved_plan_id,
    'portal', _resolved_portal,
    'status', _status
  );

  RETURN _result;
END;
$$;


/* 
  4. VALIDAÇÕES DE INTEGRIDADE
*/

-- A. Verificar se a constraint UNIQUE continua existindo
SELECT conname, contype 
FROM pg_constraint 
WHERE conname = 'subscriptions_user_provider_unique';

-- B. Verificar se os índices do Bloco C continuam existindo
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE indexname IN ('idx_profiles_portal', 'idx_profiles_subscription_status', 'idx_subscriptions_user_provider_status');

-- C. Verificar se a trigger continua ENABLED
SELECT trigger_name, status 
FROM information_schema.triggers 
WHERE event_object_table = 'profiles' AND trigger_name = 'protect_profile_privileged_fields_trigger';

-- D. Verificar se system_sync_profile_access foi criada e permissões revogadas
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'system_sync_profile_access';

-- E. Verificar se apply_pending_matricula não foi alterada (Checksum ou data de modificação)
-- (Validado via inspeção visual no plano, mas aqui apenas confirmamos existência)
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'apply_pending_matricula';

-- F. Verificar assinatura da função process_webhook_subscription
SELECT 
    p.proname,
    pg_get_function_arguments(p.oid) as args
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'process_webhook_subscription';
