
-- ============================================
-- 1) TABELAS
-- ============================================

CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  category TEXT NOT NULL CHECK (category IN ('TRAVESSIA', 'PORTA', 'PONTE', 'FUNDACAO', 'MATRIZ')),
  is_multipolar BOOLEAN DEFAULT false,
  cover_url TEXT,
  description_short TEXT,
  manifesto_short TEXT,
  why_here TEXT,
  how_to_read TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  year INT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cycle_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES public.cycles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  layer_order INT DEFAULT 0,
  quadrant TEXT,
  is_core BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.book_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  to_book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('SUPORTA', 'ABRE', 'INTEGRA', 'FUNDA')),
  note TEXT
);

CREATE TABLE IF NOT EXISTS public.lessons_album (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('CHAMADO', 'RUPTURA', 'REORGANIZACAO', 'INTEGRACAO')),
  title TEXT NOT NULL,
  description TEXT,
  guided_reading TEXT,
  closing_text TEXT,
  clinical_alert TEXT,
  clinical_notes TEXT,
  misuse_list TEXT,
  questions JSONB,
  audio_script TEXT,
  audio_url TEXT,
  podcast_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2) RLS
-- ============================================

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons_album ENABLE ROW LEVEL SECURITY;

-- Books: everyone can read, admin can write
CREATE POLICY "Books are viewable by everyone" ON public.books FOR SELECT USING (true);
CREATE POLICY "Admin can manage books" ON public.books FOR ALL USING (public.is_admin(auth.uid()));

-- Cycles: everyone can read, admin can write
CREATE POLICY "Cycles are viewable by everyone" ON public.cycles FOR SELECT USING (true);
CREATE POLICY "Admin can manage cycles" ON public.cycles FOR ALL USING (public.is_admin(auth.uid()));

-- Cycle_books: everyone can read, admin can write
CREATE POLICY "Cycle books are viewable by everyone" ON public.cycle_books FOR SELECT USING (true);
CREATE POLICY "Admin can manage cycle_books" ON public.cycle_books FOR ALL USING (public.is_admin(auth.uid()));

-- Book_links: everyone can read, admin can write
CREATE POLICY "Book links are viewable by everyone" ON public.book_links FOR SELECT USING (true);
CREATE POLICY "Admin can manage book_links" ON public.book_links FOR ALL USING (public.is_admin(auth.uid()));

-- Lessons_album: everyone can read, admin can write
CREATE POLICY "Lessons are viewable by everyone" ON public.lessons_album FOR SELECT USING (true);
CREATE POLICY "Admin can manage lessons" ON public.lessons_album FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================
-- 3) TRIGGERS
-- ============================================

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cycles_updated_at BEFORE UPDATE ON public.cycles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_album_updated_at BEFORE UPDATE ON public.lessons_album
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
