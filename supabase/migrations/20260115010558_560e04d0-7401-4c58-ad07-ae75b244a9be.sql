-- Add new block types for formation tools
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'guided_writing';
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'symbolic_practice';
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'anchoring_input';