
-- Create table for formative content travessias
CREATE TABLE public.conteudo_travessias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  ordem INTEGER NOT NULL DEFAULT 0,
  portal_minimo public.portal_type NOT NULL DEFAULT 'visitante',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for formative content aulas
CREATE TABLE public.conteudo_aulas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  travessia_id UUID NOT NULL REFERENCES public.conteudo_travessias(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao_curta TEXT NOT NULL DEFAULT '',
  ordem INTEGER NOT NULL DEFAULT 0,
  video_embed_url TEXT,
  materiais_url TEXT,
  portal_minimo public.portal_type NOT NULL DEFAULT 'visitante',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conteudo_travessias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conteudo_aulas ENABLE ROW LEVEL SECURITY;

-- RLS policies for conteudo_travessias
CREATE POLICY "Admins can manage conteudo_travessias"
ON public.conteudo_travessias
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

CREATE POLICY "Users can view conteudo_travessias by portal"
ON public.conteudo_travessias
FOR SELECT
USING (has_portal_access(auth.uid(), portal_minimo));

-- RLS policies for conteudo_aulas
CREATE POLICY "Admins can manage conteudo_aulas"
ON public.conteudo_aulas
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

CREATE POLICY "Users can view conteudo_aulas by portal"
ON public.conteudo_aulas
FOR SELECT
USING (has_portal_access(auth.uid(), portal_minimo));

-- Triggers for updated_at
CREATE TRIGGER update_conteudo_travessias_updated_at
BEFORE UPDATE ON public.conteudo_travessias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conteudo_aulas_updated_at
BEFORE UPDATE ON public.conteudo_aulas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_conteudo_travessias_ordem ON public.conteudo_travessias(ordem);
CREATE INDEX idx_conteudo_aulas_travessia_id ON public.conteudo_aulas(travessia_id);
CREATE INDEX idx_conteudo_aulas_ordem ON public.conteudo_aulas(ordem);
