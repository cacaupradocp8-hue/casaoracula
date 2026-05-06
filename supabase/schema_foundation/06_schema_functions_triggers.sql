-- 06_schema_functions_triggers.sql
-- Objetivo: Funções de automação de sistema e triggers de perfil.
-- Comandos: ~5-8 funções + triggers.
-- Execução: Requer Tabelas (Blocos 02-05).
-- Dependências: Blocos 02, 03, 04, 05.
-- Risco: Médio (Podem travar signups se mal configuradas).
-- Validação: Tentar criar um registro em 'profiles' e ver se 'updated_at' muda automaticamente no update.

-- Atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para perfis
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_profiles') THEN
        CREATE TRIGGER set_updated_at_profiles
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Função de suporte ao Signup (Cria perfil automaticamente)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.user_roles (user_id, portal)
  VALUES (NEW.id, 'visitante');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger de Auth Signup
-- Nota: Deve ser executado após a tabela profiles existir.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;
