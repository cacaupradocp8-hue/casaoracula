
-- Add new multimedia fields to conteudo_aulas
ALTER TABLE public.conteudo_aulas
ADD COLUMN texto_aula TEXT,
ADD COLUMN audio_url TEXT,
ADD COLUMN pdf_url TEXT;

-- Rename video_embed_url to video_url for consistency
ALTER TABLE public.conteudo_aulas
RENAME COLUMN video_embed_url TO video_url;

-- Rename materiais_url to keep it as legacy or remove if not needed
-- We'll keep it for backward compatibility but pdf_url is the new preferred field
COMMENT ON COLUMN public.conteudo_aulas.texto_aula IS 'Conteúdo principal da aula em formato texto/markdown';
COMMENT ON COLUMN public.conteudo_aulas.audio_url IS 'URL de embed de áudio (SoundCloud, MP3, etc)';
COMMENT ON COLUMN public.conteudo_aulas.pdf_url IS 'URL do PDF da aula';
COMMENT ON COLUMN public.conteudo_aulas.video_url IS 'URL de embed de vídeo (YouTube, Vimeo)';
