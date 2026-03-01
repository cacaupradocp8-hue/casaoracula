-- Add ciclo_id column to season_labs so Lab 80/20 can work directly with ciclos
ALTER TABLE public.season_labs 
  ADD COLUMN ciclo_id uuid REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE;

-- Make season_id nullable since we'll now use ciclo_id as primary link
ALTER TABLE public.season_labs 
  ALTER COLUMN season_id DROP NOT NULL;

-- Create index for ciclo_id lookups
CREATE INDEX idx_season_labs_ciclo_id ON public.season_labs(ciclo_id);

-- Add unique constraint so each ciclo has at most one lab config
ALTER TABLE public.season_labs 
  ADD CONSTRAINT season_labs_ciclo_id_unique UNIQUE (ciclo_id);