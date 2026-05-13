CREATE OR REPLACE FUNCTION public.process_webhook_subscription(
    _user_id uuid,
    _provider text,
    _plan_id text, -- Rockty Offer ID quando provider = 'rockty'
    _status text,
    _portal text, -- Parametro legado (Mapping terá precedência)
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
  _mapping record;
  _resolved_plan_id text;
  _resolved_portal text;
  _resolved_start_date timestamp with time zone;
  _resolved_end_date timestamp with time zone;
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

    _resolved_plan_id := _mapping.internal_plan_id;
    _resolved_portal := _mapping.portal_destino;
    
    -- Cálculo de datas Rockty
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

  -- 3. Upsert Subscription (Compatibilidade temporária com constraint UNIQUE(user_id, provider))
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

  -- 4. Sync Profiles
  UPDATE profiles SET
    portal = _resolved_portal::portal_type,
    subscription_status = _subscription_status_profile,
    access_expires_at = CASE WHEN _status = 'active' THEN NULL ELSE access_expires_at END,
    nome = COALESCE(_customer_name, nome),
    updated_at = now()
  WHERE id = _user_id;

  -- 5. Sync User Roles
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
$function$;