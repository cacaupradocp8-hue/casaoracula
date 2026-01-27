-- Adicionar novos campos na tabela clube_livro_fases para suportar estrutura de 4 semanas

ALTER TABLE public.clube_livro_fases 
ADD COLUMN IF NOT EXISTS numero_semana integer,
ADD COLUMN IF NOT EXISTS leitura_orientada text,
ADD COLUMN IF NOT EXISTS alerta_clinico text,
ADD COLUMN IF NOT EXISTS observacao_clinica text,
ADD COLUMN IF NOT EXISTS lista_uso_inadequado text[],
ADD COLUMN IF NOT EXISTS ponte_sala_id uuid REFERENCES public.salas(id),
ADD COLUMN IF NOT EXISTS ponte_sala_texto text,
ADD COLUMN IF NOT EXISTS texto_fechamento text;

-- Criar índice para busca por número da semana
CREATE INDEX IF NOT EXISTS idx_clube_livro_fases_numero_semana ON public.clube_livro_fases(numero_semana);

-- Comentários para documentação
COMMENT ON COLUMN public.clube_livro_fases.numero_semana IS 'Número da semana (0=Ritual, 1-4=Semanas do ciclo)';
COMMENT ON COLUMN public.clube_livro_fases.leitura_orientada IS 'Capítulos/seções para leitura da semana';
COMMENT ON COLUMN public.clube_livro_fases.alerta_clinico IS 'Aviso clínico fixo para a semana';
COMMENT ON COLUMN public.clube_livro_fases.observacao_clinica IS 'Observação clínica expandida';
COMMENT ON COLUMN public.clube_livro_fases.lista_uso_inadequado IS 'Lista de situações a evitar';
COMMENT ON COLUMN public.clube_livro_fases.ponte_sala_id IS 'Referência para Sala relacionada';
COMMENT ON COLUMN public.clube_livro_fases.ponte_sala_texto IS 'Texto explicativo da ponte com outra Sala';
COMMENT ON COLUMN public.clube_livro_fases.texto_fechamento IS 'Bloco de fechamento da semana';