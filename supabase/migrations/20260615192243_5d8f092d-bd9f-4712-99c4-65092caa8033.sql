
-- Refinamento Estação 2: Casa da Boa Menina
-- 1) Reusar clube_estacao_registros para Sombra da Torre e Casa dos Nãos via coluna `tipo`
ALTER TABLE public.clube_estacao_registros
  ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'reflexao';

CREATE INDEX IF NOT EXISTS idx_clube_estacao_registros_tipo
  ON public.clube_estacao_registros(user_id, estacao_id, tipo);

-- 2) Frase de destaque do Caso Simbólico (editável pelo Admin, reutilizável)
ALTER TABLE public.clube_estacoes
  ADD COLUMN IF NOT EXISTS caso_frase_destaque TEXT;

COMMENT ON COLUMN public.clube_estacoes.caso_frase_destaque IS
  'Frase central de destaque (callout) do caso simbólico — exibida em itálico dourado abaixo do contexto.';
COMMENT ON COLUMN public.clube_estacao_registros.tipo IS
  'Discriminador de tipo de registro: reflexao | sombra_torre | casa_naos | etc.';
