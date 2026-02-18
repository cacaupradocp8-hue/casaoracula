
-- Corrigir política de INSERT da config — exigir autenticação ativa
DROP POLICY IF EXISTS "integracao_config_admin_insert" ON public.clube_livro_integracao_config;

CREATE POLICY "integracao_config_admin_insert" ON public.clube_livro_integracao_config
  FOR INSERT TO authenticated
  WITH CHECK (public.get_user_portal(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "integracao_config_admin_update" ON public.clube_livro_integracao_config;

CREATE POLICY "integracao_config_admin_update" ON public.clube_livro_integracao_config
  FOR UPDATE TO authenticated
  USING (public.get_user_portal(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "integracao_config_admin_delete" ON public.clube_livro_integracao_config;

CREATE POLICY "integracao_config_admin_delete" ON public.clube_livro_integracao_config
  FOR DELETE TO authenticated
  USING (public.get_user_portal(auth.uid()) = 'admin');
