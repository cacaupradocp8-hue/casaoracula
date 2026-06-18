DO $$
DECLARE
  fn text;
  fns text[] := ARRAY[
    'accept_client_invitation',
    'validar_e_ativar_convite',
    'activate_subscription',
    'activate_fundadora_plan',
    'activate_mentoria_plan',
    'cancel_subscription',
    'check_and_expire_access',
    'refresh_student_progress',
    'log_automation_simulation',
    'update_cidadela_from_session',
    'upsert_pattern_stat',
    'refresh_upsell_opportunities',
    'get_case_quota',
    'oraculo_portal_pode_publicar'
  ];
  r record;
BEGIN
  FOREACH fn IN ARRAY fns LOOP
    FOR r IN
      SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public' AND p.proname = fn
    LOOP
      EXECUTE format('GRANT EXECUTE ON FUNCTION %I.%I(%s) TO authenticated',
                     r.nspname, r.proname, r.args);
    END LOOP;
  END LOOP;
END $$;