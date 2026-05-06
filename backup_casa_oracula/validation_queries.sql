-- Queries de Validação de Integridade Pós-Migração

-- 1. Contagem de Tabelas (Deve bater com o original)
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';

-- 2. Amostragem de Conteúdo Editorial
SELECT count(*) as total_cartas FROM oracle_cards;
SELECT count(*) as total_cursos FROM courses;
SELECT count(*) as total_modulos FROM course_modules;

-- 3. Verificação de RLS (Deve retornar 0 se houver tabelas sem RLS)
-- Nota: Algumas tabelas técnicas podem não ter RLS, mas o ideal é que todas as de usuário tenham.
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = false;

-- 4. Verificação de Extensões
SELECT * FROM pg_extension;
