
-- Add formato column to studio_episodes
ALTER TABLE public.studio_episodes 
ADD COLUMN IF NOT EXISTS formato TEXT NOT NULL DEFAULT 'narrativo';

-- Add audio_narradora_url for dialogue format
ALTER TABLE public.studio_episodes 
ADD COLUMN IF NOT EXISTS audio_narradora_url TEXT;

-- Add audio_oracular_url for dialogue format  
ALTER TABLE public.studio_episodes 
ADD COLUMN IF NOT EXISTS audio_oracular_url TEXT;
