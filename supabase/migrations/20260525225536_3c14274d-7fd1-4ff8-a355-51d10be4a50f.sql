-- Migration: soft_delete_courses_schema_v0
-- Adds soft delete columns to course related tables

-- Add columns to public.courses
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES auth.users(id) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archive_reason TEXT DEFAULT NULL;

-- Add columns to public.course_modules
ALTER TABLE public.course_modules 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES auth.users(id) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archive_reason TEXT DEFAULT NULL;

-- Add columns to public.course_lessons
ALTER TABLE public.course_lessons 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES auth.users(id) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archive_reason TEXT DEFAULT NULL;

-- Create indexes for performance on filtered queries
CREATE INDEX IF NOT EXISTS idx_courses_archived_at ON public.courses (archived_at) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_course_modules_archived_at ON public.course_modules (archived_at) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_course_lessons_archived_at ON public.course_lessons (archived_at) WHERE archived_at IS NULL;