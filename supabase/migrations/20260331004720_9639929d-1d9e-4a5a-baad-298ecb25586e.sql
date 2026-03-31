
-- Add phone field to clientes
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS telefone text;
