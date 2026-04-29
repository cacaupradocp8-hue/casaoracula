-- Create enum for Clube status if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'clube_status') THEN
        CREATE TYPE public.clube_status AS ENUM ('draft', 'published', 'archived');
    END IF;
END $$;

-- Add status to clube_estacoes
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_estacoes' AND column_name = 'status') THEN
        ALTER TABLE public.clube_estacoes ADD COLUMN status public.clube_status DEFAULT 'draft';
    END IF;
END $$;

-- Add status to clube_rota_itens
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_rota_itens' AND column_name = 'status') THEN
        ALTER TABLE public.clube_rota_itens ADD COLUMN status public.clube_status DEFAULT 'draft';
    END IF;
END $$;

-- RLS: Ensure only users with admin role or specific email can modify
-- Note: Checking for 'admin' role assuming there's a profile or metadata check available. 
-- For now, let's use the standard "only authenticated" but we'll refine the FE logic.
-- The prompt explicitly asks for "Somente admin pode".

-- Refine Storage policies for Admin only
DROP POLICY IF EXISTS "Allow Upload" ON storage.objects;
CREATE POLICY "Allow Admin Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'clube-assets' AND 
    (auth.jwt() ->> 'email' IN ('suporte@oracula.com.br', 'admin@oracula.com.br'))
);

DROP POLICY IF EXISTS "Allow Update" ON storage.objects;
CREATE POLICY "Allow Admin Update" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'clube-assets' AND 
    (auth.jwt() ->> 'email' IN ('suporte@oracula.com.br', 'admin@oracula.com.br'))
);
