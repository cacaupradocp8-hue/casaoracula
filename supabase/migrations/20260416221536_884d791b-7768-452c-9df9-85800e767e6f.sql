-- FASE A: estacao_id como eixo principal da Central de Jornadas
-- Backfill não necessário: ambas as tabelas estão vazias (0 registros)
-- Além disso, clube_estacoes não tem ciclo_id (não há link derivável)

-- 1. clube_conteudo_semanal
ALTER TABLE public.clube_conteudo_semanal
  ADD COLUMN IF NOT EXISTS estacao_id uuid REFERENCES public.clube_estacoes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_clube_conteudo_semanal_estacao_id
  ON public.clube_conteudo_semanal(estacao_id);

ALTER TABLE public.clube_conteudo_semanal
  ALTER COLUMN ciclo_id DROP NOT NULL;

-- 2. clube_livro_encontros
ALTER TABLE public.clube_livro_encontros
  ADD COLUMN IF NOT EXISTS estacao_id uuid REFERENCES public.clube_estacoes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_clube_livro_encontros_estacao_id
  ON public.clube_livro_encontros(estacao_id);

ALTER TABLE public.clube_livro_encontros
  ALTER COLUMN ciclo_id DROP NOT NULL;