-- Add missing columns to conteudo_travessias
ALTER TABLE public.conteudo_travessias
ADD COLUMN IF NOT EXISTS subtitulo text DEFAULT '',
ADD COLUMN IF NOT EXISTS capa_url text,
ADD COLUMN IF NOT EXISTS publicado boolean NOT NULL DEFAULT true;

-- Add missing column to conteudo_aulas
ALTER TABLE public.conteudo_aulas
ADD COLUMN IF NOT EXISTS publicado boolean NOT NULL DEFAULT true;

-- Create index for filtering published content
CREATE INDEX IF NOT EXISTS idx_conteudo_travessias_publicado ON public.conteudo_travessias(publicado);
CREATE INDEX IF NOT EXISTS idx_conteudo_aulas_publicado ON public.conteudo_aulas(publicado);