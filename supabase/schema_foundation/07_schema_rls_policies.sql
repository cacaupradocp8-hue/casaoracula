-- 07_schema_rls_policies.sql (REVISADO)
-- Objetivo: Blindagem total do banco com políticas granulares e função de segurança admin.

-- 1. FUNÇÃO AUXILIAR DE SEGURANÇA (ADMIN CHECK)
-- Definida como SECURITY DEFINER para evitar recursão infinita em políticas RLS.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
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

-- 3. POLÍTICAS: TABELAS PÚBLICAS/EDITORIAIS (Leitura para Autenticados, Escrita Admin)
DO $$ 
BEGIN
    -- cursos
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Cursos: leitura autenticada') THEN
        CREATE POLICY "Cursos: leitura autenticada" ON public.cursos FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Cursos: admin gerencia" ON public.cursos FOR ALL TO authenticated USING (public.is_admin());
    END IF;

    -- modulos
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Modulos: leitura autenticada') THEN
        CREATE POLICY "Modulos: leitura autenticada" ON public.modulos FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Modulos: admin gerencia" ON public.modulos FOR ALL TO authenticated USING (public.is_admin());
    END IF;

    -- aulas
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Aulas: leitura autenticada') THEN
        CREATE POLICY "Aulas: leitura autenticada" ON public.aulas FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Aulas: admin gerencia" ON public.aulas FOR ALL TO authenticated USING (public.is_admin());
    END IF;

    -- clube stations/routes
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Clube: leitura autenticada') THEN
        CREATE POLICY "Clube: leitura autenticada" ON public.clube_v3_stations FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Clube: admin gerencia" ON public.clube_v3_stations FOR ALL TO authenticated USING (public.is_admin());
        CREATE POLICY "Clube Routes: leitura autenticada" ON public.clube_v3_routes FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Clube Routes: admin gerencia" ON public.clube_v3_routes FOR ALL TO authenticated USING (public.is_admin());
    END IF;

    -- decks/cards
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Oraculos: leitura autenticada') THEN
        CREATE POLICY "Oraculos: leitura autenticada" ON public.decks FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Oraculos: admin gerencia" ON public.decks FOR ALL TO authenticated USING (public.is_admin());
        CREATE POLICY "Cards: leitura autenticada" ON public.cards FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Cards: admin gerencia" ON public.cards FOR ALL TO authenticated USING (public.is_admin());
    END IF;

    -- config/settings
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Config: leitura autenticada') THEN
        CREATE POLICY "Config: leitura autenticada" ON public.app_settings FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Config: admin gerencia" ON public.app_settings FOR ALL TO authenticated USING (public.is_admin());
        CREATE POLICY "AI Global: admin gerencia" ON public.ai_global_settings FOR ALL TO authenticated USING (public.is_admin());
        CREATE POLICY "AI Agents: leitura autenticada" ON public.ai_agents FOR SELECT TO authenticated USING (true);
    END IF;
END $$;

-- 4. POLÍTICAS: PROFILES E ROLES
DO $$ 
BEGIN
    -- profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Profiles: user visualiza proprio') THEN
        CREATE POLICY "Profiles: user visualiza proprio" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
        CREATE POLICY "Profiles: user edita proprio" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
        CREATE POLICY "Profiles: admin visualiza todos" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin());
    END IF;

    -- user_roles
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Roles: user visualiza proprio') THEN
        CREATE POLICY "Roles: user visualiza proprio" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
        CREATE POLICY "Roles: admin gerencia todos" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin());
    END IF;
END $$;

-- 5. POLÍTICAS: DIÁRIO CLÍNICO (ALTAMENTE RESTRITO)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Diario: soberania total usuario') THEN
        CREATE POLICY "Diario: soberania total usuario" ON public.diario_clinico 
            FOR ALL TO authenticated 
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
        -- Note: Admin NÃO tem política de acesso aqui. O campo 'USING' garante que apenas o dono do ID veja.
    END IF;
END $$;
