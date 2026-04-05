-- Add symbolic metadata to books table
ALTER TABLE public.books
  ADD COLUMN IF NOT EXISTS summary_symbolic TEXT,
  ADD COLUMN IF NOT EXISTS central_theme TEXT,
  ADD COLUMN IF NOT EXISTS key_archetypes TEXT[],
  ADD COLUMN IF NOT EXISTS key_symbols TEXT[],
  ADD COLUMN IF NOT EXISTS tension_axis TEXT;

-- Create enum for knowledge entry source types
CREATE TYPE public.club_knowledge_source_type AS ENUM (
  'summary',
  'study_note',
  'guide_question',
  'symbolic_note',
  'practice_seed',
  'podcast_seed',
  'microclass_seed'
);

-- Create knowledge entries table
CREATE TABLE public.club_knowledge_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  ciclo_id UUID REFERENCES public.clube_livro_ciclos(id) ON DELETE SET NULL,
  chapter_title TEXT,
  excerpt_title TEXT,
  excerpt_text TEXT,
  source_type public.club_knowledge_source_type NOT NULL DEFAULT 'study_note',
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  archetypes TEXT[] DEFAULT '{}',
  symbols TEXT[] DEFAULT '{}',
  chapter_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.club_knowledge_entries ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read (formative content)
CREATE POLICY "Authenticated users can read knowledge entries"
ON public.club_knowledge_entries
FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage
CREATE POLICY "Admins can manage knowledge entries"
ON public.club_knowledge_entries
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Indexes for efficient retrieval
CREATE INDEX idx_club_knowledge_book ON public.club_knowledge_entries(book_id);
CREATE INDEX idx_club_knowledge_ciclo ON public.club_knowledge_entries(ciclo_id);
CREATE INDEX idx_club_knowledge_source ON public.club_knowledge_entries(source_type);
CREATE INDEX idx_club_knowledge_tags ON public.club_knowledge_entries USING GIN(tags);
CREATE INDEX idx_club_knowledge_archetypes ON public.club_knowledge_entries USING GIN(archetypes);
CREATE INDEX idx_club_knowledge_symbols ON public.club_knowledge_entries USING GIN(symbols);

-- Updated_at trigger
CREATE TRIGGER update_club_knowledge_entries_updated_at
BEFORE UPDATE ON public.club_knowledge_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();