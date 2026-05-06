-- 08_schema_storage_buckets_policies.sql (REVISADO)
-- Objetivo: Configuração do Storage Soberano com os 4 Buckets Oficiais.
-- Execução: Requer Bloco 07 (RLS e is_admin).

-- 1. CRIAÇÃO DOS BUCKETS OFICIAIS
DO $$
BEGIN
    -- oracle-images (Público)
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('oracle-images', 'oracle-images', true)
    ON CONFLICT (id) DO NOTHING;

    -- content-images (Público)
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('content-images', 'content-images', true)
    ON CONFLICT (id) DO NOTHING;

    -- clube-assets (Público)
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('clube-assets', 'clube-assets', true)
    ON CONFLICT (id) DO NOTHING;

    -- audios (Privado)
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('audios', 'audios', false)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- 2. POLÍTICAS DE ACESSO (STORAGE.OBJECTS)

-- A. oracle-images (Leitura Pública, Escrita Admin)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Oracle: leitura publica' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "Oracle: leitura publica" ON storage.objects FOR SELECT USING (bucket_id = 'oracle-images');
        CREATE POLICY "Oracle: admin gerencia" ON storage.objects FOR ALL TO authenticated 
            USING (bucket_id = 'oracle-images' AND public.is_admin()) 
            WITH CHECK (bucket_id = 'oracle-images' AND public.is_admin());
    END IF;
END $$;

-- B. content-images (Leitura Pública, Escrita Admin)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Content: leitura publica' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "Content: leitura publica" ON storage.objects FOR SELECT USING (bucket_id = 'content-images');
        CREATE POLICY "Content: admin gerencia" ON storage.objects FOR ALL TO authenticated 
            USING (bucket_id = 'content-images' AND public.is_admin()) 
            WITH CHECK (bucket_id = 'content-images' AND public.is_admin());
    END IF;
END $$;

-- C. clube-assets (Leitura Pública, Escrita Admin)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'ClubeAssets: leitura publica' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "ClubeAssets: leitura publica" ON storage.objects FOR SELECT USING (bucket_id = 'clube-assets');
        CREATE POLICY "ClubeAssets: admin gerencia" ON storage.objects FOR ALL TO authenticated 
            USING (bucket_id = 'clube-assets' AND public.is_admin()) 
            WITH CHECK (bucket_id = 'clube-assets' AND public.is_admin());
    END IF;
END $$;

-- D. audios (Leitura Autenticada, Escrita Admin)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Audios: leitura autenticada' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "Audios: leitura autenticada" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'audios');
        CREATE POLICY "Audios: admin gerencia" ON storage.objects FOR ALL TO authenticated 
            USING (bucket_id = 'audios' AND public.is_admin()) 
            WITH CHECK (bucket_id = 'audios' AND public.is_admin());
    END IF;
END $$;
