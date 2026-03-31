
-- Create the orientations table for therapist→client session continuity
CREATE TABLE public.co_orientacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  terapeuta_id UUID NOT NULL,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL DEFAULT 'reflexao' CHECK (tipo IN ('pratica', 'escuta', 'reflexao', 'territorio', 'foco_semana')),
  titulo TEXT,
  mensagem TEXT NOT NULL,
  conteudo_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'completed')),
  resposta_cliente TEXT,
  completada_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.co_orientacoes ENABLE ROW LEVEL SECURITY;

-- Therapist can manage orientations for their clients
CREATE POLICY "Therapist manages own orientations"
ON public.co_orientacoes
FOR ALL
TO authenticated
USING (
  terapeuta_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.clientes
    WHERE clientes.id = co_orientacoes.cliente_id
    AND clientes.client_user_id = auth.uid()
  )
)
WITH CHECK (
  terapeuta_id = auth.uid()
);

-- Client can update only response fields
CREATE POLICY "Client can respond to orientations"
ON public.co_orientacoes
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clientes
    WHERE clientes.id = co_orientacoes.cliente_id
    AND clientes.client_user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clientes
    WHERE clientes.id = co_orientacoes.cliente_id
    AND clientes.client_user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_co_orientacoes_updated_at
BEFORE UPDATE ON public.co_orientacoes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for lookups
CREATE INDEX idx_co_orientacoes_cliente ON public.co_orientacoes(cliente_id);
CREATE INDEX idx_co_orientacoes_terapeuta ON public.co_orientacoes(terapeuta_id);
