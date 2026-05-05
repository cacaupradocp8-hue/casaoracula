-- Depreciação reversível das tabelas `club_*` legadas (geração 1 do Clube de Leitura).
-- Todas as 8 tabelas estão vazias; código que as referenciava foi substituído por redirects
-- para a Home unificada `/clube` (geração ativa: `clube_*` e `clube_v2_*`).
-- Renomear (não dropar) preserva reversibilidade. Drop definitivo após 30d de observação.

ALTER TABLE IF EXISTS public.club_books            RENAME TO _deprecated_club_books;
ALTER TABLE IF EXISTS public.club_cycles           RENAME TO _deprecated_club_cycles;
ALTER TABLE IF EXISTS public.club_meetings         RENAME TO _deprecated_club_meetings;
ALTER TABLE IF EXISTS public.club_reflections      RENAME TO _deprecated_club_reflections;
ALTER TABLE IF EXISTS public.club_cartography      RENAME TO _deprecated_club_cartography;
ALTER TABLE IF EXISTS public.club_tools            RENAME TO _deprecated_club_tools;
ALTER TABLE IF EXISTS public.club_knowledge_entries RENAME TO _deprecated_club_knowledge_entries;
ALTER TABLE IF EXISTS public.club_user_cycles      RENAME TO _deprecated_club_user_cycles;

-- Comentários documentando a deprecação
COMMENT ON TABLE public._deprecated_club_books            IS 'Deprecated 2026-05-05 — legacy v1 Clube. Drop after 30d of observation.';
COMMENT ON TABLE public._deprecated_club_cycles           IS 'Deprecated 2026-05-05 — legacy v1 Clube. Drop after 30d of observation.';
COMMENT ON TABLE public._deprecated_club_meetings         IS 'Deprecated 2026-05-05 — legacy v1 Clube. Drop after 30d of observation.';
COMMENT ON TABLE public._deprecated_club_reflections      IS 'Deprecated 2026-05-05 — legacy v1 Clube. Drop after 30d of observation.';
COMMENT ON TABLE public._deprecated_club_cartography      IS 'Deprecated 2026-05-05 — legacy v1 Clube. Drop after 30d of observation.';
COMMENT ON TABLE public._deprecated_club_tools            IS 'Deprecated 2026-05-05 — legacy v1 Clube. Drop after 30d of observation.';
COMMENT ON TABLE public._deprecated_club_knowledge_entries IS 'Deprecated 2026-05-05 — legacy v1 Clube. Drop after 30d of observation.';
COMMENT ON TABLE public._deprecated_club_user_cycles      IS 'Deprecated 2026-05-05 — legacy v1 Clube. Drop after 30d of observation.';

-- Revogar acesso de roles públicos para evitar leitura/escrita acidental.
REVOKE ALL ON public._deprecated_club_books            FROM anon, authenticated;
REVOKE ALL ON public._deprecated_club_cycles           FROM anon, authenticated;
REVOKE ALL ON public._deprecated_club_meetings         FROM anon, authenticated;
REVOKE ALL ON public._deprecated_club_reflections      FROM anon, authenticated;
REVOKE ALL ON public._deprecated_club_cartography      FROM anon, authenticated;
REVOKE ALL ON public._deprecated_club_tools            FROM anon, authenticated;
REVOKE ALL ON public._deprecated_club_knowledge_entries FROM anon, authenticated;
REVOKE ALL ON public._deprecated_club_user_cycles      FROM anon, authenticated;