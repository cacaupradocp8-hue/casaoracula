-- Add weekly field message audio to ciclos
ALTER TABLE public.clube_livro_ciclos 
  ADD COLUMN IF NOT EXISTS mensagem_campo_url text,
  ADD COLUMN IF NOT EXISTS mensagem_campo_texto text;