
-- ==========================================
-- MÓDULO: INTEGRAÇÃO ORACULAR
-- Clube do Livro × Experiência Prática
-- ==========================================

-- Tabela principal de integrações por ciclo
CREATE TABLE public.clube_livro_integracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ciclo_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  -- Registro Oracular (campo de escrita livre)
  registro_oracular TEXT,
  -- Progresso dos movimentos (JSON array de booleans)
  movimentos_concluidos BOOLEAN[] DEFAULT ARRAY[false, false, false],
  -- Ritual simbólico concluído
  ritual_concluido BOOLEAN DEFAULT false,
  -- Status geral
  status TEXT NOT NULL DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'concluida')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, ciclo_id)
);

-- Enable RLS
ALTER TABLE public.clube_livro_integracoes ENABLE ROW LEVEL SECURITY;

-- Apenas a própria usuária acessa seus registros
CREATE POLICY "integracoes_select_own" ON public.clube_livro_integracoes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "integracoes_insert_own" ON public.clube_livro_integracoes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "integracoes_update_own" ON public.clube_livro_integracoes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "integracoes_delete_own" ON public.clube_livro_integracoes
  FOR DELETE USING (auth.uid() = user_id);

-- Admin pode ver tudo (para suporte e administração)
CREATE POLICY "integracoes_admin_select" ON public.clube_livro_integracoes
  FOR SELECT USING (public.get_user_portal(auth.uid()) = 'admin');

-- Trigger para updated_at
CREATE TRIGGER update_clube_livro_integracoes_updated_at
  BEFORE UPDATE ON public.clube_livro_integracoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Conteúdo autoral das integrações por ciclo (gerenciado pelo admin)
CREATE TABLE public.clube_livro_integracao_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ciclo_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE UNIQUE,
  -- Pergunta central
  pergunta_central TEXT,
  -- Texto introdutório
  texto_introdutorio TEXT,
  -- Movimentos de Integração (máx 3)
  movimento_1 TEXT,
  movimento_2 TEXT,
  movimento_3 TEXT,
  -- Ritual Simbólico
  ritual_instrucao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS para config (leitura para alunas, escrita para admin)
ALTER TABLE public.clube_livro_integracao_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "integracao_config_select_authenticated" ON public.clube_livro_integracao_config
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "integracao_config_admin_insert" ON public.clube_livro_integracao_config
  FOR INSERT WITH CHECK (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "integracao_config_admin_update" ON public.clube_livro_integracao_config
  FOR UPDATE USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "integracao_config_admin_delete" ON public.clube_livro_integracao_config
  FOR DELETE USING (public.get_user_portal(auth.uid()) = 'admin');

-- Trigger para updated_at
CREATE TRIGGER update_clube_livro_integracao_config_updated_at
  BEFORE UPDATE ON public.clube_livro_integracao_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
