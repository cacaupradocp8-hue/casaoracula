-- 02_seed_formacao.sql
-- Domínio: Formação Oracular
-- Objetivo: Migrar currículo, módulos e aulas (o ouro intelectual).

-- Ordem: cursos -> modulos -> aulas
-- Nota: REPLACE(thumbnail_url, '[DOMINIO_ANTIGO]', '[NOVO_DOMINIO]') será necessário se usar URLs absolutas.

-- Exemplo de estrutura (os dados reais serão extraídos via psql/copy)
-- INSERT INTO public.cursos (id, titulo, descricao) VALUES ...
-- INSERT INTO public.modulos (id, curso_id, titulo, ordem) VALUES ...
-- INSERT INTO public.aulas (id, modulo_id, titulo, conteudo, thumbnail_url) 
-- VALUES ('uuid', 'modulo_uuid', 'Aula 01', 'Conteúdo...', REPLACE('https://old.supabase.co/...', 'old.supabase.co', 'new.supabase.co'));
