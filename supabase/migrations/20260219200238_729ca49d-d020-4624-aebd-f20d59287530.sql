
-- Tabela de aulas vinculadas aos ciclos do Clube do Livro
CREATE TABLE public.clube_livro_aulas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ciclo_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  descricao TEXT,
  duracao TEXT,
  conteudo TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'texto',
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  publicado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clube_livro_aulas ENABLE ROW LEVEL SECURITY;

-- Política de leitura: aulas publicadas e ativas para todos autenticados
CREATE POLICY "Authenticated users can read active published aulas"
ON public.clube_livro_aulas
FOR SELECT
USING (
  (ativo = true AND publicado = true AND auth.role() = 'authenticated')
  OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal IN ('admin', 'guardia'))
);

-- Admin pode tudo
CREATE POLICY "Admins can manage clube_livro_aulas"
ON public.clube_livro_aulas
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal IN ('admin', 'guardia'))
);

-- Index
CREATE INDEX idx_clube_livro_aulas_ciclo ON public.clube_livro_aulas(ciclo_id);

-- Trigger para updated_at
CREATE TRIGGER update_clube_livro_aulas_updated_at
BEFORE UPDATE ON public.clube_livro_aulas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
