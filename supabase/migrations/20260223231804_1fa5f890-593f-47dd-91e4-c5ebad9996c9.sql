
-- Journey media for header, infographic, and mini-gallery
CREATE TABLE public.journey_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID NOT NULL REFERENCES public.clube_jornadas(id) ON DELETE CASCADE,
  header_image_url TEXT,
  infographic_url TEXT,
  infographic_kind TEXT DEFAULT 'image' CHECK (infographic_kind IN ('image', 'pdf')),
  gallery_items JSONB DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(journey_id)
);

ALTER TABLE public.journey_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published journey media"
  ON public.journey_media FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage journey media"
  ON public.journey_media FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_journey_media_updated_at
  BEFORE UPDATE ON public.journey_media
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_journey_media_journey ON public.journey_media(journey_id);
