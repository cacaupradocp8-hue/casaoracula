# APPLY_PENDING_MATRICULA_CURRENT_BACKUP.md

Este documento contém o backup das definições atuais das funções e triggers que serão alteradas no Plano V3.2.

## 1. Função: `apply_pending_matricula`

```sql
CREATE OR REPLACE FUNCTION public.apply_pending_matricula()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  pending RECORD;
BEGIN
  -- Find pending enrollment for this email
  SELECT * INTO pending
  FROM public.matriculas_pendentes
  WHERE email = NEW.email
    AND processado = false
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    -- Create enrollment
    INSERT INTO public.matriculas (user_id, curso_id, ativa, data_inicio)
    VALUES (NEW.id, pending.curso_id, true, now())
    ON CONFLICT (user_id, curso_id) DO UPDATE SET ativa = true;

    -- Update user portal level
    UPDATE public.user_roles
    SET portal = pending.portal_destino
    WHERE user_id = NEW.id;

    -- Mark pending as processed
    UPDATE public.matriculas_pendentes
    SET processado = true, updated_at = now()
    WHERE id = pending.id;
  END IF;

  RETURN NEW;
END;
$function$;
```

## 2. Trigger: `on_auth_user_created_apply_matricula`

```sql
CREATE TRIGGER on_auth_user_created_apply_matricula 
AFTER INSERT ON auth.users 
FOR EACH ROW EXECUTE FUNCTION apply_pending_matricula();
```

## 3. Função: `process_webhook_subscription`

```sql
CREATE OR REPLACE FUNCTION public.process_webhook_subscription(_user_id uuid, _provider text, _plan_id text, _status text, _portal text, _subscription_status_profile text, _current_period_start timestamp with time zone, _current_period_end timestamp with time zone, _next_billing_date timestamp with time zone, _external_subscription_id text, _customer_name text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;
```

## 4. Viabilidade de Rollback

**O rollback é perfeitamente possível.**
- As definições acima são as originais do sistema.
- Para reverter qualquer alteração da Sprint 04C1, basta executar os blocos SQL contidos neste arquivo.
- O estado dos dados (matriculas e subscriptions) não será corrompido, pois a migração apenas adicionará restrições e mapeamentos, sem deletar volumes de dados históricos.
- Este arquivo deve ser mantido como referência absoluta do estado "Pre-04C1".
