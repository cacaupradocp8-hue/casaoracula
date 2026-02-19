-- Add infographic URL field to clube_livro_ciclos
ALTER TABLE public.clube_livro_ciclos
ADD COLUMN IF NOT EXISTS infografico_url TEXT;