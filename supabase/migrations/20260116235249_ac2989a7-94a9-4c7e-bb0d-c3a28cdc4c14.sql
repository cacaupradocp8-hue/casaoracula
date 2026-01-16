-- Adicionar campos estruturados para o Método ORÁCULA
ALTER TABLE labirinto_portas ADD COLUMN IF NOT EXISTS tipo_campo TEXT;
ALTER TABLE labirinto_portas ADD COLUMN IF NOT EXISTS forca_ativa TEXT;
ALTER TABLE labirinto_portas ADD COLUMN IF NOT EXISTS campo_pede TEXT;
ALTER TABLE labirinto_portas ADD COLUMN IF NOT EXISTS nao_fazer_aqui TEXT;

-- Comentários para documentação
COMMENT ON COLUMN labirinto_portas.tipo_campo IS 'Tipo do campo psíquico: Retenção, Defesa, Dissolução, Emergência, Limiar';
COMMENT ON COLUMN labirinto_portas.forca_ativa IS 'Descrição simbólica do que está ativo nesse campo';
COMMENT ON COLUMN labirinto_portas.campo_pede IS 'O que este campo pede (ex: sustentação, tempo, presença)';
COMMENT ON COLUMN labirinto_portas.nao_fazer_aqui IS 'O que não deve ser feito aqui (ex: interpretar, acelerar)';