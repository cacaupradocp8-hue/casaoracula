-- ============================================
-- MODULAR PAGE SYSTEM & AI AGENT ARCHITECTURE
-- ============================================

-- 1. CONTENT BLOCK TYPES ENUM
CREATE TYPE public.content_block_type AS ENUM (
  'rich_text',
  'image',
  'video',
  'audio',
  'ai_chat',
  'cta_button'
);

-- 2. CONTEXT TYPES - Where blocks can be used
CREATE TYPE public.block_context_type AS ENUM (
  'quiz_result',
  'portal',
  'ritual',
  'formation',
  'tool',
  'sala',
  'landing'
);

-- 3. MODULAR CONTENT BLOCKS TABLE
-- This is the core reusable block system
CREATE TABLE public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Polymorphic association
  context_type block_context_type NOT NULL,
  context_id UUID NOT NULL,
  
  -- Block configuration
  block_type content_block_type NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  
  -- Visibility control
  portal_minimo portal_type NOT NULL DEFAULT 'visitante',
  
  -- Block content (JSON for flexibility)
  content JSONB NOT NULL DEFAULT '{}',
  
  -- AI agent association (optional)
  agente_id UUID REFERENCES public.agentes(id) ON DELETE SET NULL,
  
  -- Metadata
  titulo TEXT DEFAULT NULL,
  descricao TEXT DEFAULT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast context lookups
CREATE INDEX idx_content_blocks_context ON public.content_blocks(context_type, context_id);
CREATE INDEX idx_content_blocks_ordem ON public.content_blocks(context_type, context_id, ordem);

-- Enable RLS
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_blocks
CREATE POLICY "Anyone can view active blocks with portal access"
ON public.content_blocks
FOR SELECT
USING (
  ativo = true 
  AND has_portal_access(auth.uid(), portal_minimo)
);

CREATE POLICY "Admins can manage all blocks"
ON public.content_blocks
FOR ALL
TO authenticated
USING (get_user_portal(auth.uid()) = 'admin')
WITH CHECK (get_user_portal(auth.uid()) = 'admin');

-- 4. AI GLOBAL SETTINGS TABLE
-- Global system prompt and default configurations
CREATE TABLE public.ai_global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_global_settings ENABLE ROW LEVEL SECURITY;

-- RLS: Only admins can manage, everyone can read active
CREATE POLICY "Anyone can read active AI settings"
ON public.ai_global_settings
FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins can manage AI settings"
ON public.ai_global_settings
FOR ALL
TO authenticated
USING (get_user_portal(auth.uid()) = 'admin')
WITH CHECK (get_user_portal(auth.uid()) = 'admin');

-- Insert default global system prompt
INSERT INTO public.ai_global_settings (chave, valor, descricao) VALUES
(
  'global_system_prompt',
  'Você é um guia simbólico da Casa ORÁCULA. Sua função é apoiar reflexões, práticas e experiências de autoconhecimento. Nunca ofereça diagnósticos, prescrições médicas ou orientação clínica direta. Seu tom é acolhedor, simbólico e poético. Respeite sempre a autonomia da pessoa. Mantenha confidencialidade e ética em todas as interações.',
  'Prompt global de sistema aplicado a todas as interações de IA'
),
(
  'default_agent_id',
  '',
  'ID do agente padrão quando nenhum agente específico está atribuído'
),
(
  'ai_enabled',
  'true',
  'Flag global para habilitar/desabilitar interações de IA'
);

-- 5. ENHANCE AGENTES TABLE
-- Add fields for better agent management
ALTER TABLE public.agentes
ADD COLUMN IF NOT EXISTS prompt_personalidade TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS contextos_permitidos block_context_type[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS modelo_preferido TEXT DEFAULT 'google/gemini-2.5-flash',
ADD COLUMN IF NOT EXISTS temperatura NUMERIC(2,1) DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS max_tokens INTEGER DEFAULT 1024;

-- 6. AI INTERACTION LOGS
-- Track all AI interactions for analytics and improvement
CREATE TABLE public.ai_interaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  agente_id UUID REFERENCES public.agentes(id) ON DELETE SET NULL,
  
  -- Context
  context_type block_context_type,
  context_id UUID,
  
  -- Interaction data
  input_text TEXT NOT NULL,
  output_text TEXT,
  tokens_used INTEGER,
  
  -- Metadata
  modelo_usado TEXT,
  latency_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for user interaction history
CREATE INDEX idx_ai_logs_user ON public.ai_interaction_logs(user_id, created_at DESC);
CREATE INDEX idx_ai_logs_agent ON public.ai_interaction_logs(agente_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.ai_interaction_logs ENABLE ROW LEVEL SECURITY;

-- RLS: Users see their own, admins see all
CREATE POLICY "Users can view their own AI interactions"
ON public.ai_interaction_logs
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR get_user_portal(auth.uid()) = 'admin'
);

CREATE POLICY "System can insert AI interactions"
ON public.ai_interaction_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 7. QUIZ RESULT ENHANCEMENTS
-- Link quiz results to AI agents
ALTER TABLE public.quiz_resultados
ADD COLUMN IF NOT EXISTS agente_id UUID REFERENCES public.agentes(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS imagem_url TEXT,
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS cta_texto TEXT,
ADD COLUMN IF NOT EXISTS cta_rota TEXT;

-- 8. HELPER FUNCTION: Get blocks for a context
CREATE OR REPLACE FUNCTION public.get_content_blocks(
  _context_type block_context_type,
  _context_id UUID,
  _user_id UUID DEFAULT NULL
)
RETURNS SETOF public.content_blocks
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.content_blocks
  WHERE context_type = _context_type
    AND context_id = _context_id
    AND ativo = true
    AND (
      _user_id IS NULL 
      OR has_portal_access(_user_id, portal_minimo)
    )
  ORDER BY ordem ASC;
$$;

-- 9. HELPER FUNCTION: Get agent with global prompt
CREATE OR REPLACE FUNCTION public.get_agent_with_context(
  _agent_id UUID,
  _context_type block_context_type DEFAULT NULL,
  _context_id UUID DEFAULT NULL
)
RETURNS TABLE (
  agent_id UUID,
  agent_nome TEXT,
  agent_descricao TEXT,
  instrucoes_base TEXT,
  prompt_personalidade TEXT,
  global_system_prompt TEXT,
  modelo_preferido TEXT,
  temperatura NUMERIC,
  max_tokens INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    a.id as agent_id,
    a.nome as agent_nome,
    a.descricao as agent_descricao,
    a.instrucoes_base,
    a.prompt_personalidade,
    (SELECT valor FROM public.ai_global_settings WHERE chave = 'global_system_prompt' AND ativo = true) as global_system_prompt,
    a.modelo_preferido,
    a.temperatura,
    a.max_tokens
  FROM public.agentes a
  WHERE a.id = _agent_id
    AND a.status = 'ativo';
$$;

-- 10. TRIGGERS for updated_at
CREATE TRIGGER update_content_blocks_updated_at
BEFORE UPDATE ON public.content_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_global_settings_updated_at
BEFORE UPDATE ON public.ai_global_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();