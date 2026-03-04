
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS gps_suggestion_json jsonb DEFAULT NULL;
