-- Adicionar coluna sala_id na tabela courses para associar cursos a salas
ALTER TABLE public.courses 
ADD COLUMN sala_id UUID REFERENCES public.salas(id) ON DELETE SET NULL;

-- Criar índice para melhorar performance de buscas
CREATE INDEX idx_courses_sala_id ON public.courses(sala_id);