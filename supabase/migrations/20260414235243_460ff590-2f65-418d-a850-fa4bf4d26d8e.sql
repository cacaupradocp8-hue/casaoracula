
-- Add cabine-specific columns to sessions table
ALTER TABLE public.sessions
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS session_without_profile BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS sintese_json JSONB,
ADD COLUMN IF NOT EXISTS cabine_data JSONB;

COMMENT ON COLUMN public.sessions.completed_at IS 'Timestamp when session was formally ended in Cabine';
COMMENT ON COLUMN public.sessions.session_without_profile IS 'True if therapist started session without a cartografia profile';
COMMENT ON COLUMN public.sessions.sintese_json IS 'Structured synthesis: resumo, hipotese_simbolica, proximos_passos';
COMMENT ON COLUMN public.sessions.cabine_data IS 'Cabine structured data: porta_ativa, campo_predominante, torre_estruturante, observacao_etica, checkin_texto';
