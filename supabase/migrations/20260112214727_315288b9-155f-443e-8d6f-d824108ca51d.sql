-- Adicionar campos para vincular copy a entidades específicas
ALTER TABLE text_models 
ADD COLUMN IF NOT EXISTS scope TEXT DEFAULT 'global',
ADD COLUMN IF NOT EXISTS scope_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- Índice para busca eficiente
CREATE INDEX IF NOT EXISTS idx_text_models_scope ON text_models(scope, scope_id);

-- Atualizar registros existentes para ter scope global
UPDATE text_models SET scope = 'global', ativo = true WHERE scope IS NULL;