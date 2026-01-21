-- Create image_assets table for centralized image gallery
CREATE TABLE public.image_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  file_path TEXT NOT NULL,
  alt_text TEXT,
  categoria TEXT,
  tags TEXT[],
  largura INTEGER,
  altura INTEGER,
  tamanho_bytes INTEGER,
  portal_minimo public.portal_type DEFAULT 'visitante',
  publicado BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.image_assets ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins can manage image assets"
ON public.image_assets
FOR ALL
USING (public.get_user_portal(auth.uid()) = 'admin');

-- Published images can be read by anyone with portal access
CREATE POLICY "Users can view published images"
ON public.image_assets
FOR SELECT
USING (
  publicado = true 
  AND public.has_portal_access(auth.uid(), portal_minimo)
);

-- Add updated_at trigger
CREATE TRIGGER update_image_assets_updated_at
BEFORE UPDATE ON public.image_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for common queries
CREATE INDEX idx_image_assets_categoria ON public.image_assets(categoria);
CREATE INDEX idx_image_assets_publicado ON public.image_assets(publicado);