
-- =====================================================
-- EXPAND SEASON_LABS (Config - Admin fills per season)
-- Bloco 1: Essência Simbólica (expanded)
-- =====================================================
ALTER TABLE public.season_labs
  ADD COLUMN IF NOT EXISTS arquetipo_central TEXT,
  ADD COLUMN IF NOT EXISTS imagem_organizadora TEXT,
  ADD COLUMN IF NOT EXISTS transformacao_exigida TEXT;

-- =====================================================
-- Bloco 2: Tradução Profissional (expanded subsections)
-- =====================================================
-- Aula subsection
ALTER TABLE public.season_labs
  ADD COLUMN IF NOT EXISTS aula_objetivo TEXT,
  ADD COLUMN IF NOT EXISTS aula_vivencia TEXT,
  ADD COLUMN IF NOT EXISTS aula_pergunta_fechamento TEXT;

-- Sessão subsection
ALTER TABLE public.season_labs
  ADD COLUMN IF NOT EXISTS sessao_tema TEXT,
  ADD COLUMN IF NOT EXISTS sessao_pergunta_acesso TEXT,
  ADD COLUMN IF NOT EXISTS sessao_cuidado_etico TEXT,
  ADD COLUMN IF NOT EXISTS sessao_resistencia TEXT;

-- Palestra / Círculo subsection
ALTER TABLE public.season_labs
  ADD COLUMN IF NOT EXISTS palestra_imagem TEXT,
  ADD COLUMN IF NOT EXISTS palestra_narrativa TEXT,
  ADD COLUMN IF NOT EXISTS palestra_chamada TEXT,
  ADD COLUMN IF NOT EXISTS palestra_encerramento TEXT;

-- =====================================================
-- EXPAND LAB_8020_PROGRESS (User fills)
-- Bloco 3: Aplicação Encarnada
-- =====================================================
ALTER TABLE public.lab_8020_progress
  ADD COLUMN IF NOT EXISTS aplicacao_onde TEXT,
  ADD COLUMN IF NOT EXISTS aplicacao_comportamento TEXT,
  ADD COLUMN IF NOT EXISTS aplicacao_gesto TEXT;

-- =====================================================
-- Bloco 4: Registro Vivo
-- =====================================================
ALTER TABLE public.lab_8020_progress
  ADD COLUMN IF NOT EXISTS registro_reflexivo TEXT,
  ADD COLUMN IF NOT EXISTS notas_profissionais TEXT;
