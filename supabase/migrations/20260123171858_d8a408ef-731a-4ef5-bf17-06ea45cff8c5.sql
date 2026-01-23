-- Remove restrictive CHECK constraint on travessias.number
ALTER TABLE public.travessias 
DROP CONSTRAINT IF EXISTS travessias_number_check;

-- Add flexible constraint allowing number >= 0
ALTER TABLE public.travessias 
ADD CONSTRAINT travessias_number_check 
CHECK (number >= 0);