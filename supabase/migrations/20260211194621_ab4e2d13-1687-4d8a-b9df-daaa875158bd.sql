
-- Add missing clinical fields for professional mode
ALTER TABLE public.labirinto_registros
  ADD COLUMN IF NOT EXISTS observacoes_clinicas text,
  ADD COLUMN IF NOT EXISTS hipotese_terapeutica text,
  ADD COLUMN IF NOT EXISTS nome_cliente text;
