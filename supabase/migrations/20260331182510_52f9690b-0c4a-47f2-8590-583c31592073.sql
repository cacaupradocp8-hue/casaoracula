
-- Perfil simbólico da cliente em 3 camadas
CREATE TABLE public.co_client_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Camada 1: Estrutural (baixa frequência)
  estrutural JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Esperado: { arquitetura_psiquica, padroes_defesa, padrao_relacional, arquetipos_predominantes, complexos_ativos, narrativa_dominante }

  -- Camada 2: Dinâmico (alta frequência, atualizado por sessão)
  dinamico JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Esperado: { distrito_atual, porta_campo_atual, sensacao_central, estado_sistema, movimento_atual, nivel_consciencia }

  -- Camada 3: Evolutivo (integração entre sessões)
  evolutivo JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Esperado: { vetor_crescimento, travessia_ativa, potencia_emergente, risco_atual, proximo_passo_simbolico }

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(client_id, therapist_id)
);

-- Trigger para updated_at
CREATE TRIGGER co_client_profile_updated_at
  BEFORE UPDATE ON public.co_client_profile
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.co_client_profile ENABLE ROW LEVEL SECURITY;

-- Terapeuta pode ver/editar perfis de suas clientes
CREATE POLICY "Therapist manages own client profiles"
  ON public.co_client_profile
  FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));
