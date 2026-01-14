-- Create travessia_library_items table
CREATE TABLE public.travessia_library_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  titulo_ritual TEXT NOT NULL,
  subtitulo TEXT,
  categoria TEXT NOT NULL DEFAULT 'Travessias do Campo',
  quando_chamada TEXT NOT NULL DEFAULT '',
  o_que_sustenta TEXT NOT NULL DEFAULT '',
  como_atravessar TEXT NOT NULL DEFAULT '',
  capa_url TEXT,
  portal_minimo public.portal_type NOT NULL DEFAULT 'pre_iniciada'::portal_type,
  publicado BOOLEAN NOT NULL DEFAULT false,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create travessia_library_media table
CREATE TABLE public.travessia_library_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.travessia_library_items(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('image', 'video', 'audio', 'pdf', 'link')),
  url TEXT NOT NULL,
  titulo TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create travessia_library_tags table
CREATE TABLE public.travessia_library_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.travessia_library_items(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(item_id, tag)
);

-- Create indexes
CREATE INDEX idx_travessia_library_items_slug ON public.travessia_library_items(slug);
CREATE INDEX idx_travessia_library_items_categoria ON public.travessia_library_items(categoria);
CREATE INDEX idx_travessia_library_items_portal ON public.travessia_library_items(portal_minimo);
CREATE INDEX idx_travessia_library_items_publicado ON public.travessia_library_items(publicado);
CREATE INDEX idx_travessia_library_media_item ON public.travessia_library_media(item_id);
CREATE INDEX idx_travessia_library_tags_item ON public.travessia_library_tags(item_id);

-- Enable RLS
ALTER TABLE public.travessia_library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travessia_library_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travessia_library_tags ENABLE ROW LEVEL SECURITY;

-- Trigger for updated_at
CREATE TRIGGER update_travessia_library_items_updated_at
  BEFORE UPDATE ON public.travessia_library_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies for travessia_library_items

-- Admin full access
CREATE POLICY "Admins can manage all travessia library items"
  ON public.travessia_library_items
  FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin'::portal_type)
  WITH CHECK (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Authenticated users can view published items they have access to
CREATE POLICY "Users can view published travessia library items by portal"
  ON public.travessia_library_items
  FOR SELECT
  USING (
    publicado = true 
    AND has_portal_access(auth.uid(), portal_minimo)
  );

-- Visitantes can see preview (only basic fields needed for locked state)
-- Note: RLS allows row access; field filtering handled in frontend
CREATE POLICY "Visitantes can preview published items"
  ON public.travessia_library_items
  FOR SELECT
  USING (
    publicado = true 
    AND get_user_portal(auth.uid()) = 'visitante'::portal_type
  );

-- RLS policies for travessia_library_media

-- Admin full access
CREATE POLICY "Admins can manage all travessia library media"
  ON public.travessia_library_media
  FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin'::portal_type)
  WITH CHECK (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Users can view media if they can access the parent item
CREATE POLICY "Users can view media of accessible items"
  ON public.travessia_library_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.travessia_library_items i
      WHERE i.id = item_id
      AND i.publicado = true
      AND has_portal_access(auth.uid(), i.portal_minimo)
    )
  );

-- RLS policies for travessia_library_tags

-- Admin full access
CREATE POLICY "Admins can manage all travessia library tags"
  ON public.travessia_library_tags
  FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin'::portal_type)
  WITH CHECK (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Users can view tags of accessible items
CREATE POLICY "Users can view tags of accessible items"
  ON public.travessia_library_tags
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.travessia_library_items i
      WHERE i.id = item_id
      AND i.publicado = true
      AND has_portal_access(auth.uid(), i.portal_minimo)
    )
  );

-- Seed example item
INSERT INTO public.travessia_library_items (
  slug,
  titulo_ritual,
  subtitulo,
  categoria,
  quando_chamada,
  o_que_sustenta,
  como_atravessar,
  portal_minimo,
  publicado,
  ordem
) VALUES (
  'caderno-ritual-cisne-negro',
  'Caderno Ritual do Cisne Negro',
  'O que emerge quando tudo desmorona',
  'Travessias do Imprevisível',
  'Quando o inesperado atravessa a vida — uma perda súbita, um diagnóstico, uma ruptura que não estava no roteiro. Quando a pessoa precisa de um espaço para nomear o que ainda não tem nome.',
  'Sustenta o campo de contenção simbólica para o que não pode ser explicado, apenas atravessado. Oferece estrutura mínima para que o caos encontre forma — não resolução, mas presença. Metaboliza o impacto sem pressa de integrar.',
  'Pode ser feito sozinha, entre sessões, ou com acompanhamento. O caderno é escrito à mão. Não há tempo certo. O ritual de fechamento só acontece quando a pessoa sente que pode nomear o que viveu.',
  'pre_iniciada'::portal_type,
  true,
  1
);