-- 03_seed_clube.sql (REVISADO)
-- Domínio: Clube e Onboarding

-- 1. Portais (Onboarding oficial)
INSERT INTO public.portais (id, titulo, subtitulo, descricao, objetivo, portal_minimo, status, ordem)
VALUES 
('da7f2504-f365-4b50-8de1-19979bb4aab4', 'O Chamado Selvagem', 'Portal 01 — Fundacional', 'Portal fundacional da Jornada da Heroína.', 'Início da travessia: escuta do instinto', 'visitante', 'publicado', 1)
ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo;

-- 2. Estações (Clube V3 - Placeholders para imagens de teste)
INSERT INTO public.clube_v3_routes (id, title, status)
VALUES ('774a306e-396a-48c5-bcde-05ceee25f1b3', 'Jornada do Conhecimento', 'published')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.clube_v3_stations (id, route_id, title, subtitle, status, display_order)
VALUES 
('e277ea5b-e445-4ab4-819c-cce93fba988b', '774a306e-396a-48c5-bcde-05ceee25f1b3', 'Estação I', 'O Chamado da Mulher Selvagem', 'published', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;