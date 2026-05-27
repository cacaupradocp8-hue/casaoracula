
-- 1. co_camara_sussurro_casos: drop permissive policy
DROP POLICY IF EXISTS "Allow authenticated users to manage cases" ON public.co_camara_sussurro_casos;

-- 2. upsell_opportunities: restrict to admin
DROP POLICY IF EXISTS "Admins can manage upsell_opportunities" ON public.upsell_opportunities;
CREATE POLICY "Admins can manage upsell_opportunities"
  ON public.upsell_opportunities FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 3. automation_rules: restrict to admin
DROP POLICY IF EXISTS "Admins can manage rules" ON public.automation_rules;
CREATE POLICY "Admins can manage rules"
  ON public.automation_rules FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 4. upsell_rules: restrict to admin
DROP POLICY IF EXISTS "Admins can manage upsell_rules" ON public.upsell_rules;
CREATE POLICY "Admins can manage upsell_rules"
  ON public.upsell_rules FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 5. automation_alerts: SELECT admin-only
DROP POLICY IF EXISTS "Admins can view alerts" ON public.automation_alerts;
CREATE POLICY "Admins can view alerts"
  ON public.automation_alerts FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 6. automation_execution_logs: SELECT admin-only
DROP POLICY IF EXISTS "Admins can view logs" ON public.automation_execution_logs;
CREATE POLICY "Admins can view logs"
  ON public.automation_execution_logs FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 7. _sprint_04c1c_d2a_function_backup: enable RLS, admin-only read
ALTER TABLE public._sprint_04c1c_d2a_function_backup ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read function backup" ON public._sprint_04c1c_d2a_function_backup;
CREATE POLICY "Admins can read function backup"
  ON public._sprint_04c1c_d2a_function_backup FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));
REVOKE ALL ON public._sprint_04c1c_d2a_function_backup FROM anon;

-- 8. rockty_offer_mapping: enable RLS, admin-only read
ALTER TABLE public.rockty_offer_mapping ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read offer mapping" ON public.rockty_offer_mapping;
CREATE POLICY "Admins can read offer mapping"
  ON public.rockty_offer_mapping FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));
REVOKE ALL ON public.rockty_offer_mapping FROM anon;

-- 9. Realtime channel authorization: only allow users to subscribe to their own notification topic
DROP POLICY IF EXISTS "Users can subscribe to their own notification topic" ON realtime.messages;
CREATE POLICY "Users can subscribe to their own notification topic"
  ON realtime.messages FOR SELECT
  TO authenticated
  USING (
    -- Allow only topic that matches the user's own id
    (realtime.topic() = ('notifications:' || auth.uid()::text))
    OR public.is_admin(auth.uid())
  );
