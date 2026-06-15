ALTER TABLE public.co_camara_sussurro_casos
  ADD COLUMN IF NOT EXISTS nome_musica text,
  ADD COLUMN IF NOT EXISTS artista text,
  ADD COLUMN IF NOT EXISTS spotify_url text,
  ADD COLUMN IF NOT EXISTS embed_url text,
  ADD COLUMN IF NOT EXISTS funcao_escuta text;