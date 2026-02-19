
-- 1. Add is_multipolar flag to ciclos
ALTER TABLE public.clube_livro_ciclos 
ADD COLUMN IF NOT EXISTS is_multipolar boolean DEFAULT false;

-- 2. Create portas table
CREATE TABLE public.clube_livro_portas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ciclo_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  jornada TEXT NOT NULL CHECK (jornada IN ('heroina', 'sombra', 'corpo', 'instinto', 'lideranca')),
  titulo TEXT NOT NULL,
  descricao TEXT,
  icone TEXT,
  cor TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(ciclo_id, jornada)
);

-- 3. Add porta_id to aulas (nullable for backward compat)
ALTER TABLE public.clube_livro_aulas
ADD COLUMN IF NOT EXISTS porta_id UUID REFERENCES public.clube_livro_portas(id) ON DELETE SET NULL;

-- 4. Add porta_id to escutas
ALTER TABLE public.clube_livro_escutas
ADD COLUMN IF NOT EXISTS porta_id UUID REFERENCES public.clube_livro_portas(id) ON DELETE SET NULL;

-- 5. Add porta_id to fases
ALTER TABLE public.clube_livro_fases
ADD COLUMN IF NOT EXISTS porta_id UUID REFERENCES public.clube_livro_portas(id) ON DELETE SET NULL;

-- 6. Enable RLS
ALTER TABLE public.clube_livro_portas ENABLE ROW LEVEL SECURITY;

-- 7. RLS policies for portas
CREATE POLICY "Portas are viewable by authenticated users"
ON public.clube_livro_portas
FOR SELECT
USING (auth.uid() IS NOT NULL AND ativo = true);

CREATE POLICY "Admin can manage portas"
ON public.clube_livro_portas
FOR ALL
USING (public.is_admin(auth.uid()));

-- 8. Trigger for updated_at
CREATE TRIGGER update_clube_livro_portas_updated_at
BEFORE UPDATE ON public.clube_livro_portas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Index
CREATE INDEX idx_clube_livro_portas_ciclo ON public.clube_livro_portas(ciclo_id);
CREATE INDEX idx_clube_livro_aulas_porta ON public.clube_livro_aulas(porta_id);
