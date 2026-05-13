DO $$ 
BEGIN
    -- 1. rockty_offer_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'rockty_offer_id'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN rockty_offer_id text;
    END IF;

    -- 2. plan_id (com FK para plans)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'plan_id'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN plan_id text REFERENCES public.plans(id);
    END IF;

    -- 3. external_subscription_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'external_subscription_id'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN external_subscription_id text;
    END IF;

    -- 4. processing_status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'processing_status'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN processing_status text DEFAULT 'pending';
    END IF;

    -- 5. processing_error
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'processing_error'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN processing_error text;
    END IF;

    -- 6. last_attempt_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'last_attempt_at'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN last_attempt_at timestamptz;
    END IF;
END $$;