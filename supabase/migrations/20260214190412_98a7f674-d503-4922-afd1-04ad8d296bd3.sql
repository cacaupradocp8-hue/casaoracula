-- Add missing columns to clientes table
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS codigo_interno TEXT,
ADD COLUMN IF NOT EXISTS data_inicio DATE DEFAULT CURRENT_DATE;