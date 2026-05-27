
-- 1. ai_provider_prices RLS
ALTER TABLE public.ai_provider_prices ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.ai_provider_prices TO authenticated;
GRANT ALL ON public.ai_provider_prices TO service_role;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ai_provider_prices' 
        AND policyname = 'Allow read for authenticated'
    ) THEN
        CREATE POLICY "Allow read for authenticated" ON public.ai_provider_prices 
        FOR SELECT TO authenticated USING (true);
    END IF;
END $$;

-- 2. Views security_invoker
ALTER VIEW public.v_student_tracking SET (security_invoker = true);
ALTER VIEW public.v_canteiro_per_student_stats SET (security_invoker = true);

-- 3. Function Permissions
-- Revoga execução de funções administrativas para anon/authenticated (mantendo apenas service_role)
REVOKE EXECUTE ON FUNCTION public.activate_fundadora_plan(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.activate_fundadora_plan(uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 4. Search Path
ALTER FUNCTION public.update_training_stats() SET search_path = public;

-- 5. Storage Policies for 'audios'
-- Remove a política de leitura pública de metadados (listagem)
DROP POLICY IF EXISTS "Áudios são públicos para leitura" ON storage.objects;

-- Cria nova política que permite listagem apenas para autenticados
CREATE POLICY "Authenticated users can list audios" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'audios');

-- Garante que service_role tenha acesso total
CREATE POLICY "Service role can manage audios" 
ON storage.objects FOR ALL 
TO service_role 
USING (bucket_id = 'audios');
