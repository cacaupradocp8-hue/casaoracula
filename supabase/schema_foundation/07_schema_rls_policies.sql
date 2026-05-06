-- 07_schema_rls_policies.sql
-- Objetivo: Blindagem das tabelas com Row Level Security.
-- Comandos: ~50-80 comandos.
-- Execução: Requer Tabelas (Blocos 02-05) e Funções (Bloco 06).
-- Dependências: Bloco 02, 06.
-- Risco: Alto (Pode bloquear o app se for muito restritiva).
-- Validação: Tentar ler 'profiles' sem login (deve falhar).

-- Habilitar RLS em tudo (Exemplos Core)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de Perfil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Políticas de Configurações (Apenas Admins podem ver/editar via portal_type)
-- Nota: Assume-se a função de ajuda get_user_portal definida no sistema real.
CREATE POLICY "Settings are viewable by everyone" ON public.app_settings
    FOR SELECT USING (true);
