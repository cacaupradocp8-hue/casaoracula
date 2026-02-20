
-- Add slides (JSONB array) and audio URL columns for both carousel blocks
ALTER TABLE public.clube_livro_ciclos
  ADD COLUMN IF NOT EXISTS por_que_slides jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS por_que_audio_url text,
  ADD COLUMN IF NOT EXISTS como_ler_slides jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS como_ler_audio_url text;

-- Add comments for clarity
COMMENT ON COLUMN public.clube_livro_ciclos.por_que_slides IS 'Array de slides [{titulo, frase_simbolica, image_url}] para carrossel "Por que este livro"';
COMMENT ON COLUMN public.clube_livro_ciclos.por_que_audio_url IS 'URL do áudio para o carrossel "Por que este livro"';
COMMENT ON COLUMN public.clube_livro_ciclos.como_ler_slides IS 'Array de slides [{titulo, frase_simbolica, image_url}] para carrossel "Como ler este livro"';
COMMENT ON COLUMN public.clube_livro_ciclos.como_ler_audio_url IS 'URL do áudio para o carrossel "Como ler este livro"';
