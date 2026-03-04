
-- 1) DISTRICTS (12 distritos fixos da CidaDELA)
CREATE TABLE IF NOT EXISTS public.districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero integer NOT NULL UNIQUE,
  nome text NOT NULL,
  descricao text,
  icone text,
  cor text,
  posicao_relogio text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Districts are readable by all authenticated" ON public.districts FOR SELECT TO authenticated USING (true);

-- 2) TOOLS (ferramentas associadas a distritos)
CREATE TABLE IF NOT EXISTS public.tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  district_id uuid REFERENCES public.districts(id),
  rota text,
  tipo text DEFAULT 'placeholder',
  icone text,
  ordem integer DEFAULT 0,
  ativa boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tools are readable by all authenticated" ON public.tools FOR SELECT TO authenticated USING (true);

-- 3) JOURNEYS (jornada de cada cliente)
CREATE TABLE IF NOT EXISTS public.journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  current_district_id uuid REFERENCES public.districts(id),
  process_state text NOT NULL DEFAULT 'travessia' CHECK (process_state IN ('crise','travessia','integracao')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Therapist can manage own client journeys" ON public.journeys FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()));
CREATE POLICY "Admin full access journeys" ON public.journeys FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 4) JOURNEY_DISTRICTS (estado de cada distrito por jornada)
CREATE TABLE IF NOT EXISTS public.journey_districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id uuid NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  district_id uuid NOT NULL REFERENCES public.districts(id),
  state text NOT NULL DEFAULT 'inativo' CHECK (state IN ('inativo','ativo','integrado')),
  sessions_count integer DEFAULT 0,
  last_session_at timestamptz,
  UNIQUE(journey_id, district_id)
);

ALTER TABLE public.journey_districts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Journey districts follow journey access" ON public.journey_districts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.journeys j JOIN public.clientes c ON c.id = j.client_id WHERE j.id = journey_id AND c.terapeuta_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.journeys j JOIN public.clientes c ON c.id = j.client_id WHERE j.id = journey_id AND c.terapeuta_id = auth.uid()));
CREATE POLICY "Admin full access journey_districts" ON public.journey_districts FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 5) SESSIONS (sessões clínicas — nova tabela unificada)
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  district_id uuid REFERENCES public.districts(id),
  tool_id uuid REFERENCES public.tools(id),
  checkin_state text,
  checkin_notes text,
  insight text,
  task text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Therapist manages own sessions" ON public.sessions FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin full access sessions" ON public.sessions FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 6) CARTOGRAPHIES (Cartografia Psíquica — Big Five Orácula)
CREATE TABLE IF NOT EXISTS public.cartographies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.sessions(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  scores_json jsonb NOT NULL DEFAULT '{}',
  classification_json jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cartographies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Therapist manages own cartographies" ON public.cartographies FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()));
CREATE POLICY "Admin full access cartographies" ON public.cartographies FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 7) TOWERS (Torre Viva)
CREATE TABLE IF NOT EXISTS public.towers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.sessions(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  tower_primary text,
  tower_secondary text,
  notes text,
  clinical_posture text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.towers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Therapist manages own towers" ON public.towers FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()));
CREATE POLICY "Admin full access towers" ON public.towers FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 8) DREAMS (Decodificação Onírica)
CREATE TABLE IF NOT EXISTS public.dreams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.sessions(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  dream_text text,
  central_image text,
  psychic_force text,
  interrupted_movement text,
  symbolic_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dreams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Therapist manages own dreams" ON public.dreams FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()));
CREATE POLICY "Admin full access dreams" ON public.dreams FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 9) LABYRINTH_RECORDS (Labirinto das 39 Portas)
CREATE TABLE IF NOT EXISTS public.labyrinth_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.sessions(id),
  fact text,
  emotional_field text,
  archetypal_image text,
  crossing text,
  facilitator_support text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.labyrinth_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Therapist manages own labyrinth_records" ON public.labyrinth_records FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_id AND c.terapeuta_id = auth.uid()));
CREATE POLICY "Admin full access labyrinth_records" ON public.labyrinth_records FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 10) GROUPS (Grupos terapêuticos)
CREATE TABLE IF NOT EXISTS public.therapy_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  theme text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.therapy_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User manages own groups" ON public.therapy_groups FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin full access therapy_groups" ON public.therapy_groups FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 11) GROUP_MEMBERS
CREATE TABLE IF NOT EXISTS public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.therapy_groups(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, client_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Group members follow group access" ON public.group_members FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.therapy_groups g WHERE g.id = group_id AND g.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.therapy_groups g WHERE g.id = group_id AND g.user_id = auth.uid()));
CREATE POLICY "Admin full access group_members" ON public.group_members FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 12) GROUP_ENCOUNTERS (registros de encontros)
CREATE TABLE IF NOT EXISTS public.group_encounters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.therapy_groups(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  theme text,
  archetype_worked text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.group_encounters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Group encounters follow group access" ON public.group_encounters FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.therapy_groups g WHERE g.id = group_id AND g.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.therapy_groups g WHERE g.id = group_id AND g.user_id = auth.uid()));
CREATE POLICY "Admin full access group_encounters" ON public.group_encounters FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
