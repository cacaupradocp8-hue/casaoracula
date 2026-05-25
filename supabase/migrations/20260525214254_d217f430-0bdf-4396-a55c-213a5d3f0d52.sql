-- Correção para conteudo_travessias
ALTER TABLE public.conteudo_travessias 
DROP CONSTRAINT IF EXISTS conteudo_travessias_archived_by_fkey;

ALTER TABLE public.conteudo_travessias
ADD CONSTRAINT conteudo_travessias_archived_by_fkey 
FOREIGN KEY (archived_by) REFERENCES public.profiles(id);

-- Correção para conteudo_aulas
ALTER TABLE public.conteudo_aulas 
DROP CONSTRAINT IF EXISTS conteudo_aulas_archived_by_fkey;

ALTER TABLE public.conteudo_aulas
ADD CONSTRAINT conteudo_aulas_archived_by_fkey 
FOREIGN KEY (archived_by) REFERENCES public.profiles(id);
