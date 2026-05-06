-- 08_schema_storage_buckets_policies.sql
-- Objetivo: Configuração do Storage Soberano (Buckets e Políticas).
-- Execução: Requer Bloco 07 (RLS e is_admin).

-- 1. CRIAÇÃO DOS BUCKETS
-- Usando blocos DO para evitar erros se os buckets já existirem.
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('oracle-images', 'oracle-images', true)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('course-content', 'course-content', true)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('user-assets', 'user-assets', true)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('private-documents', 'private-documents', false)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- 2. POLÍTICAS DE ACESSO (STORAGE.OBJECTS)

-- A. Oracle Images (Público para leitura, Admin gerencia)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Oracle: leitura publica' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "Oracle: leitura publica" ON storage.objects FOR SELECT USING (bucket_id = 'oracle-images');
        CREATE POLICY "Oracle: admin gerencia" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'oracle-images' AND public.is_admin()) WITH CHECK (bucket_id = 'oracle-images' AND public.is_admin());
    END IF;
END $$;

-- B. Course Content (Público para leitura, Admin gerencia)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Cursos: leitura publica' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "Cursos: leitura publica" ON storage.objects FOR SELECT USING (bucket_id = 'course-content');
        CREATE POLICY "Cursos: admin gerencia" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'course-content' AND public.is_admin()) WITH CHECK (bucket_id = 'course-content' AND public.is_admin());
    END IF;
END $$;

-- C. User Assets (Leitura pública, Usuário faz upload de seus arquivos)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'UserAssets: leitura publica' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "UserAssets: leitura publica" ON storage.objects FOR SELECT USING (bucket_id = 'user-assets');
        CREATE POLICY "UserAssets: upload proprio" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'user-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
        CREATE POLICY "UserAssets: admin gerencia" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'user-assets' AND public.is_admin()) WITH CHECK (bucket_id = 'user-assets' AND public.is_admin());
    END IF;
END $$;

-- D. Private Documents (Apenas Dono e Admin)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Privado: leitura dono e admin' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "Privado: leitura dono e admin" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'private-documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));
        CREATE POLICY "Privado: upload proprio" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'private-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
        CREATE POLICY "Privado: admin gerencia" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'private-documents' AND public.is_admin()) WITH CHECK (bucket_id = 'private-documents' AND public.is_admin());
    END IF;
END $$;
