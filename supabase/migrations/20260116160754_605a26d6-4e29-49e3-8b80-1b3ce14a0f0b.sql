-- Add store-related columns to radiestesia_graficos
ALTER TABLE radiestesia_graficos ADD COLUMN IF NOT EXISTS link_loja TEXT;
ALTER TABLE radiestesia_graficos ADD COLUMN IF NOT EXISTS imagem_fisica_url TEXT;
ALTER TABLE radiestesia_graficos ADD COLUMN IF NOT EXISTS disponivel_loja BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN radiestesia_graficos.link_loja IS 'URL específica do produto na loja física';
COMMENT ON COLUMN radiestesia_graficos.imagem_fisica_url IS 'Imagem do produto físico (diferente da imagem digital)';
COMMENT ON COLUMN radiestesia_graficos.disponivel_loja IS 'Se tem versão física disponível na loja';