
-- Adicionar campo JSONB para armazenar dados do Método Formativo nos módulos de curso
ALTER TABLE public.course_modules 
ADD COLUMN IF NOT EXISTS metodo_formativo JSONB DEFAULT NULL;

-- Adicionar campo separado para roteiro de aula (vídeo/áudio)
ALTER TABLE public.course_modules 
ADD COLUMN IF NOT EXISTS roteiro_aula TEXT DEFAULT NULL;

COMMENT ON COLUMN public.course_modules.metodo_formativo IS 'Dados estruturados do Método Formativo da Casa Orácula (8 blocos obrigatórios)';
COMMENT ON COLUMN public.course_modules.roteiro_aula IS 'Roteiro de aula para vídeo/áudio - campo narrativo independente';
