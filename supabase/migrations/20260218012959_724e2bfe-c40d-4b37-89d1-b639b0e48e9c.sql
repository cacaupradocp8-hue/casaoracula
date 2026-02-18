
-- ============================================
-- INTEGRAÇÃO 80/20 — Clube do Livro
-- ============================================

-- Tabela de configuração autoral por ciclo (admin define)
CREATE TABLE IF NOT EXISTS public.clube_livro_integracao_8020_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ciclo_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  -- Bloco 1: Essência do Livro
  essencia_texto TEXT,
  tensao_central TEXT,
  transformacao_proposta TEXT,
  comportamento_abandonar TEXT,
  -- Bloco 2: Tradução Profissional - Como vira aula
  aula_conceito TEXT,
  aula_exemplo TEXT,
  aula_exercicio TEXT,
  -- Bloco 2: Tradução Profissional - Como vira sessão
  sessao_pergunta TEXT,
  sessao_escuta TEXT,
  sessao_resistencia TEXT,
  -- Bloco 2: Tradução Profissional - Como vira palestra
  palestra_narrativa TEXT,
  palestra_ideia TEXT,
  palestra_convite TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ciclo_id)
);

-- Tabela de registros por usuária por ciclo
CREATE TABLE IF NOT EXISTS public.clube_livro_integracao_8020 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ciclo_id UUID NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  -- Bloco 3: Aplicação Pessoal
  aplicacao_pessoal_onde TEXT,
  aplicacao_pessoal_comportamento TEXT,
  aplicacao_pessoal_acao TEXT,
  -- Bloco 4: Registro Integrado
  registro_livre TEXT,
  notas_profissionais TEXT,
  status TEXT NOT NULL DEFAULT 'em_andamento',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, ciclo_id)
);

-- RLS
ALTER TABLE public.clube_livro_integracao_8020_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_livro_integracao_8020 ENABLE ROW LEVEL SECURITY;

-- Config: leitura para todas autenticadas
CREATE POLICY "config_8020_select_authenticated"
  ON public.clube_livro_integracao_8020_config
  FOR SELECT TO authenticated
  USING (true);

-- Config: escrita apenas para admin
CREATE POLICY "config_8020_insert_admin"
  ON public.clube_livro_integracao_8020_config
  FOR INSERT TO authenticated
  WITH CHECK (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "config_8020_update_admin"
  ON public.clube_livro_integracao_8020_config
  FOR UPDATE TO authenticated
  USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "config_8020_delete_admin"
  ON public.clube_livro_integracao_8020_config
  FOR DELETE TO authenticated
  USING (public.get_user_portal(auth.uid()) = 'admin');

-- Registros: usuária vê e altera apenas os seus
CREATE POLICY "registro_8020_select_own"
  ON public.clube_livro_integracao_8020
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "registro_8020_insert_own"
  ON public.clube_livro_integracao_8020
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "registro_8020_update_own"
  ON public.clube_livro_integracao_8020
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "registro_8020_delete_own"
  ON public.clube_livro_integracao_8020
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Admin lê todos os registros (para métricas)
CREATE POLICY "registro_8020_select_admin"
  ON public.clube_livro_integracao_8020
  FOR SELECT TO authenticated
  USING (public.get_user_portal(auth.uid()) = 'admin');

-- Trigger de updated_at
CREATE TRIGGER update_integracao_8020_config_updated_at
  BEFORE UPDATE ON public.clube_livro_integracao_8020_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integracao_8020_updated_at
  BEFORE UPDATE ON public.clube_livro_integracao_8020
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
