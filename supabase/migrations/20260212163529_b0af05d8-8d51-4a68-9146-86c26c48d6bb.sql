
-- ============================================
-- LABIRINTO DA HEROÍNA — ESTRUTURA CLÍNICA
-- ============================================

-- 1. Estender labirinto_fases com campos clínicos
ALTER TABLE public.labirinto_fases 
  ADD COLUMN IF NOT EXISTS nucleo text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tema_central text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS pergunta_chave text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS exercicio_titulo text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS exercicio_instrucao text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ritual_texto text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS codigo_interno text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS versao_conteudo text DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS observacoes_admin text DEFAULT NULL;

-- 2. Tabela: sessoes_labirinto (sessões clínicas)
CREATE TABLE IF NOT EXISTS public.sessoes_labirinto (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  modo text NOT NULL DEFAULT 'pessoal' CHECK (modo IN ('pessoal', 'profissional')),
  cliente_nome text,
  porta_id uuid REFERENCES public.labirinto_fases(id) ON DELETE SET NULL,
  data_sessao timestamptz NOT NULL DEFAULT now(),
  observacoes_clinicas text,
  hipotese_terapeutica text,
  emocao_dominante text,
  padrao_defensivo text,
  direcionamento_terapeutico text,
  micro_acao_definida text,
  registro_acao text,
  registro_percepcao text,
  concluida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Tabela: respostas_exercicios
CREATE TABLE IF NOT EXISTS public.respostas_exercicios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sessao_id uuid NOT NULL REFERENCES public.sessoes_labirinto(id) ON DELETE CASCADE,
  pergunta_1 text,
  pergunta_2 text,
  pergunta_3 text,
  campo_corporal text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Tabela: mapa_heroina (registro longitudinal)
CREATE TABLE IF NOT EXISTS public.mapa_heroina (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  cliente_nome text,
  porta_id uuid REFERENCES public.labirinto_fases(id) ON DELETE SET NULL,
  data_registro timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'integrada')),
  evolucao_texto text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. RLS: sessoes_labirinto
ALTER TABLE public.sessoes_labirinto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON public.sessoes_labirinto FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create own sessions"
  ON public.sessoes_labirinto FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.sessoes_labirinto FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 6. RLS: respostas_exercicios (via sessao ownership)
ALTER TABLE public.respostas_exercicios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own exercise responses"
  ON public.respostas_exercicios FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.sessoes_labirinto s
      WHERE s.id = sessao_id AND (s.user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

-- 7. RLS: mapa_heroina
ALTER TABLE public.mapa_heroina ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own map"
  ON public.mapa_heroina FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create own map entries"
  ON public.mapa_heroina FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own map entries"
  ON public.mapa_heroina FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 8. Triggers de updated_at
CREATE TRIGGER update_sessoes_labirinto_updated_at
  BEFORE UPDATE ON public.sessoes_labirinto
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mapa_heroina_updated_at
  BEFORE UPDATE ON public.mapa_heroina
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Índices
CREATE INDEX IF NOT EXISTS idx_sessoes_labirinto_user_id ON public.sessoes_labirinto(user_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_labirinto_porta_id ON public.sessoes_labirinto(porta_id);
CREATE INDEX IF NOT EXISTS idx_mapa_heroina_user_id ON public.mapa_heroina(user_id);
CREATE INDEX IF NOT EXISTS idx_mapa_heroina_porta_id ON public.mapa_heroina(porta_id);
