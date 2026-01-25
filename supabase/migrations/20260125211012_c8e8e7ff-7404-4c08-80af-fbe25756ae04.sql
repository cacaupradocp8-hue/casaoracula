-- Add missing values to block_context_type enum for course and lesson content blocks
ALTER TYPE public.block_context_type ADD VALUE IF NOT EXISTS 'course';
ALTER TYPE public.block_context_type ADD VALUE IF NOT EXISTS 'lesson';