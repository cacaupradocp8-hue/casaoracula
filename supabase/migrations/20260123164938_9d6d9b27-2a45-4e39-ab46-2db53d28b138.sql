-- ====================================
-- SISTEMA CLÍNICO ORÁCULA
-- Atlas de Arquétipos + Decodificação Onírica
-- ====================================

-- 1. Tabela principal: Atlas de Arquétipos Femininos
CREATE TABLE public.atlas_arquetipos_femininos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  chave TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  territorio TEXT NOT NULL CHECK (territorio IN ('sustentacao', 'travessia', 'profundidade', 'integracao')),
  
  -- LÂMINA CLÍNICA (estrutura fixa obrigatória)
  descricao_clinica TEXT NOT NULL,
  manifestacoes_frequentes TEXT[] DEFAULT '{}',
  perguntas_sessao TEXT[] DEFAULT '{}',
  riscos_projecao TEXT[] DEFAULT '{}',
  trabalhar_forca_sem_reforcar_ferida TEXT,
  
  -- Visual e Ordenação
  icone TEXT DEFAULT 'Sparkles',
  cor_acento TEXT DEFAULT 'gold',
  posicao_x FLOAT DEFAULT 0,
  posicao_y FLOAT DEFAULT 0,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de associação Torre Viva ↔ Arquétipo
CREATE TABLE public.torre_arquetipo_sugestao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torre_id TEXT NOT NULL CHECK (torre_id IN ('controle', 'performance', 'silencio', 'cuidado', 'adaptacao', 'espiritualizacao', 'forca')),
  arquetipo_id UUID REFERENCES public.atlas_arquetipos_femininos(id) ON DELETE CASCADE,
  frequencia TEXT DEFAULT 'comum' CHECK (frequencia IN ('muito_frequente', 'comum', 'ocasional')),
  nota_clinica TEXT,
  ordem INTEGER DEFAULT 0,
  UNIQUE(torre_id, arquetipo_id)
);

-- 3. Tabela: Decodificação Onírica Aplicada
CREATE TABLE public.decodificacao_onirica (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  terapeuta_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  session_case_id UUID REFERENCES public.session_cases(id) ON DELETE SET NULL,
  
  -- Registro do Sonho
  sonho_bruto TEXT NOT NULL,
  
  -- 4 Camadas de Decodificação
  imagem_central TEXT,
  forca_psiquica TEXT,
  movimento_interrompido TEXT,
  mensagem_viva TEXT,
  
  -- Sugestão de Arquétipos (opcional)
  arquetipos_sugeridos UUID[] DEFAULT '{}',
  notas_terapeuta TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Habilitar RLS em todas as tabelas
ALTER TABLE public.atlas_arquetipos_femininos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.torre_arquetipo_sugestao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decodificacao_onirica ENABLE ROW LEVEL SECURITY;

-- 5. Função helper para verificar se é admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND portal = 'admin'
  )
$$;

-- 6. Políticas RLS para Atlas (leitura pública para autenticados, escrita admin)
CREATE POLICY "Atlas visível para autenticados"
ON public.atlas_arquetipos_femininos
FOR SELECT
TO authenticated
USING (ativo = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admin pode inserir no Atlas"
ON public.atlas_arquetipos_femininos
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin pode atualizar o Atlas"
ON public.atlas_arquetipos_femininos
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin pode deletar do Atlas"
ON public.atlas_arquetipos_femininos
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 7. Políticas RLS para Torre-Arquétipo (leitura autenticados, escrita admin)
CREATE POLICY "Sugestões visíveis para autenticados"
ON public.torre_arquetipo_sugestao
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin pode gerenciar sugestões"
ON public.torre_arquetipo_sugestao
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 8. Políticas RLS para Decodificação Onírica (terapeuta vê próprios registros)
CREATE POLICY "Terapeuta vê próprias decodificações"
ON public.decodificacao_onirica
FOR SELECT
TO authenticated
USING (terapeuta_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Terapeuta pode criar decodificações"
ON public.decodificacao_onirica
FOR INSERT
TO authenticated
WITH CHECK (terapeuta_id = auth.uid());

CREATE POLICY "Terapeuta pode atualizar próprias decodificações"
ON public.decodificacao_onirica
FOR UPDATE
TO authenticated
USING (terapeuta_id = auth.uid());

CREATE POLICY "Terapeuta pode deletar próprias decodificações"
ON public.decodificacao_onirica
FOR DELETE
TO authenticated
USING (terapeuta_id = auth.uid() OR public.is_admin(auth.uid()));

-- 9. Trigger para updated_at
CREATE TRIGGER update_atlas_arquetipos_updated_at
BEFORE UPDATE ON public.atlas_arquetipos_femininos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_decodificacao_onirica_updated_at
BEFORE UPDATE ON public.decodificacao_onirica
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();