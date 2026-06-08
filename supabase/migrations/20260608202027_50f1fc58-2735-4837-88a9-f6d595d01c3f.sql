ALTER TABLE public.clube_estacoes ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
UPDATE public.clube_estacoes SET slug = lower(replace(titulo, ' ', '-')) WHERE slug IS NULL;