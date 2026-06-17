
-- ===========================================================
-- SECURITY HARDENING — Address Supabase linter findings:
--  - SUPA_security_definer_view (ensure all views are SECURITY INVOKER)
--  - SUPA_anon_security_definer_function_executable
--  - SUPA_authenticated_security_definer_function_executable (trigger/system-only)
--  - SUPA_public_bucket_allows_listing (drop broad SELECT policy on audios)
-- ===========================================================

-- 1. Ensure ALL public views are SECURITY INVOKER (idempotent)
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT c.relname FROM pg_class c
           JOIN pg_namespace n ON n.oid = c.relnamespace
           WHERE n.nspname = 'public' AND c.relkind IN ('v')
  LOOP
    EXECUTE format('ALTER VIEW public.%I SET (security_invoker = true)', r.relname);
  END LOOP;
END $$;

-- 2. Revoke EXECUTE on ALL SECURITY DEFINER functions in public from anon + PUBLIC.
--    These functions should never be callable by unauthenticated users.
--    Trigger functions also lose authenticated EXECUTE since they are
--    only invoked internally by Postgres, never via the API.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.proname, pg_get_function_identity_arguments(p.oid) AS args,
           t.typname AS rettype
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    JOIN pg_type t ON t.oid = p.prorettype
    WHERE n.nspname = 'public' AND p.prosecdef = true
  LOOP
    -- Always revoke from anon and PUBLIC
    EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%I(%s) FROM PUBLIC, anon',
                   r.proname, r.args);
    -- Trigger functions: also revoke from authenticated (never called via API)
    IF r.rettype = 'trigger' THEN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%I(%s) FROM authenticated',
                     r.proname, r.args);
    END IF;
  END LOOP;
END $$;

-- 3. System-only RPC functions: revoke from authenticated as well.
--    These are called by triggers, edge functions (service_role), or cron — not by clients.
DO $$
DECLARE
  fn text;
  fns text[] := ARRAY[
    'handle_new_user()',
    'apply_pending_matricula()',
    'process_webhook_subscription(uuid,text,text,text,text,text,timestamp with time zone,timestamp with time zone,timestamp with time zone,text,text)',
    'system_sync_profile_access(uuid,portal_type,text,timestamp with time zone,text)',
    'dispatch_notification_channels()',
    'sync_profile_access_status()',
    'enqueue_email(text,jsonb)',
    'delete_email(text,bigint)',
    'read_email_batch(text,integer,integer)',
    'move_to_dlq(text,text,bigint,jsonb)',
    'check_and_expire_access()',
    'close_expired_jardins()',
    'refresh_student_progress(uuid)',
    'log_automation_simulation(text,text,text,text,uuid,jsonb)',
    'upsert_pattern_stat(uuid,pattern_stat_type,text)',
    'update_cidadela_from_session(uuid,uuid,text,text,text,text,text,text,text)',
    'update_cidadela_on_tool_usage(uuid,uuid,uuid)',
    'activate_subscription(uuid)',
    'activate_fundadora_plan(uuid)',
    'activate_mentoria_plan(uuid)',
    'cancel_subscription(uuid)'
  ];
BEGIN
  FOREACH fn IN ARRAY fns LOOP
    BEGIN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%s FROM authenticated', fn);
    EXCEPTION WHEN undefined_function THEN
      -- skip if signature drift
      NULL;
    END;
  END LOOP;
END $$;

-- 4. Public storage bucket listing — drop broad SELECT policy.
--    Files in public buckets remain reachable via direct public URL; listing is removed.
DROP POLICY IF EXISTS "Authenticated users can list audios" ON storage.objects;
