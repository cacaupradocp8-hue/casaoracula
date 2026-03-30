
-- 1. Add unique constraint on subscriptions(user_id, provider) to prevent duplicates
ALTER TABLE public.subscriptions 
  ADD CONSTRAINT subscriptions_user_provider_unique UNIQUE (user_id, provider);

-- 2. Create webhook_events table for idempotency
CREATE TABLE public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'rockty',
  event_id text NOT NULL,
  event_type text NOT NULL,
  customer_email text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  payload jsonb,
  CONSTRAINT webhook_events_provider_event_unique UNIQUE (provider, event_id)
);

-- Enable RLS on webhook_events (no client access at all)
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service_role can access webhook_events
CREATE POLICY "Service role manages webhook events"
  ON public.webhook_events
  FOR ALL
  USING (auth.role() = 'service_role');

-- 3. Remove any INSERT/UPDATE policies for regular users on subscriptions
-- (Currently only SELECT is allowed for users, which is correct)
-- Verify: no additional changes needed since RLS already blocks user writes

-- 4. Change default status on subscriptions from 'active' to 'pending'
ALTER TABLE public.subscriptions ALTER COLUMN status SET DEFAULT 'pending';
