
-- Add missing columns to cycle_books
ALTER TABLE public.cycle_books ADD COLUMN IF NOT EXISTS layer text;
ALTER TABLE public.cycle_books ADD COLUMN IF NOT EXISTS ring_index integer;

-- Create index on cycle_books(cycle_id, layer)
CREATE INDEX IF NOT EXISTS idx_cycle_books_cycle_layer ON public.cycle_books(cycle_id, layer);
