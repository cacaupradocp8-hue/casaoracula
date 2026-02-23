
-- Book media table for cover, banner, and gallery items
CREATE TABLE public.book_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cover', 'banner', 'gallery')),
  title TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL,
  file_kind TEXT NOT NULL DEFAULT 'image' CHECK (file_kind IN ('image', 'pdf')),
  order_index INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.book_media ENABLE ROW LEVEL SECURITY;

-- Public read for published items
CREATE POLICY "Anyone can view published book media"
  ON public.book_media FOR SELECT
  USING (published = true);

-- Admin full access
CREATE POLICY "Admins can manage book media"
  ON public.book_media FOR ALL
  USING (public.is_admin(auth.uid()));

-- Updated at trigger
CREATE TRIGGER update_book_media_updated_at
  BEFORE UPDATE ON public.book_media
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookups
CREATE INDEX idx_book_media_station ON public.book_media(station_id, type, order_index);
