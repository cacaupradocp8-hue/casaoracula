-- Adicionar campo de natureza_porta na tabela de relação para documentar cada associação
ALTER TABLE public.torre_porta_relacao 
ADD COLUMN IF NOT EXISTS natureza_porta text;

-- Criar tabela expandida para Biblioteca de Casos (mais casos além dos 7 modelo)
CREATE TABLE IF NOT EXISTS public.biblioteca_casos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  torre_id text NOT NULL CHECK (torre_id IN ('controle', 'performance', 'silencio', 'cuidado', 'adaptacao', 'espiritualizacao', 'forca')),
  porta_id uuid REFERENCES public.labirinto_portas(id) ON DELETE SET NULL,
  porta_nome text, -- fallback se porta_id for null
  titulo text,
  cena text NOT NULL,
  erro_comum text NOT NULL,
  leitura_oracula text NOT NULL,
  resultado text NOT NULL,
  risco_tipo text CHECK (risco_tipo IN ('pressa', 'interpretacao', 'confronto', 'moralizacao', 'resiliencia', 'explicacao', 'outro')),
  tags text[],
  fonte text, -- 'modelo', 'supervisao', 'comunidade'
  autor_id uuid,
  ativa boolean DEFAULT true,
  ordem integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.biblioteca_casos ENABLE ROW LEVEL SECURITY;

-- RLS: Leitura para oracula+
CREATE POLICY "Leitura casos para oracula"
ON public.biblioteca_casos FOR SELECT
USING (public.get_user_portal(auth.uid()) IN ('oracula', 'admin'));

-- RLS: Admin pode gerenciar
CREATE POLICY "Admin pode inserir biblioteca_casos"
ON public.biblioteca_casos FOR INSERT
WITH CHECK (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Admin pode atualizar biblioteca_casos"
ON public.biblioteca_casos FOR UPDATE
USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Admin pode deletar biblioteca_casos"
ON public.biblioteca_casos FOR DELETE
USING (public.get_user_portal(auth.uid()) = 'admin');

-- Trigger updated_at
CREATE TRIGGER update_biblioteca_casos_updated_at
BEFORE UPDATE ON public.biblioteca_casos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();