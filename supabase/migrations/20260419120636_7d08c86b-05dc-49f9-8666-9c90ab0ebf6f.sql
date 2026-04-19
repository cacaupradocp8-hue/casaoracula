-- P0: add estacao_id to clube_engajamento for station-based filtering
ALTER TABLE public.clube_engajamento
  ADD COLUMN IF NOT EXISTS estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_clube_engajamento_estacao_id
  ON public.clube_engajamento(estacao_id);

CREATE INDEX IF NOT EXISTS idx_clube_engajamento_user_estacao
  ON public.clube_engajamento(user_id, estacao_id);