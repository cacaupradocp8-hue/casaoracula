-- 1. Rename tables to _deprecated_
ALTER TABLE IF EXISTS public.clube_v2_ciclos RENAME TO _deprecated_clube_v2_ciclos;
ALTER TABLE IF EXISTS public.clube_v2_portais RENAME TO _deprecated_clube_v2_portais;
ALTER TABLE IF EXISTS public.clube_v2_encontros RENAME TO _deprecated_clube_v2_encontros;
ALTER TABLE IF EXISTS public.clube_v2_obras RENAME TO _deprecated_clube_v2_obras;
ALTER TABLE IF EXISTS public.clube_v2_conteudos RENAME TO _deprecated_clube_v2_conteudos;
ALTER TABLE IF EXISTS public.clube_v2_ferramentas RENAME TO _deprecated_clube_v2_ferramentas;
ALTER TABLE IF EXISTS public.clube_v2_registros_usuario RENAME TO _deprecated_clube_v2_registros_usuario;

-- 2. Revoke all access
REVOKE ALL ON public._deprecated_clube_v2_ciclos FROM anon, authenticated;
REVOKE ALL ON public._deprecated_clube_v2_portais FROM anon, authenticated;
REVOKE ALL ON public._deprecated_clube_v2_encontros FROM anon, authenticated;
REVOKE ALL ON public._deprecated_clube_v2_obras FROM anon, authenticated;
REVOKE ALL ON public._deprecated_clube_v2_conteudos FROM anon, authenticated;
REVOKE ALL ON public._deprecated_clube_v2_ferramentas FROM anon, authenticated;
REVOKE ALL ON public._deprecated_clube_v2_registros_usuario FROM anon, authenticated;

-- 3. Document 30-day drop policy
COMMENT ON TABLE public._deprecated_clube_v2_ciclos IS 'DEPRECATED: Redundant duplicate of clube_livro_ciclos. To be dropped on 2026-06-05.';
COMMENT ON TABLE public._deprecated_clube_v2_portais IS 'DEPRECATED: Redundant duplicate. To be dropped on 2026-06-05.';
COMMENT ON TABLE public._deprecated_clube_v2_encontros IS 'DEPRECATED: Orphan legacy. To be dropped on 2026-06-05.';
COMMENT ON TABLE public._deprecated_clube_v2_obras IS 'DEPRECATED: Orphan legacy. To be dropped on 2026-06-05.';
COMMENT ON TABLE public._deprecated_clube_v2_conteudos IS 'DEPRECATED: Orphan legacy. To be dropped on 2026-06-05.';
COMMENT ON TABLE public._deprecated_clube_v2_ferramentas IS 'DEPRECATED: Orphan legacy. To be dropped on 2026-06-05.';
COMMENT ON TABLE public._deprecated_clube_v2_registros_usuario IS 'DEPRECATED: Redundant duplicate. To be dropped on 2026-06-05.';
