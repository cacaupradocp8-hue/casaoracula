ALTER TABLE public.club_tools
ADD COLUMN IF NOT EXISTS contexto_uso TEXT,
ADD COLUMN IF NOT EXISTS limite_etico TEXT;