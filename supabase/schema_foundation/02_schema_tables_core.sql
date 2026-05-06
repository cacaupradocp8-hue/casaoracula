-- 02_schema_tables_core.sql
-- Objetivo: Criar as tabelas base de configurações e perfis.
-- Comandos: ~5 tabelas + constraints.
-- Execução: Requer extensões e enums (Bloco 01).
-- Dependências: 01_schema_extensions_enums.sql
-- Risco: Médio (FKs com auth.users).
-- Validação: Tabelas 'profiles', 'app_settings' e 'user_roles' visíveis.

-- Configurações Globais
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_global_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Perfis (Estrutura Soberana)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    nome TEXT,
    avatar_url TEXT,
    role public.user_role DEFAULT 'aluno',
    portal public.portal_type DEFAULT 'visitante',
    access_status public.access_status DEFAULT 'active',
    onboarding_completed BOOLEAN DEFAULT false,
    is_professional_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    portal public.portal_type NOT NULL DEFAULT 'visitante'
);
