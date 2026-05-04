-- Add unique constraint to book_id to prevent duplicate entries for the same book
ALTER TABLE public.clube_obras_essencia_8020 
ADD CONSTRAINT clube_obras_essencia_8020_book_id_key UNIQUE (book_id);