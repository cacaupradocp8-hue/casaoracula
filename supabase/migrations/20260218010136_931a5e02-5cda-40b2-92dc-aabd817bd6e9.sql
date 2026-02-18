
-- Corrigir políticas admin_all que usam FOR ALL com USING (true implícito)
-- Substituir por políticas separadas e explícitas

DROP POLICY IF EXISTS "config_admin_all" ON public.portal_junguiano_config;
DROP POLICY IF EXISTS "modulos_admin_all" ON public.portal_junguiano_modulos;
DROP POLICY IF EXISTS "portais_admin_all" ON public.portal_junguiano_portais;

-- Config: admin pode tudo
CREATE POLICY "config_admin_insert" ON public.portal_junguiano_config
  FOR INSERT WITH CHECK (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "config_admin_update" ON public.portal_junguiano_config
  FOR UPDATE USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "config_admin_delete" ON public.portal_junguiano_config
  FOR DELETE USING (public.get_user_portal(auth.uid()) = 'admin');

-- Módulos: admin pode tudo
CREATE POLICY "modulos_admin_insert" ON public.portal_junguiano_modulos
  FOR INSERT WITH CHECK (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "modulos_admin_update" ON public.portal_junguiano_modulos
  FOR UPDATE USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "modulos_admin_delete" ON public.portal_junguiano_modulos
  FOR DELETE USING (public.get_user_portal(auth.uid()) = 'admin');

-- Portais: admin pode tudo
CREATE POLICY "portais_admin_insert" ON public.portal_junguiano_portais
  FOR INSERT WITH CHECK (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "portais_admin_update" ON public.portal_junguiano_portais
  FOR UPDATE USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "portais_admin_delete" ON public.portal_junguiano_portais
  FOR DELETE USING (public.get_user_portal(auth.uid()) = 'admin');
