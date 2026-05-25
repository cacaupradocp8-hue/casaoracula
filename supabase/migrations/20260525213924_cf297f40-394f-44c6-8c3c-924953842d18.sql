-- Adiciona campos de arquivamento para conteudo_travessias
ALTER TABLE public.conteudo_travessias 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES auth.users(id) NULL,
ADD COLUMN IF NOT EXISTS archive_reason TEXT NULL;

-- Adiciona campos de arquivamento para conteudo_aulas
ALTER TABLE public.conteudo_aulas 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES auth.users(id) NULL,
ADD COLUMN IF NOT EXISTS archive_reason TEXT NULL;

-- Comentários para documentação de schema
COMMENT ON COLUMN public.conteudo_travessias.archived_at IS 'Data/hora em que o portal foi arquivado (soft delete)';
COMMENT ON COLUMN public.conteudo_travessias.archived_by IS 'ID do admin que realizou o arquivamento';
COMMENT ON COLUMN public.conteudo_travessias.archive_reason IS 'Motivo editorial para o arquivamento do portal';

COMMENT ON COLUMN public.conteudo_aulas.archived_at IS 'Data/hora em que a aula foi arquivada (soft delete)';
COMMENT ON COLUMN public.conteudo_aulas.archived_by IS 'ID do admin que realizou o arquivamento';
COMMENT ON COLUMN public.conteudo_aulas.archive_reason IS 'Motivo editorial para o arquivamento da aula';
