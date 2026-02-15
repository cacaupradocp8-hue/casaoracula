
-- Add 'ritual' to the content_type enum
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'ritual';

-- Add ritual_slides JSONB column (array of slide objects)
-- Each slide: { image_url: string, titulo?: string, frase_simbolica?: string }
ALTER TABLE public.course_lessons
ADD COLUMN IF NOT EXISTS ritual_slides JSONB DEFAULT '[]'::jsonb;

-- Add capa_url for lesson cover image (used by ritual lessons)
ALTER TABLE public.course_lessons
ADD COLUMN IF NOT EXISTS capa_url TEXT;

-- Add jornada and portal fields for ritual context
ALTER TABLE public.course_lessons
ADD COLUMN IF NOT EXISTS jornada TEXT;

ALTER TABLE public.course_lessons
ADD COLUMN IF NOT EXISTS portal TEXT;
