-- Remoção definitiva da FK em archived_by para conteudo_travessias
ALTER TABLE public.conteudo_travessias 
DROP CONSTRAINT IF EXISTS conteudo_travessias_archived_by_fkey;

-- Remoção definitiva da FK em archived_by para conteudo_aulas
ALTER TABLE public.conteudo_aulas 
DROP CONSTRAINT IF EXISTS conteudo_aulas_archived_by_fkey;
