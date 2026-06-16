-- 1) Views: aplicar security_invoker
ALTER VIEW public.upsell_revenue_intelligence SET (security_invoker = true);
ALTER VIEW public.upsell_stats SET (security_invoker = true);
ALTER VIEW public.view_admin_action_performance SET (security_invoker = true);
ALTER VIEW public.view_founder_financial_summary SET (security_invoker = true);
ALTER VIEW public.view_founder_real_financial_summary SET (security_invoker = true);
ALTER VIEW public.view_user_stagnation SET (security_invoker = true);
ALTER VIEW public.vw_oraculo_portais_resumo SET (security_invoker = true);

-- 2) Storage: remover SELECT amplo público (URLs públicas continuam funcionando)
DROP POLICY IF EXISTS "Anyone can view oracle images" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public can view content images" ON storage.objects;