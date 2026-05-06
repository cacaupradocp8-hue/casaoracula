-- 01_schema_extensions_enums.sql
-- Objetivo: Habilitar extensões necessárias e tipos enumerados fundamentais.
-- Comandos: ~10-15
-- Execução: Deve ser o primeiro.
-- Dependências: Nenhuma.
-- Risco: Baixo.
-- Validação: Verificar se os tipos aparecem em Database -> Enumerated Types.

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

-- Enums Fundamentais
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'portal_type') THEN
        CREATE TYPE public.portal_type AS ENUM ('visitante', 'pre_iniciada', 'iniciada', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'aluno', 'membro', 'convidado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'access_status') THEN
        CREATE TYPE public.access_status AS ENUM ('active', 'inactive', 'pending', 'expired');
    END IF;
END $$;
