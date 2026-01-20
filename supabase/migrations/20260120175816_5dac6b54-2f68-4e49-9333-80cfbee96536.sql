-- Tabela para configurações personalizáveis da área de formação (página /salas)
CREATE TABLE public.formacao_area_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Banners da Mentoria
  mentoria_banner_url TEXT,
  mentoria_titulo TEXT DEFAULT 'Mentoria Orácula',
  mentoria_subtitulo TEXT DEFAULT 'Jornada pessoal simbólica',
  mentoria_descricao TEXT DEFAULT 'Sua jornada pessoal de autoconhecimento e transformação interior.',
  mentoria_icone TEXT DEFAULT 'Moon',
  mentoria_cor TEXT DEFAULT 'purple',
  mentoria_itens TEXT[] DEFAULT ARRAY['Jornada pessoal de autodescoberta', 'Práticas simbólicas guiadas', 'Sem aplicação profissional'],
  mentoria_ativa BOOLEAN DEFAULT true,
  
  -- Banners da Formação
  formacao_banner_url TEXT,
  formacao_titulo TEXT DEFAULT 'Formação Orácula',
  formacao_subtitulo TEXT DEFAULT 'Capacitação profissional',
  formacao_descricao TEXT DEFAULT 'Formação completa para se tornar uma facilitadora do método ORÁCULA.',
  formacao_icone TEXT DEFAULT 'Star',
  formacao_cor TEXT DEFAULT 'gold',
  formacao_itens TEXT[] DEFAULT ARRAY['Currículo estruturado', 'Ensino do método', 'Certificação profissional'],
  formacao_ativa BOOLEAN DEFAULT true,
  
  -- Configurações gerais
  mostrar_salas_estudo BOOLEAN DEFAULT true,
  titulo_salas_estudo TEXT DEFAULT 'Salas de Estudo',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configuração padrão
INSERT INTO public.formacao_area_config (id) VALUES (gen_random_uuid());

-- Enable RLS
ALTER TABLE public.formacao_area_config ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Anyone can view formacao_area_config"
  ON public.formacao_area_config FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update formacao_area_config"
  ON public.formacao_area_config FOR UPDATE
  USING (public.get_user_portal(auth.uid()) = 'admin');

-- Trigger para atualizar updated_at
CREATE TRIGGER update_formacao_area_config_updated_at
  BEFORE UPDATE ON public.formacao_area_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();