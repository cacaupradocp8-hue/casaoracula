-- 1. Fix Storage Policies for clube-assets
DROP POLICY IF EXISTS "Allow Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Allow public read to clube-assets (required for displaying images to students)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'clube-assets');

-- Allow only admins to upload/update/delete
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'clube-assets' AND is_admin(auth.uid()));

CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'clube-assets' AND is_admin(auth.uid()));

CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'clube-assets' AND is_admin(auth.uid()));


-- 2. Add status columns to tables missing them (for draft/published logic)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_v2_obras' AND column_name = 'status') THEN
        ALTER TABLE public.clube_v2_obras ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_v2_portais' AND column_name = 'status') THEN
        ALTER TABLE public.clube_v2_portais ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_v2_encontros' AND column_name = 'status') THEN
        ALTER TABLE public.clube_v2_encontros ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
END $$;


-- 3. Update RLS Policies for Database Tables

-- clube_estacoes
DROP POLICY IF EXISTS "Admin gerencia estações" ON public.clube_estacoes;
DROP POLICY IF EXISTS "Estações publicadas visíveis para autenticados" ON public.clube_estacoes;

CREATE POLICY "Admin CRUD clube_estacoes"
ON public.clube_estacoes FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Student Read published clube_estacoes"
ON public.clube_estacoes FOR SELECT
USING (publicada = true OR is_admin(auth.uid()));


-- clube_rota_itens
DROP POLICY IF EXISTS "Apenas admins gerenciam itens da rota" ON public.clube_rota_itens;
DROP POLICY IF EXISTS "Itens publicados visíveis por todos autenticados" ON public.clube_rota_itens;

CREATE POLICY "Admin CRUD clube_rota_itens"
ON public.clube_rota_itens FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Student Read published clube_rota_itens"
ON public.clube_rota_itens FOR SELECT
USING (publicado = true OR is_admin(auth.uid()));


-- clube_v2_obras
DROP POLICY IF EXISTS "Leitura pública v2_obras" ON public.clube_v2_obras;

CREATE POLICY "Admin CRUD clube_v2_obras"
ON public.clube_v2_obras FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Student Read published clube_v2_obras"
ON public.clube_v2_obras FOR SELECT
USING (status = 'published' OR is_admin(auth.uid()));


-- clube_v2_ciclos
DROP POLICY IF EXISTS "Leitura pública v2_ciclos" ON public.clube_v2_ciclos;

CREATE POLICY "Admin CRUD clube_v2_ciclos"
ON public.clube_v2_ciclos FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Student Read published clube_v2_ciclos"
ON public.clube_v2_ciclos FOR SELECT
USING (status = 'published' OR is_admin(auth.uid()));


-- clube_v2_conteudos
DROP POLICY IF EXISTS "Leitura pública v2_conteudos" ON public.clube_v2_conteudos;

CREATE POLICY "Admin CRUD clube_v2_conteudos"
ON public.clube_v2_conteudos FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Student Read published clube_v2_conteudos"
ON public.clube_v2_conteudos FOR SELECT
USING (status = 'published' OR is_admin(auth.uid()));


-- clube_v2_portais
DROP POLICY IF EXISTS "Leitura pública v2_portais" ON public.clube_v2_portais;

CREATE POLICY "Admin CRUD clube_v2_portais"
ON public.clube_v2_portais FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Student Read published clube_v2_portais"
ON public.clube_v2_portais FOR SELECT
USING (status = 'published' OR is_admin(auth.uid()));


-- clube_v2_encontros
DROP POLICY IF EXISTS "Leitura pública v2_encontros" ON public.clube_v2_encontros;

CREATE POLICY "Admin CRUD clube_v2_encontros"
ON public.clube_v2_encontros FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Student Read published clube_v2_encontros"
ON public.clube_v2_encontros FOR SELECT
USING (status = 'published' OR is_admin(auth.uid()));
