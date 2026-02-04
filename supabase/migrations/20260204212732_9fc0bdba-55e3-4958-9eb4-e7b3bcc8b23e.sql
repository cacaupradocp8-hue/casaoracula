-- ============================================
-- JARDIM DA HEROÍNA - Schema
-- ============================================
-- Temporary integration space between sessions
-- Activated ONLY by therapist, never by client

-- Enum for Jardim status
CREATE TYPE public.jardim_heroina_status AS ENUM ('inactive', 'active', 'closed');

-- Enum for gesture types
CREATE TYPE public.jardim_gesto_tipo AS ENUM (
  'observacao',    -- observation
  'limite',        -- boundary
  'cuidado',       -- self-care
  'pausa',         -- pause
  'acao_simbolica' -- simple symbolic action
);

-- Main table for Jardim da Heroína
CREATE TABLE public.jardim_heroina (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships (CRITICAL: linked to session, not standalone)
  case_id UUID NOT NULL REFERENCES public.session_cases(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  
  -- Status (never more than one active per client)
  status public.jardim_heroina_status NOT NULL DEFAULT 'inactive',
  
  -- Section 1: Chegada ao Jardim
  chegada_vivo TEXT CHECK (char_length(chegada_vivo) <= 240),
  chegada_corpo TEXT CHECK (char_length(chegada_corpo) <= 100),
  
  -- Section 2: Integração da Semana
  integracao_observar TEXT CHECK (char_length(integracao_observar) <= 300),
  
  -- Section 3: Gesto Simbólico (CORE)
  gesto_descricao TEXT CHECK (char_length(gesto_descricao) <= 200),
  gesto_tipo public.jardim_gesto_tipo,
  gesto_prazo DATE,
  gesto_prazo_texto TEXT CHECK (char_length(gesto_prazo_texto) <= 50), -- "até próxima sessão"
  
  -- Section 4: Observação Simples
  observacao_sustentou TEXT CHECK (observacao_sustentou IN ('sim', 'parcialmente', 'nao')),
  observacao_percebi TEXT CHECK (char_length(observacao_percebi) <= 180),
  
  -- Section 5: Fechamento
  fechamento_levo TEXT CHECK (char_length(fechamento_levo) <= 200),
  fechamento_deixo TEXT CHECK (char_length(fechamento_deixo) <= 200),
  
  -- Metadata
  ativado_em TIMESTAMP WITH TIME ZONE,
  fechado_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_jardim_heroina_case ON public.jardim_heroina(case_id);
CREATE INDEX idx_jardim_heroina_client ON public.jardim_heroina(client_id);
CREATE INDEX idx_jardim_heroina_status ON public.jardim_heroina(status);

-- CRITICAL: Only ONE active Jardim per client at a time
CREATE UNIQUE INDEX idx_jardim_heroina_one_active_per_client 
ON public.jardim_heroina(client_id) 
WHERE status = 'active';

-- Enable RLS
ALTER TABLE public.jardim_heroina ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Therapists can manage their own clients' Jardins
CREATE POLICY "Therapists can view own clients jardins"
ON public.jardim_heroina FOR SELECT
TO authenticated
USING (therapist_id = auth.uid());

CREATE POLICY "Therapists can create jardins for own clients"
ON public.jardim_heroina FOR INSERT
TO authenticated
WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can update own clients jardins"
ON public.jardim_heroina FOR UPDATE
TO authenticated
USING (therapist_id = auth.uid());

CREATE POLICY "Therapists can delete own clients jardins"
ON public.jardim_heroina FOR DELETE
TO authenticated
USING (therapist_id = auth.uid());

-- Trigger to update updated_at
CREATE TRIGGER update_jardim_heroina_updated_at
  BEFORE UPDATE ON public.jardim_heroina
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if client has an active Jardim
CREATE OR REPLACE FUNCTION public.client_has_active_jardim(_client_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.jardim_heroina
    WHERE client_id = _client_id
      AND status = 'active'
  )
$$;

-- Function to auto-close expired Jardins (can be called via cron or manually)
CREATE OR REPLACE FUNCTION public.close_expired_jardins()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  closed_count INTEGER;
BEGIN
  UPDATE public.jardim_heroina
  SET 
    status = 'closed',
    fechado_em = now(),
    updated_at = now()
  WHERE 
    status = 'active'
    AND gesto_prazo IS NOT NULL
    AND gesto_prazo < CURRENT_DATE;
  
  GET DIAGNOSTICS closed_count = ROW_COUNT;
  RETURN closed_count;
END;
$$;

-- Comment for documentation
COMMENT ON TABLE public.jardim_heroina IS 'Temporary integration space between sessions. Activated ONLY by therapist, one active per client max.';