-- Update clube_estacoes with new fields for Voz da Clareira and Audios
ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS voz_clareira_texto TEXT,
ADD COLUMN IF NOT EXISTS spotify_playlists JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS audio_abertura_url TEXT,
ADD COLUMN IF NOT EXISTS audio_floresta_url TEXT;

-- Add audio fields to works (clube_camara_escuta_obras)
ALTER TABLE public.clube_camara_escuta_obras
ADD COLUMN IF NOT EXISTS audio_regente_url TEXT;

-- Comment for documentation
COMMENT ON COLUMN public.clube_estacoes.spotify_playlists IS 'List of objects {id: string, url: string, label: string, territorio: string}';
