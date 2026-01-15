
-- Add new block types for archetypal mapping tool
ALTER TYPE public.content_block_type ADD VALUE IF NOT EXISTS 'archetypal_mapping';
ALTER TYPE public.content_block_type ADD VALUE IF NOT EXISTS 'narrative_result';
