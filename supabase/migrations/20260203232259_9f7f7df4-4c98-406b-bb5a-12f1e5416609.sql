-- Adicionar novos campos à tabela sala_ferramentas para suportar criação padronizada
-- Modo de uso (array para checkbox múltiplo)
ALTER TABLE sala_ferramentas 
ADD COLUMN IF NOT EXISTS modo_uso text[] DEFAULT '{}';

-- Tipo de fechamento obrigatório
ALTER TABLE sala_ferramentas 
ADD COLUMN IF NOT EXISTS tipo_fechamento text;

-- Flag para exigir bloco interativo
ALTER TABLE sala_ferramentas 
ADD COLUMN IF NOT EXISTS bloco_interativo_requerido boolean DEFAULT true;

-- Status de completude (rascunho, pronto, publicado)
ALTER TABLE sala_ferramentas 
ADD COLUMN IF NOT EXISTS status_criacao text DEFAULT 'rascunho';

-- Comentário para documentar os valores válidos
COMMENT ON COLUMN sala_ferramentas.modo_uso IS 'Valores válidos: pessoal, sessao, grupo, entre_sessoes';
COMMENT ON COLUMN sala_ferramentas.tipo_fechamento IS 'Valores válidos: registro, integracao, pausa_simbolica';
COMMENT ON COLUMN sala_ferramentas.status_criacao IS 'Valores válidos: rascunho, pronto, publicado';