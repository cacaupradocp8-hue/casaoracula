-- Add postura_facilitadora column and update tipo_campo enum to include reintegracao
ALTER TABLE labirinto_portas ADD COLUMN IF NOT EXISTS postura_facilitadora TEXT;

-- First, let's update the tipo_campo column to allow the new values
-- We need to update existing records first, then add the new type
-- The tipo_campo is already a text field, so we just need to update values