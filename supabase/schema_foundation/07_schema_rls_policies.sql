-- 07_schema_rls_policies.sql (REVISADO V2)
-- Objetivo: Blindagem total do banco com políticas granulares, função de segurança admin estrita e proteção contra autoelevação de privilégios.

-- 1. FUNÇÃO AUXILIAR DE SEGURANÇA (ADMIN CHECK ESTRITO)
-- Verifica role, portal e status de acesso.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
      AND role = 'admin' 
      AND portal = 'admin' 
      AND access_status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v3_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v3_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartografia_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diario_clinico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS: PROFILES (Proteção contra autoelevação)
DO $$ 
BEGIN
    -- SELECT: Usuário vê o próprio, Admin vê todos
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Profiles: user visualiza proprio' AND polrelid = 'public.profiles'::regclass) THEN
        CREATE POLICY "Profiles: user visualiza proprio" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Profiles: admin visualiza todos' AND polrelid = 'public.profiles'::regclass) THEN
        CREATE POLICY "Profiles: admin visualiza todos" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin());
    END IF;

    -- UPDATE/INSERT/DELETE: Apenas Admin (Impede alteração de role/status pelo próprio usuário)
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Profiles: admin gerencia' AND polrelid = 'public.profiles'::regclass) THEN
        CREATE POLICY "Profiles: admin gerencia" ON public.profiles 
            FOR ALL TO authenticated 
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

-- 4. POLÍTICAS: USER ROLES
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Roles: user visualiza proprio' AND polrelid = 'public.user_roles'::regclass) THEN
        CREATE POLICY "Roles: user visualiza proprio" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Roles: admin gerencia todos' AND polrelid = 'public.user_roles'::regclass) THEN
        CREATE POLICY "Roles: admin gerencia todos" ON public.user_roles 
            FOR ALL TO authenticated 
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

-- 5. POLÍTICAS: DIÁRIO CLÍNICO (Soberania e Sem Delete)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Diario: SELECT proprio' AND polrelid = 'public.diario_clinico'::regclass) THEN
        CREATE POLICY "Diario: SELECT proprio" ON public.diario_clinico FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Diario: INSERT proprio' AND polrelid = 'public.diario_clinico'::regclass) THEN
        CREATE POLICY "Diario: INSERT proprio" ON public.diario_clinico FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Diario: UPDATE proprio' AND polrelid = 'public.diario_clinico'::regclass) THEN
        CREATE POLICY "Diario: UPDATE proprio" ON public.diario_clinico FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    -- DELETE não criado conforme diretriz.
END $$;

-- 6. POLÍTICAS: TABELAS ESTRUTURAIS/EDITORIAIS (Leitura Autenticada, Escrita Admin)
DO $$ 
BEGIN
    -- cursos, modulos, aulas
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Editorial: SELECT autenticado' AND polrelid = 'public.cursos'::regclass) THEN
        CREATE POLICY "Editorial: SELECT autenticado" ON public.cursos FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Editorial: admin gerencia" ON public.cursos FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
        
        CREATE POLICY "Editorial Modulos: SELECT autenticado" ON public.modulos FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Editorial Modulos: admin gerencia" ON public.modulos FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
        
        CREATE POLICY "Editorial Aulas: SELECT autenticado" ON public.aulas FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Editorial Aulas: admin gerencia" ON public.aulas FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
    END IF;

    -- clube stations/routes
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Clube: SELECT autenticado' AND polrelid = 'public.clube_v3_stations'::regclass) THEN
        CREATE POLICY "Clube: SELECT autenticado" ON public.clube_v3_stations FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Clube: admin gerencia" ON public.clube_v3_stations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
        
        CREATE POLICY "Clube Routes: SELECT autenticado" ON public.clube_v3_routes FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Clube Routes: admin gerencia" ON public.clube_v3_routes FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
    END IF;

    -- decks/cards/cartografia
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Oraculos: SELECT autenticado' AND polrelid = 'public.decks'::regclass) THEN
        CREATE POLICY "Oraculos: SELECT autenticado" ON public.decks FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Oraculos: admin gerencia" ON public.decks FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
        
        CREATE POLICY "Cards: SELECT autenticado" ON public.cards FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Cards: admin gerencia" ON public.cards FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
        
        CREATE POLICY "Cartografia: SELECT autenticado" ON public.cartografia_cycles FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Cartografia: admin gerencia" ON public.cartografia_cycles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
    END IF;

    -- app_settings
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Settings: SELECT autenticado' AND polrelid = 'public.app_settings'::regclass) THEN
        CREATE POLICY "Settings: SELECT autenticado" ON public.app_settings FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Settings: admin gerencia" ON public.app_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
    END IF;
END $$;

-- 7. POLÍTICAS: AI (ADMIN ONLY)
DO $$ 
BEGIN
    -- ai_global_settings
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'AI Global: admin only' AND polrelid = 'public.ai_global_settings'::regclass) THEN
        CREATE POLICY "AI Global: admin only" ON public.ai_global_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
    END IF;

    -- ai_agents
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'AI Agents: admin only' AND polrelid = 'public.ai_agents'::regclass) THEN
        CREATE POLICY "AI Agents: admin only" ON public.ai_agents FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
    END IF;
END $$;
