-- Add audio fields to labirinto_portas
ALTER TABLE labirinto_portas
ADD COLUMN IF NOT EXISTS audio_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS audio_titulo TEXT DEFAULT NULL;