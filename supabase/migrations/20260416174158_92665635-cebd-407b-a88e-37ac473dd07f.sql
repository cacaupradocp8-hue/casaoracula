
-- 1. Add application fields to clube_estacoes (the station/book level)
ALTER TABLE public.clube_estacoes
  ADD COLUMN IF NOT EXISTS aplicar_mim_instrucao TEXT,
  ADD COLUMN IF NOT EXISTS aplicar_mim_exercicio TEXT,
  ADD COLUMN IF NOT EXISTS aplicar_sessao_pergunta TEXT,
  ADD COLUMN IF NOT EXISTS aplicar_sessao_intervencao TEXT,
  ADD COLUMN IF NOT EXISTS aplicar_sessao_risco TEXT,
  ADD COLUMN IF NOT EXISTS aplicar_grupo_dinamica TEXT,
  ADD COLUMN IF NOT EXISTS aplicar_grupo_regra TEXT,
  ADD COLUMN IF NOT EXISTS aplicar_grupo_risco TEXT;

-- 2. Add optional conteudo_semanal_id to clube_jornadas
ALTER TABLE public.clube_jornadas
  ADD COLUMN IF NOT EXISTS conteudo_semanal_id UUID REFERENCES public.clube_conteudo_semanal(id) ON DELETE SET NULL;

-- 3. Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clube_jornadas_conteudo_semanal
  ON public.clube_jornadas(conteudo_semanal_id)
  WHERE conteudo_semanal_id IS NOT NULL;
