
-- Enum para tipo de módulo
CREATE TYPE public.tipo_modulo AS ENUM ('jornada', 'curso', 'circulo', 'travessia', 'biblioteca');

-- Enum para nível de acesso do módulo
CREATE TYPE public.nivel_acesso_modulo AS ENUM ('aberta', 'iniciada', 'certificada', 'mentoria');

-- Enum para status de publicação
CREATE TYPE public.status_publicacao AS ENUM ('rascunho', 'publicado');

-- Tabela principal
CREATE TABLE public.modulos_formativos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_modulo TEXT NOT NULL,
  tipo_modulo public.tipo_modulo NOT NULL DEFAULT 'curso',
  descricao_curta TEXT,
  imagem_capa TEXT,
  ordem_exibicao INTEGER NOT NULL DEFAULT 0,
  nivel_acesso public.nivel_acesso_modulo NOT NULL DEFAULT 'aberta',
  status_publicacao public.status_publicacao NOT NULL DEFAULT 'rascunho',
  destaque_vitrine BOOLEAN NOT NULL DEFAULT false,
  rota_destino TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.modulos_formativos ENABLE ROW LEVEL SECURITY;

-- Everyone can read published modules
CREATE POLICY "Anyone can read published modules"
  ON public.modulos_formativos
  FOR SELECT
  USING (status_publicacao = 'publicado' OR public.is_admin(auth.uid()));

-- Only admins can insert
CREATE POLICY "Admins can insert modules"
  ON public.modulos_formativos
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can update
CREATE POLICY "Admins can update modules"
  ON public.modulos_formativos
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Only admins can delete
CREATE POLICY "Admins can delete modules"
  ON public.modulos_formativos
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_modulos_formativos_updated_at
  BEFORE UPDATE ON public.modulos_formativos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
