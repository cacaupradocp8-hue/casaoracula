
-- Add cartografia_base (JSONB) to profiles for therapist identity mapping
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cartografia_base jsonb DEFAULT NULL;

-- Add cartografia_sessao (JSONB) to clientes for client session mapping
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS cartografia_sessao jsonb DEFAULT NULL;

-- Add estado column to journey_districts if not exists for 4-state GPS
-- Check existing district_state_changes for em_tensao support
ALTER TABLE public.district_state_changes ADD COLUMN IF NOT EXISTS motivo text DEFAULT NULL;

COMMENT ON COLUMN public.profiles.cartografia_base IS 'Cartografia da terapeuta: identidade, voz terapêutica, estilo clínico (gerado pela IA)';
COMMENT ON COLUMN public.clientes.cartografia_sessao IS 'Cartografia da cliente em sessão: leitura psíquica, CidaDELA, direção clínica (gerado pela IA)';
