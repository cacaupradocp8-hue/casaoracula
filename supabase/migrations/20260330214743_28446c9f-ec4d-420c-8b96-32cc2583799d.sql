
-- 1. Atomic DB function: single source of truth for subscription activation
-- subscriptions is the authoritative source; profiles and user_roles are derived/synced
CREATE OR REPLACE FUNCTION public.process_webhook_subscription(
  _user_id uuid,
  _provider text,
  _plan_id text,
  _status text,
  _portal text,
  _subscription_status_profile text,
  _current_period_start timestamptz,
  _current_period_end timestamptz,
  _next_billing_date timestamptz,
  _external_subscription_id text,
  _customer_name text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _sub_id uuid;
  _result jsonb;
BEGIN
  -- Step 1: Upsert subscription (SOURCE OF TRUTH)
  INSERT INTO subscriptions (user_id, provider, plan_id, status, current_period_start, current_period_end, next_billing_date, external_subscription_id, last_event_at)
  VALUES (_user_id, _provider, _plan_id, _status, _current_period_start, _current_period_end, _next_billing_date, _external_subscription_id, now())
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

  -- Step 2: Sync profiles (DERIVED from subscription)
  UPDATE profiles SET
    portal = _portal::portal_type,
    subscription_status = _subscription_status_profile,
    access_expires_at = CASE WHEN _status = 'active' THEN NULL ELSE access_expires_at END,
    nome = COALESCE(_customer_name, nome),
    updated_at = now()
  WHERE id = _user_id;

  -- Step 3: Sync user_roles (DERIVED from subscription)
  UPDATE user_roles SET portal = _portal::portal_type
  WHERE user_id = _user_id;

  _result := jsonb_build_object(
    'subscription_id', _sub_id,
    'user_id', _user_id,
    'portal', _portal,
    'status', _status
  );

  RETURN _result;
END;
$$;

-- 2. Fix matriculas_pendentes: add unique constraint on (email, curso_id)
-- First remove duplicates if any
DELETE FROM matriculas_pendentes a
USING matriculas_pendentes b
WHERE a.id > b.id AND a.email = b.email AND a.curso_id = b.curso_id;

ALTER TABLE public.matriculas_pendentes 
  ADD CONSTRAINT matriculas_pendentes_email_curso_unique UNIQUE (email, curso_id);
