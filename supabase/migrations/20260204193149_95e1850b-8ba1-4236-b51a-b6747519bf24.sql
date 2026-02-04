-- =============================================
-- REINO DOS CENÁRIOS — Camada 3 do Labirinto
-- Metáforas simbólicas / Paisagens psíquicas
-- =============================================

-- Adicionar campo de imagem à tabela de metáforas
ALTER TABLE public.labirinto_metaforas 
ADD COLUMN IF NOT EXISTS imagem_url TEXT;

-- Criar tabela de registros de cenários contemplados
CREATE TABLE IF NOT EXISTS public.heroina_cenario_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metafora_id UUID NOT NULL REFERENCES public.labirinto_metaforas(id) ON DELETE CASCADE,
  anotacao_livre TEXT,
  registrado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_heroina_cenario_user ON public.heroina_cenario_registros(user_id);
CREATE INDEX IF NOT EXISTS idx_heroina_cenario_metafora ON public.heroina_cenario_registros(metafora_id);

-- Habilitar RLS
ALTER TABLE public.heroina_cenario_registros ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: usuário vê apenas seus próprios registros
CREATE POLICY "heroina_cenario_select_own"
ON public.heroina_cenario_registros
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "heroina_cenario_insert_own"
ON public.heroina_cenario_registros
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "heroina_cenario_update_own"
ON public.heroina_cenario_registros
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "heroina_cenario_delete_own"
ON public.heroina_cenario_registros
FOR DELETE
USING (auth.uid() = user_id);

-- Admin tem acesso total
CREATE POLICY "heroina_cenario_admin_all"
ON public.heroina_cenario_registros
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Comentários para documentação
COMMENT ON TABLE public.heroina_cenario_registros IS 'Reino dos Cenários - Registros de metáforas contempladas pela usuária';
COMMENT ON COLUMN public.heroina_cenario_registros.anotacao_livre IS 'Espaço livre para anotações contemplativas da usuária';