ALTER TABLE public.clube_reflexoes
  ADD COLUMN IF NOT EXISTS estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_clube_reflexoes_estacao_id
  ON public.clube_reflexoes(estacao_id);

CREATE INDEX IF NOT EXISTS idx_clube_reflexoes_user_estacao
  ON public.clube_reflexoes(user_id, estacao_id);