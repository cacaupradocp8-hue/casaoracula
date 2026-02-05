-- =============================================
-- SYNTHEIA AI CHAT TABLES
-- =============================================

-- 1) syntheia_modes - Modos de chat gerenciados por admin
CREATE TABLE public.syntheia_modes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  icon TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) syntheia_voices - Vozes/personas contextuais
CREATE TABLE public.syntheia_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('quiz', 'porta', 'travessia', 'arquetipo', 'ferramenta', 'ritual')),
  title TEXT NOT NULL,
  voice_prompt TEXT NOT NULL,
  trigger_context JSONB,
  active BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) syntheia_conversations - Sessões de conversa por usuária
CREATE TABLE public.syntheia_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode_id TEXT REFERENCES public.syntheia_modes(id),
  voice_id UUID REFERENCES public.syntheia_voices(id),
  title TEXT,
  context_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) syntheia_messages - Mensagens individuais
CREATE TABLE public.syntheia_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.syntheia_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_syntheia_conversations_user ON public.syntheia_conversations(user_id);
CREATE INDEX idx_syntheia_conversations_mode ON public.syntheia_conversations(mode_id);
CREATE INDEX idx_syntheia_messages_conversation ON public.syntheia_messages(conversation_id);
CREATE INDEX idx_syntheia_messages_created ON public.syntheia_messages(created_at);

-- =============================================
-- ENABLE RLS
-- =============================================
ALTER TABLE public.syntheia_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syntheia_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syntheia_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syntheia_messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - syntheia_modes (admin-managed, public read)
-- =============================================
CREATE POLICY "Anyone can read active modes"
  ON public.syntheia_modes FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage modes"
  ON public.syntheia_modes FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- =============================================
-- RLS POLICIES - syntheia_voices (admin-managed, public read)
-- =============================================
CREATE POLICY "Anyone can read active voices"
  ON public.syntheia_voices FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage voices"
  ON public.syntheia_voices FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- =============================================
-- RLS POLICIES - syntheia_conversations (user ownership)
-- =============================================
CREATE POLICY "Users can view own conversations"
  ON public.syntheia_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON public.syntheia_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.syntheia_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.syntheia_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all conversations"
  ON public.syntheia_conversations FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- =============================================
-- RLS POLICIES - syntheia_messages (via conversation ownership)
-- =============================================
CREATE POLICY "Users can view messages from own conversations"
  ON public.syntheia_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.syntheia_conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own conversations"
  ON public.syntheia_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.syntheia_conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages"
  ON public.syntheia_messages FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- =============================================
-- TRIGGERS for updated_at
-- =============================================
CREATE TRIGGER update_syntheia_modes_updated_at
  BEFORE UPDATE ON public.syntheia_modes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_syntheia_voices_updated_at
  BEFORE UPDATE ON public.syntheia_voices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_syntheia_conversations_updated_at
  BEFORE UPDATE ON public.syntheia_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- SEED DATA - Default Modes
-- =============================================
INSERT INTO public.syntheia_modes (id, title, description, system_prompt, icon, ordem) VALUES
('arcano', 'Arcano', 'Linguagem simbólica, metáforas e arquétipos', 
'Você traduz processos psíquicos em LINGUAGEM SIMBÓLICA. Cria metáforas terapêuticas, apresenta arquétipos em luz e sombra, sugere contos simbólicos e exercícios de imaginação. Tom: Poético, evocativo, profundo.', 
'moon', 1),
('ferramenteira', 'Ferramenteira', 'Prática aplicável, rituais e roteiros', 
'Você transforma temas terapêuticos em PRÁTICA APLICÁVEL. Cria rituais, práticas terapêuticas, estrutura sessões, elabora perguntas terapêuticas e checklists. Tom: Direto, estruturado, prático.', 
'wrench', 2);