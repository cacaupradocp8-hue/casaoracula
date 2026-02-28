
ALTER TABLE public.studio_episodes 
ADD COLUMN IF NOT EXISTS audio_final_url text;
