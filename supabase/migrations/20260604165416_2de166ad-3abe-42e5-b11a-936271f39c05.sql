ALTER TABLE public.clube_v3_routes ADD COLUMN IF NOT EXISTS station_filter TEXT;

UPDATE public.clube_v3_routes SET station_filter = 'Mulheres que Correm com os Lobos' WHERE slug = 'rota-dos-lobos';
