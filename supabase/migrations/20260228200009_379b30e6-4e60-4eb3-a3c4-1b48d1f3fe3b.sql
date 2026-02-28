
ALTER TABLE public.studio_episodes 
ADD COLUMN IF NOT EXISTS vinheta_abertura_url text,
ADD COLUMN IF NOT EXISTS vinheta_encerramento_url text,
ADD COLUMN IF NOT EXISTS trilha_fundo_url text,
ADD COLUMN IF NOT EXISTS trilha_ativa boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trilha_volume integer DEFAULT 20,
ADD COLUMN IF NOT EXISTS fade_in_seconds integer DEFAULT 2,
ADD COLUMN IF NOT EXISTS fade_out_seconds integer DEFAULT 3;
