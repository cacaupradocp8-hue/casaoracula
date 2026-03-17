
-- Fix: restrict co_tool_flows admin write policy to use WITH CHECK
DROP POLICY IF EXISTS "Admin can manage flows" ON public.co_tool_flows;
CREATE POLICY "Admin can manage flows" ON public.co_tool_flows
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admin can update flows" ON public.co_tool_flows
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin can delete flows" ON public.co_tool_flows
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
