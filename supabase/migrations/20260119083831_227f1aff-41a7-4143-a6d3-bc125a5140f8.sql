-- Drop the existing constraint
ALTER TABLE public.eneagrama_registros DROP CONSTRAINT eneagrama_registros_instinto_check;

-- Add new constraint that accepts lowercase values (matching eneagrama_instintos.chave)
ALTER TABLE public.eneagrama_registros ADD CONSTRAINT eneagrama_registros_instinto_check 
CHECK ((instinto IS NULL) OR (instinto = ANY (ARRAY['SP', 'SO', 'SX', 'sp', 'so', 'sx'])));