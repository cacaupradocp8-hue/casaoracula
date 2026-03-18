
-- Add deck_id column to oracle_cards to link cards to their deck
ALTER TABLE public.oracle_cards ADD COLUMN IF NOT EXISTS deck_id uuid REFERENCES public.oracle_decks(id);

-- Link all existing 72 cards to the main deck "O Labirinto da Heroína Interna®"
UPDATE public.oracle_cards SET deck_id = 'cbd0a694-b57c-4b43-931c-748ceea1f134' WHERE deck_id IS NULL;

-- Add main_image_url column if missing (needed for card display)
ALTER TABLE public.oracle_cards ADD COLUMN IF NOT EXISTS main_image_url text;

-- Add ordem column if missing
ALTER TABLE public.oracle_cards ADD COLUMN IF NOT EXISTS ordem integer DEFAULT 0;

-- Create index for deck lookups
CREATE INDEX IF NOT EXISTS idx_oracle_cards_deck_id ON public.oracle_cards(deck_id);
