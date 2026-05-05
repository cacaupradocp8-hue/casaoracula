-- Add documentation to cartography tables
COMMENT ON TABLE public.cartografia_psiquica IS 'Input table for Cartography (Oracular) - used in the Reading Club (Clube de Leitura). Flat structure for simple symbols.';
COMMENT ON TABLE public.cartographies IS 'Input table for Cartography (Diagnostic) - used by therapists in the Engine Room (Casa das Máquinas). Stores raw scores.';
COMMENT ON TABLE public.co_cartografia_profile IS 'Canonical unified state for Cartography. Merges both Oracular and Diagnostic perspectives into a structured JSONB profile.';

-- Ensure RLS on co_cartografia_profile
ALTER TABLE public.co_cartografia_profile ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'co_cartografia_profile' AND policyname = 'Users can view their own profile') THEN
        CREATE POLICY "Users can view their own profile" ON public.co_cartografia_profile
        FOR SELECT USING (auth.uid() = user_id OR auth.uid() = client_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'co_cartografia_profile' AND policyname = 'Therapists can view their clients profiles') THEN
        CREATE POLICY "Therapists can view their clients profiles" ON public.co_cartografia_profile
        FOR SELECT USING (auth.uid() = therapist_user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'co_cartografia_profile' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" ON public.co_cartografia_profile
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;
