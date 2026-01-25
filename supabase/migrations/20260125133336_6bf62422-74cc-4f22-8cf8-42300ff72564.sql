-- Add classification fields to sala_ferramentas
ALTER TABLE sala_ferramentas 
ADD COLUMN IF NOT EXISTS tipo_ferramenta TEXT,
ADD COLUMN IF NOT EXISTS origem_metodologica TEXT,
ADD COLUMN IF NOT EXISTS vinculo_metodologico TEXT,
ADD COLUMN IF NOT EXISTS finalidade_pratica TEXT;

-- Add comments for documentation
COMMENT ON COLUMN sala_ferramentas.tipo_ferramenta IS 'Values: diagnostico, leitura_simbolica, autoleitura, conducao_terapeutica, ritual_simbolico, ferramenta_narrativa';
COMMENT ON COLUMN sala_ferramentas.origem_metodologica IS 'Values: padrao_psicologico, metodo_oracula, metodo_hibrido';
COMMENT ON COLUMN sala_ferramentas.vinculo_metodologico IS 'Values: pertence_metodo_oracula, ferramenta_apoio, ferramenta_externa_integrada';