-- ========================================
-- FASE 1: Tabelas plans e audio_assets (CORRIGIDO)
-- ========================================

-- 1.1 Tabela de Planos (para exibir na UI)
CREATE TABLE IF NOT EXISTS public.plans (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_mensal DECIMAL(10,2) DEFAULT 0,
  portal_resultante public.portal_type NOT NULL,
  max_clientes INTEGER NOT NULL DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  destaque BOOLEAN DEFAULT false,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir planos padrão
INSERT INTO public.plans (id, nome, descricao, preco_mensal, portal_resultante, max_clientes, features, destaque, ordem) VALUES
('visitante', 'Visitante', 'Acesso inicial à Casa ORÁCULA', 0, 'visitante', 2, '["Conteúdos simbólicos curtos", "Perguntas-oráculo", "Exploração da tese central", "Até 2 clientes"]', false, 1),
('pre_iniciada', 'Pré-Iniciada', 'Início da jornada formativa', 97, 'pre_iniciada', 10, '["Leitura Simbólica em 5 Camadas", "Radar de Eixo", "Trilha de Neuroplasticidade", "Biblioteca simbólica inicial", "Até 10 clientes"]', false, 2),
('iniciada', 'Iniciada ORÁCULA', 'Formação completa nos 4 Portais', 197, 'iniciada', -1, '["Formação completa", "Biblioteca simbólica profunda", "Clientes ilimitados", "Área de mentoria/supervisão", "Portal de Leitura Oracular"]', true, 3)
ON CONFLICT (id) DO NOTHING;

-- RLS para plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ver planos ativos
CREATE POLICY "Planos ativos são públicos"
  ON public.plans FOR SELECT
  USING (ativo = true);

-- Apenas admin pode modificar
CREATE POLICY "Admin pode gerenciar planos"
  ON public.plans FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND portal = 'admin'
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 1.2 Tabela de Áudios
-- ========================================

CREATE TABLE IF NOT EXISTS public.audio_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  file_path TEXT NOT NULL,
  duracao_segundos INTEGER,
  capa_url TEXT,
  portal_minimo public.portal_type DEFAULT 'visitante',
  publicado BOOLEAN DEFAULT false,
  ordem INTEGER DEFAULT 0,
  categoria TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para audio_assets
ALTER TABLE public.audio_assets ENABLE ROW LEVEL SECURITY;

-- Função helper para verificar acesso ao portal
CREATE OR REPLACE FUNCTION public.user_has_portal_access(required_portal public.portal_type)
RETURNS BOOLEAN AS $$
DECLARE
  user_portal public.portal_type;
  portal_levels JSONB := '{"visitante": 1, "pre_iniciada": 2, "iniciada": 3, "admin": 4}'::jsonb;
BEGIN
  -- Se não autenticado, considerar visitante
  IF auth.uid() IS NULL THEN
    RETURN (portal_levels->>required_portal::text)::int <= 1;
  END IF;
  
  -- Buscar portal do usuário
  SELECT portal INTO user_portal
  FROM public.user_roles
  WHERE user_id = auth.uid();
  
  IF user_portal IS NULL THEN
    user_portal := 'visitante';
  END IF;
  
  -- Comparar níveis
  RETURN (portal_levels->>user_portal::text)::int >= (portal_levels->>required_portal::text)::int;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Usuários podem ver áudios publicados se tiverem acesso ao portal
CREATE POLICY "Usuários veem áudios publicados do seu nível"
  ON public.audio_assets FOR SELECT
  USING (
    (publicado = true AND public.user_has_portal_access(portal_minimo))
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND portal = 'admin'
    )
  );

-- Admin pode tudo
CREATE POLICY "Admin gerencia áudios"
  ON public.audio_assets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND portal = 'admin'
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_audio_assets_updated_at
  BEFORE UPDATE ON public.audio_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 1.3 Bucket de Áudios
-- ========================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audios',
  'audios',
  true,
  52428800,
  ARRAY['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/ogg']
) ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para áudios

-- Qualquer um pode ler áudios (público)
CREATE POLICY "Áudios são públicos para leitura"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audios');

-- Apenas admin pode fazer upload
CREATE POLICY "Admin pode fazer upload de áudios"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'audios'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND portal = 'admin'
    )
  );

-- Admin pode atualizar
CREATE POLICY "Admin pode atualizar áudios"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'audios'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND portal = 'admin'
    )
  );

-- Admin pode deletar
CREATE POLICY "Admin pode deletar áudios"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'audios'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND portal = 'admin'
    )
  );