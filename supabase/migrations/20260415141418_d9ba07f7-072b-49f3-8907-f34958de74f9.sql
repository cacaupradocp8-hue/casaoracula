
-- =============================================
-- MAPA VIVO DA CLIENTE — Snapshots por sessão
-- =============================================

CREATE TABLE public.client_live_map_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_user_id UUID NOT NULL,
  therapist_user_id UUID NOT NULL,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  estado_campo TEXT NOT NULL,
  direcao_conducao TEXT NOT NULL,
  risco TEXT NOT NULL DEFAULT 'baixo',
  estagio TEXT NOT NULL DEFAULT 'meio',
  tensao_ativa TEXT,
  ferramenta_utilizada TEXT,
  ritmo_travessia TEXT,
  tipo_registro TEXT NOT NULL DEFAULT 'sessao',
  mensagem_simbolica TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_live_map_entries_client ON public.client_live_map_entries(client_user_id, created_at DESC);
CREATE INDEX idx_live_map_entries_therapist ON public.client_live_map_entries(therapist_user_id);

ALTER TABLE public.client_live_map_entries ENABLE ROW LEVEL SECURITY;

-- Terapeuta vê e cria registros das suas clientes
CREATE POLICY "Therapist can select own entries"
  ON public.client_live_map_entries FOR SELECT
  TO authenticated
  USING (therapist_user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Therapist can insert entries"
  ON public.client_live_map_entries FOR INSERT
  TO authenticated
  WITH CHECK (therapist_user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Cliente vê apenas os próprios snapshots (versão simbólica)
CREATE POLICY "Client can select own entries"
  ON public.client_live_map_entries FOR SELECT
  TO authenticated
  USING (client_user_id = auth.uid());

-- =============================================
-- MAPA VIVO DA CLIENTE — Síntese atual
-- =============================================

CREATE TABLE public.client_live_map_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_user_id UUID NOT NULL UNIQUE,
  therapist_user_id UUID NOT NULL,
  estado_atual TEXT,
  direcao_atual TEXT,
  risco_atual TEXT DEFAULT 'baixo',
  tensao_principal TEXT,
  ritmo_atual TEXT DEFAULT 'adequado',
  repeticao_detectada BOOLEAN NOT NULL DEFAULT false,
  travessia_travada BOOLEAN NOT NULL DEFAULT false,
  integracao_em_curso BOOLEAN NOT NULL DEFAULT false,
  metadata_json JSONB DEFAULT '{}'::jsonb,
  mensagem_terapeuta TEXT,
  ultimo_update TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_live_map_state_therapist ON public.client_live_map_state(therapist_user_id);

ALTER TABLE public.client_live_map_state ENABLE ROW LEVEL SECURITY;

-- Terapeuta vê e gerencia estado das suas clientes
CREATE POLICY "Therapist can select own state"
  ON public.client_live_map_state FOR SELECT
  TO authenticated
  USING (therapist_user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Therapist can insert state"
  ON public.client_live_map_state FOR INSERT
  TO authenticated
  WITH CHECK (therapist_user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Therapist can update own state"
  ON public.client_live_map_state FOR UPDATE
  TO authenticated
  USING (therapist_user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Cliente vê apenas o próprio estado (versão simbólica)
CREATE POLICY "Client can select own state"
  ON public.client_live_map_state FOR SELECT
  TO authenticated
  USING (client_user_id = auth.uid());
