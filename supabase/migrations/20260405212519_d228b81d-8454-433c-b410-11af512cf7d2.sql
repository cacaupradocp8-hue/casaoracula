
CREATE OR REPLACE VIEW public.v_canteiro_per_student_stats
WITH (security_invoker = true)
AS
SELECT
  cbe.user_id,
  p.nome,
  p.email,
  COUNT(*) AS total_publicacoes,
  COUNT(*) FILTER (WHERE cbe.aprovado_por_admin = false AND cbe.rejeitado = false) AS em_curadoria,
  COUNT(*) FILTER (WHERE cbe.aprovado_por_admin = true) AS publicadas,
  COUNT(*) FILTER (WHERE cbe.rejeitado = true) AS recusadas,
  MAX(cbe.created_at) AS ultimo_compartilhamento
FROM public.collective_bed_entries cbe
JOIN public.profiles p ON p.id = cbe.user_id
GROUP BY cbe.user_id, p.nome, p.email;
