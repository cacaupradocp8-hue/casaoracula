
-- Admin-safe metadata view for Canteiro/Jardim analytics
-- No raw content exposed
CREATE OR REPLACE VIEW public.v_canteiro_admin_stats
WITH (security_invoker = true)
AS
SELECT
  -- Jardim da Psique stats
  (SELECT COUNT(*) FROM public.jardim_psique_registros) AS total_registros_jardim,
  (SELECT COUNT(DISTINCT user_id) FROM public.jardim_psique_registros WHERE arquivado = false) AS usuarias_ativas_jardim,
  -- Canteiro stats
  (SELECT COUNT(*) FROM public.collective_bed_entries) AS total_publicacoes_canteiro,
  (SELECT COUNT(*) FROM public.collective_bed_entries WHERE aprovado_por_admin = true AND publicado_em IS NOT NULL) AS publicacoes_aprovadas,
  (SELECT COUNT(*) FROM public.collective_bed_entries WHERE rejeitado = true) AS publicacoes_rejeitadas,
  (SELECT COUNT(DISTINCT user_id) FROM public.collective_bed_entries) AS usuarias_que_publicaram,
  -- Period stats (last 30 days)
  (SELECT COUNT(*) FROM public.collective_bed_entries WHERE created_at > now() - interval '30 days') AS publicacoes_ultimos_30_dias,
  (SELECT COUNT(*) FROM public.jardim_psique_registros WHERE created_at > now() - interval '30 days') AS registros_jardim_ultimos_30_dias;
