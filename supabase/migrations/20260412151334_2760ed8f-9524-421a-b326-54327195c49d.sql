
ALTER TABLE public.clube_portais
  ADD COLUMN IF NOT EXISTS narroterapia_conto_sugerido TEXT,
  ADD COLUMN IF NOT EXISTS narroterapia_abertura TEXT,
  ADD COLUMN IF NOT EXISTS narroterapia_perguntas TEXT[],
  ADD COLUMN IF NOT EXISTS forja_cenario TEXT,
  ADD COLUMN IF NOT EXISTS forja_portal_ativo TEXT,
  ADD COLUMN IF NOT EXISTS forja_conducao TEXT[],
  ADD COLUMN IF NOT EXISTS forja_erros_comuns TEXT[],
  ADD COLUMN IF NOT EXISTS forja_ajuste_fino TEXT,
  ADD COLUMN IF NOT EXISTS ferramenta_descricao TEXT,
  ADD COLUMN IF NOT EXISTS laboratorio_resultado_esperado TEXT;
