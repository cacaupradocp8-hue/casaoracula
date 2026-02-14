
-- Add espelho fields to jardim_do_oficio
ALTER TABLE public.jardim_do_oficio
ADD COLUMN espelho_toca_minha TEXT,
ADD COLUMN espelho_risco_projecao TEXT,
ADD COLUMN espelho_supervisao TEXT;

-- Remove espelho fields from mapa_vivo_heroina (no data exists)
ALTER TABLE public.mapa_vivo_heroina
DROP COLUMN IF EXISTS espelho_toca_minha,
DROP COLUMN IF EXISTS espelho_risco_projecao,
DROP COLUMN IF EXISTS espelho_supervisao;
