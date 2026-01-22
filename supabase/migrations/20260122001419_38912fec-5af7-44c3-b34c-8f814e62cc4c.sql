-- Add back_image_url column to oracle_cards for individual card back images
ALTER TABLE oracle_cards 
ADD COLUMN back_image_url TEXT DEFAULT NULL;

COMMENT ON COLUMN oracle_cards.back_image_url IS 
  'Imagem do verso da carta (opcional - usa tema do oráculo se vazio)';