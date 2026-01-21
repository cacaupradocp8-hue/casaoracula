-- ================================================
-- JARDIM DA PSIQUE - Espaço privado de registros
-- ================================================
-- 100% privado: só o próprio usuário acessa

CREATE TABLE public.jardim_psique_registros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identificação da ferramenta
  ferramenta_nome TEXT NOT NULL,
  ferramenta_chave TEXT NOT NULL,
  
  -- Conteúdo da aplicação
  data_aplicacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  conteudo JSONB NOT NULL DEFAULT '{}',
  resultado_simbolico JSONB,
  
  -- Reflexão pessoal (editável ao longo do tempo)
  reflexao_pessoal TEXT,
  
  -- Organização
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  arquivado BOOLEAN NOT NULL DEFAULT false,
  integrado BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_jardim_psique_user ON public.jardim_psique_registros(user_id);
CREATE INDEX idx_jardim_psique_ferramenta ON public.jardim_psique_registros(ferramenta_chave);
CREATE INDEX idx_jardim_psique_data ON public.jardim_psique_registros(data_aplicacao DESC);
CREATE INDEX idx_jardim_psique_arquivado ON public.jardim_psique_registros(arquivado);

-- Trigger para updated_at
CREATE TRIGGER update_jardim_psique_updated_at
  BEFORE UPDATE ON public.jardim_psique_registros
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- RLS ESTRITO: SOMENTE O PRÓPRIO USUÁRIO
-- ================================================
-- Nenhum admin, terapeuta ou outro papel pode ver

ALTER TABLE public.jardim_psique_registros ENABLE ROW LEVEL SECURITY;

-- SELECT: apenas próprio usuário
CREATE POLICY "jardim_psique_select_own"
  ON public.jardim_psique_registros
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: apenas próprio usuário
CREATE POLICY "jardim_psique_insert_own"
  ON public.jardim_psique_registros
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: apenas próprio usuário
CREATE POLICY "jardim_psique_update_own"
  ON public.jardim_psique_registros
  FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: apenas próprio usuário (arquivar é preferido)
CREATE POLICY "jardim_psique_delete_own"
  ON public.jardim_psique_registros
  FOR DELETE
  USING (auth.uid() = user_id);

-- Comentário para documentação
COMMENT ON TABLE public.jardim_psique_registros IS 'Espaço 100% privado para registros pessoais de aplicações de ferramentas. Nenhum admin ou terapeuta tem acesso.';
