CREATE OR REPLACE FUNCTION public.apply_pending_matricula()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  pending RECORD;
  mapping RECORD;
  v_offer_id TEXT;
  v_error_msg TEXT;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  BEGIN
    -- Find pending enrollment for this email
    SELECT * INTO pending
    FROM public.matriculas_pendentes
    WHERE email = NEW.email
      AND processado = false
    ORDER BY created_at DESC
    LIMIT 1;

    IF FOUND THEN
      -- Resolve offer_id priority
      v_offer_id := COALESCE(pending.rockty_offer_id, pending.produto_rockty, pending.curso_id);

      -- Search mapping in rockty_offer_mapping
      SELECT * INTO mapping
      FROM public.rockty_offer_mapping
      WHERE (rockty_offer_id = v_offer_id OR plan_id = v_offer_id)
        AND ativo = true
      LIMIT 1;

      IF NOT FOUND THEN
        UPDATE public.matriculas_pendentes
        SET 
          processing_status = 'unmapped',
          processing_error = 'Mapping not found for offer_id: ' || COALESCE(v_offer_id, 'NULL'),
          last_attempt_at = now(),
          updated_at = now(),
          rockty_offer_id = v_offer_id
        WHERE id = pending.id;
      ELSE
        -- Create/Update Enrollment
        INSERT INTO public.matriculas (user_id, curso_id, ativa, data_inicio)
        VALUES (NEW.id, mapping.plan_id, true, now())
        ON CONFLICT (user_id, curso_id) DO UPDATE SET ativa = true;

        v_expires_at := now() + (mapping.duracao_dias || ' days')::interval;

        -- Create/Update Subscription
        INSERT INTO public.subscriptions (
          user_id, 
          provider, 
          plan_id, 
          status, 
          external_subscription_id, 
          current_period_start, 
          current_period_end, 
          last_event_at,
          updated_at
        )
        VALUES (
          NEW.id, 
          'rockty', 
          mapping.plan_id, 
          'active', 
          COALESCE(pending.external_subscription_id, pending.transaction_id), 
          now(), 
          v_expires_at, 
          now(),
          now()
        )
        ON CONFLICT (user_id, provider) DO UPDATE SET 
          plan_id = EXCLUDED.plan_id,
          status = EXCLUDED.status,
          external_subscription_id = EXCLUDED.external_subscription_id,
          current_period_end = EXCLUDED.current_period_end,
          last_event_at = EXCLUDED.last_event_at,
          updated_at = EXCLUDED.updated_at;

        -- Update user_roles portal
        UPDATE public.user_roles
        SET portal = mapping.portal_destino
        WHERE user_id = NEW.id;

        -- Sync profile access (system_sync_profile_access)
        PERFORM public.system_sync_profile_access(
          NEW.id, 
          mapping.portal_destino, 
          'active', 
          v_expires_at
        );

        -- Mark pending as processed
        UPDATE public.matriculas_pendentes
        SET 
          processado = true, 
          processing_status = 'processed',
          plan_id = mapping.plan_id,
          rockty_offer_id = v_offer_id,
          processing_error = NULL,
          last_attempt_at = now(),
          updated_at = now()
        WHERE id = pending.id;
      END IF;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Safety catch to never block signup
    GET STACKED DIAGNOSTICS v_error_msg = MESSAGE_TEXT;
    
    IF pending.id IS NOT NULL THEN
      UPDATE public.matriculas_pendentes
      SET 
        processing_status = 'error',
        processing_error = v_error_msg,
        last_attempt_at = now(),
        updated_at = now()
      WHERE id = pending.id;
    END IF;
  END;

  RETURN NEW;
END;
$function$;