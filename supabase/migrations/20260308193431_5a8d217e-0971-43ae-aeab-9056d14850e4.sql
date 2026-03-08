
-- Auto-mapeamento pessoal da aluna
CREATE TABLE public.auto_mapeamento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  distritos_json jsonb DEFAULT '{}'::jsonb,
  anotacoes text DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.auto_mapeamento ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own auto_mapeamento" ON public.auto_mapeamento
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins full access auto_mapeamento" ON public.auto_mapeamento
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Estudos de caso para treinamento
CREATE TABLE public.estudos_caso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  nivel text NOT NULL DEFAULT 'iniciante',
  prontuario_ficticio text NOT NULL,
  mapa_cidadela_json jsonb DEFAULT '{}'::jsonb,
  perguntas_analise text[] DEFAULT '{}',
  feedback_especialista text NOT NULL,
  ativo boolean DEFAULT true,
  ordem integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.estudos_caso ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read estudos_caso" ON public.estudos_caso
  FOR SELECT TO authenticated USING (ativo = true);
CREATE POLICY "Admins manage estudos_caso" ON public.estudos_caso
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Respostas das alunas aos estudos de caso
CREATE TABLE public.estudos_caso_respostas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estudo_caso_id uuid NOT NULL REFERENCES public.estudos_caso(id) ON DELETE CASCADE,
  resposta text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, estudo_caso_id)
);
ALTER TABLE public.estudos_caso_respostas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own respostas" ON public.estudos_caso_respostas
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all respostas" ON public.estudos_caso_respostas
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Cenários do simulador de sessão
CREATE TABLE public.simulador_cenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  contexto text NOT NULL,
  nivel text NOT NULL DEFAULT 'iniciante',
  passos_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  ativo boolean DEFAULT true,
  ordem integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.simulador_cenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read simulador" ON public.simulador_cenarios
  FOR SELECT TO authenticated USING (ativo = true);
CREATE POLICY "Admins manage simulador" ON public.simulador_cenarios
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Progresso do simulador
CREATE TABLE public.simulador_progresso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cenario_id uuid NOT NULL REFERENCES public.simulador_cenarios(id) ON DELETE CASCADE,
  respostas_json jsonb DEFAULT '[]'::jsonb,
  pontuacao integer DEFAULT 0,
  concluido boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, cenario_id)
);
ALTER TABLE public.simulador_progresso ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progresso" ON public.simulador_progresso
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Clientes-piloto para estágio
CREATE TABLE public.clientes_piloto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_cliente text NOT NULL,
  numero_sessao integer NOT NULL DEFAULT 1,
  prontuario text NOT NULL DEFAULT '',
  reflexoes text DEFAULT '',
  status_supervisao text NOT NULL DEFAULT 'pendente',
  supervisor_feedback text,
  supervisor_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.clientes_piloto ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own clientes_piloto" ON public.clientes_piloto
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins full access clientes_piloto" ON public.clientes_piloto
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
