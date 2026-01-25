-- EXPAND course_modules table for Pedagogical Module format
-- Adds JSONB fields for the 5 pedagogical blocks

-- Block 1: Main Video
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS video_principal_url TEXT;
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS video_principal_titulo TEXT;
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS video_principal_duracao INTEGER; -- minutes

-- Block 2: Reading Cards (up to 12 cards)
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS cards_leitura JSONB DEFAULT '[]'::jsonb;
-- Structure: [{ "numero": 1, "texto": "..." }, ...]

-- Block 3: Practical Tool Reference
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS ferramenta_pratica JSONB;
-- Structure: { "nome": "...", "descricao": "...", "rota": "/..." }

-- Block 4: Case Studies (up to 3)
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS estudos_caso JSONB DEFAULT '[]'::jsonb;
-- Structure: [{ "titulo": "...", "texto": "..." }, ...]

-- Block 5: Reflexive Check (up to 5 questions, no grades)
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS check_maturidade JSONB DEFAULT '[]'::jsonb;
-- Structure: [{ "pergunta": "..." }, ...]

-- Module header extras
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS subtitulo TEXT;

-- Flag to identify pedagogical modules (vs simple lesson lists)
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS formato_pedagogico BOOLEAN DEFAULT false;

-- Add index for pedagogical modules
CREATE INDEX IF NOT EXISTS idx_course_modules_formato ON public.course_modules(formato_pedagogico) WHERE formato_pedagogico = true;