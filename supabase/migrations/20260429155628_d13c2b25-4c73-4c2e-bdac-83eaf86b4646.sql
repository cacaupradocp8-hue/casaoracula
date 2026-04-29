-- Update upsell_opportunities table for Revenue Intelligence
ALTER TABLE public.upsell_opportunities
ADD COLUMN IF NOT EXISTS paused_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ignored_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS declined_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS historical_segment_rate DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS timing_factor DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS probability_score DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS probability_reason TEXT,
ADD COLUMN IF NOT EXISTS first_touch_channel TEXT,
ADD COLUMN IF NOT EXISTS last_touch_channel TEXT,
ADD COLUMN IF NOT EXISTS touch_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS days_to_conversion INTEGER,
ADD COLUMN IF NOT EXISTS estimated_value DECIMAL(10,2);

-- Rename refusal_count to declined_count if it exists and we want to consolidate
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'upsell_opportunities' AND column_name = 'refusal_count') THEN
        UPDATE public.upsell_opportunities SET declined_count = refusal_count WHERE refusal_count > 0;
        -- Optional: ALTER TABLE public.upsell_opportunities DROP COLUMN refusal_count;
    END IF;
END $$;

-- Create index for performance on revenue queries
CREATE INDEX IF NOT EXISTS idx_upsell_opportunities_status_converted ON public.upsell_opportunities(status, converted_at);
CREATE INDEX IF NOT EXISTS idx_upsell_opportunities_user_id ON public.upsell_opportunities(user_id);
