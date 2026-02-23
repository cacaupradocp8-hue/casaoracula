
-- Add caption, credit, source_url to book_media
ALTER TABLE public.book_media
  ADD COLUMN caption TEXT DEFAULT '',
  ADD COLUMN credit TEXT DEFAULT '',
  ADD COLUMN source_url TEXT DEFAULT '';
