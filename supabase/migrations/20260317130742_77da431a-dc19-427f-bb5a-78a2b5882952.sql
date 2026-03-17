
-- ============================================
-- CASA ORÁCULA SaaS — SCHEMA EXPANSION
-- Tabelas novas que NÃO existem no projeto
-- ============================================

-- 1. WORKSPACES (multi-tenant)
CREATE TABLE public.co_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage workspace" ON public.co_workspaces
  FOR ALL TO authenticated
  USING (owner_user_id = auth.uid() OR public.is_admin(auth.uid()));

-- 2. WORKSPACE USERS
CREATE TABLE public.co_workspace_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.co_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  papel TEXT NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);
ALTER TABLE public.co_workspace_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can see members" ON public.co_workspace_users
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.co_workspace_users wu WHERE wu.workspace_id = co_workspace_users.workspace_id AND wu.user_id = auth.uid())
    OR public.is_admin(auth.uid())
  );
CREATE POLICY "Owner can manage members" ON public.co_workspace_users
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.co_workspaces w WHERE w.id = workspace_id AND w.owner_user_id = auth.uid())
    OR public.is_admin(auth.uid())
  );

-- 3. CLIENT PROFILES (symbolic/clinical profile)
CREATE TABLE public.co_client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  arquetipo_regente TEXT,
  arquetipo_sombra TEXT,
  arquetipo_evolucao TEXT,
  torre_dominante TEXT,
  porta_ativa TEXT,
  distrito_ativo TEXT,
  fase_jornada TEXT,
  observacoes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id)
);
ALTER TABLE public.co_client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist can manage client profile" ON public.co_client_profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid())
    OR public.is_admin(auth.uid())
  );

-- 4. TOOL FLOWS (flexible method flows)
CREATE TABLE public.co_tool_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_origem_id UUID NOT NULL REFERENCES public.sala_ferramentas(id) ON DELETE CASCADE,
  tool_destino_id UUID NOT NULL REFERENCES public.sala_ferramentas(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL DEFAULT 1,
  tipo TEXT NOT NULL DEFAULT 'principal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_tool_flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read flows" ON public.co_tool_flows
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage flows" ON public.co_tool_flows
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 5. SESSION NOTES (structured per session)
CREATE TABLE public.co_session_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  tema TEXT,
  insight_principal TEXT,
  tarefa_simbolica TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_session_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage session notes" ON public.co_session_notes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sessoes_casa_maquinas s
      WHERE s.id = session_id AND s.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

-- 6. TOOL USAGE PER SESSION
CREATE TABLE public.co_tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  tool_id UUID NOT NULL REFERENCES public.sala_ferramentas(id) ON DELETE CASCADE,
  entrada_registrada TEXT,
  saida_registrada TEXT,
  insights TEXT,
  ordem_uso INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_tool_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage tool usage" ON public.co_tool_usage
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sessoes_casa_maquinas s
      WHERE s.id = session_id AND s.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

-- 7. CITY HISTORY (CidaDELA timeline)
CREATE TABLE public.co_city_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  session_id UUID,
  tool_id UUID REFERENCES public.sala_ferramentas(id),
  evento TEXT NOT NULL,
  distrito TEXT,
  detalhe TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_city_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist can manage city history" ON public.co_city_history
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid())
    OR public.is_admin(auth.uid())
  );

-- 8. JOURNEY RECORDS (Jardim da Heroína - client self-exploration)
CREATE TABLE public.co_journey_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES public.sala_ferramentas(id),
  tipo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  visivel_para_terapeuta BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_journey_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist can read visible records" ON public.co_journey_records
  FOR SELECT TO authenticated
  USING (
    (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()) AND visivel_para_terapeuta = true)
    OR public.is_admin(auth.uid())
  );

-- 9. GARDEN FLOWERS (symbolic achievements)
CREATE TABLE public.co_garden_flowers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo_flor TEXT NOT NULL,
  origem_registro_id UUID REFERENCES public.co_journey_records(id),
  titulo TEXT,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_garden_flowers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist can manage flowers" ON public.co_garden_flowers
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid())
    OR public.is_admin(auth.uid())
  );

-- 10. PASSPORT ENTRIES (seals/stamps)
CREATE TABLE public.co_passport_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  selo TEXT NOT NULL,
  descricao TEXT,
  conquistado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_passport_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist can manage passport" ON public.co_passport_entries
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid())
    OR public.is_admin(auth.uid())
  );

-- 11. AI RECOMMENDATIONS (Bússola da Cartógrafa)
CREATE TABLE public.co_ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  session_id UUID,
  campo_psiquico TEXT,
  distrito TEXT,
  tool_sugerida_id UUID REFERENCES public.sala_ferramentas(id),
  tool_complementar_id UUID REFERENCES public.sala_ferramentas(id),
  motivo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist can manage recommendations" ON public.co_ai_recommendations
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid())
    OR public.is_admin(auth.uid())
  );

-- 12. APPOINTMENTS (scheduling)
CREATE TABLE public.co_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.co_workspaces(id),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  terapeuta_user_id UUID NOT NULL REFERENCES auth.users(id),
  inicio TIMESTAMPTZ NOT NULL,
  fim TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendada',
  origem TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.co_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist can manage appointments" ON public.co_appointments
  FOR ALL TO authenticated
  USING (terapeuta_user_id = auth.uid() OR public.is_admin(auth.uid()));

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_co_workspace_users_workspace ON public.co_workspace_users(workspace_id);
CREATE INDEX idx_co_workspace_users_user ON public.co_workspace_users(user_id);
CREATE INDEX idx_co_client_profiles_client ON public.co_client_profiles(client_id);
CREATE INDEX idx_co_tool_flows_origem ON public.co_tool_flows(tool_origem_id);
CREATE INDEX idx_co_tool_flows_destino ON public.co_tool_flows(tool_destino_id);
CREATE INDEX idx_co_session_notes_session ON public.co_session_notes(session_id);
CREATE INDEX idx_co_tool_usage_session ON public.co_tool_usage(session_id);
CREATE INDEX idx_co_city_history_client ON public.co_city_history(client_id);
CREATE INDEX idx_co_city_history_created ON public.co_city_history(created_at);
CREATE INDEX idx_co_journey_records_client ON public.co_journey_records(client_id);
CREATE INDEX idx_co_garden_flowers_client ON public.co_garden_flowers(client_id);
CREATE INDEX idx_co_passport_entries_client ON public.co_passport_entries(client_id);
CREATE INDEX idx_co_ai_recommendations_client ON public.co_ai_recommendations(client_id);
CREATE INDEX idx_co_appointments_client ON public.co_appointments(client_id);
CREATE INDEX idx_co_appointments_terapeuta ON public.co_appointments(terapeuta_user_id);
CREATE INDEX idx_co_appointments_inicio ON public.co_appointments(inicio);
