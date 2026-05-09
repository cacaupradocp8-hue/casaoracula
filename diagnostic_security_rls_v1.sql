-- =====================================================================
-- diagnostic_security_rls_v1.sql
-- Script de Diagnóstico de Segurança e Row Level Security (RLS).
-- Verifica quais tabelas estão com RLS habilitado e quais políticas existem.
-- =====================================================================

SET search_path TO public;

-- 1. Resumo de Tabelas e RLS
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    (SELECT count(*) FROM pg_policies p WHERE p.schemaname = t.schemaname AND p.tablename = t.tablename) as policies_count
FROM pg_tables t
WHERE schemaname = 'public'
ORDER BY rowsecurity ASC, tablename ASC;

-- 2. Detalhamento de todas as políticas existentes
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd as operation, 
    qual as using_expression, 
    with_check as check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Verificação de Extensões Essenciais
SELECT name, installed_version 
FROM pg_available_extensions 
WHERE installed_version IS NOT NULL 
  AND name IN ('pg_net', 'pgmq', 'uuid-ossp', 'pgcrypto', 'citext');

-- 4. Verificação de Enums (Tipos Customizados)
SELECT n.nspname as schema, t.typname as type_name, string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY n.nspname, t.typname;
