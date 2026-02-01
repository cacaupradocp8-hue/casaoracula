-- Enum para tipos de ritual
CREATE TYPE public.ritual_type AS ENUM ('abertura', 'transicao', 'consagracao');

-- Enum para status do ritual
CREATE TYPE public.ritual_status AS ENUM ('pending', 'completed', 'skipped_by_admin');

-- Tabela de definições de rituais (templates)
CREATE TABLE public.ritual_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo ritual_type NOT NULL,
  descricao TEXT,
  -- Condições de trigger
  trigger_event TEXT NOT NULL, -- ex: 'first_sala_access', 'travessia_complete', 'portal_change'
  trigger_context_type TEXT, -- 'sala', 'portal', 'travessia'
  trigger_context_id UUID, -- ID específico (opcional, se NULL aplica a todos do tipo)
  -- Conteúdo do ritual
  texto_ritual TEXT NOT NULL,
  pergunta_compromisso TEXT,
  campos_reflexao JSONB DEFAULT '[]'::jsonb, -- Array de campos: [{label, required, minLength}]
  microcopy TEXT,
  -- Config
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  autoriza_acesso BOOLEAN DEFAULT false, -- Se true, libera acesso ao completar
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de registros de rituais completados por usuário
CREATE TABLE public.ritual_passages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ritual_id UUID NOT NULL REFERENCES public.ritual_definitions(id) ON DELETE CASCADE,
  status ritual_status NOT NULL DEFAULT 'pending',
  -- Contexto específico da passagem
  context_type TEXT,
  context_id UUID,
  -- Respostas do usuário
  respostas JSONB DEFAULT '{}'::jsonb,
  -- Datas
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  -- Admin override
  admin_marked_by UUID,
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Prevenir duplicatas
  UNIQUE(user_id, ritual_id, context_id)
);

-- Enable RLS
ALTER TABLE public.ritual_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ritual_passages ENABLE ROW LEVEL SECURITY;

-- Políticas para ritual_definitions (leitura pública, escrita admin)
CREATE POLICY "Anyone can view active ritual definitions"
  ON public.ritual_definitions FOR SELECT
  USING (ativo = true);

CREATE POLICY "Admin can manage ritual definitions"
  ON public.ritual_definitions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Políticas para ritual_passages
CREATE POLICY "Users can view their own ritual passages"
  ON public.ritual_passages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ritual passages"
  ON public.ritual_passages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending ritual passages"
  ON public.ritual_passages FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admin can manage all ritual passages"
  ON public.ritual_passages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_ritual_definitions_updated_at
  BEFORE UPDATE ON public.ritual_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ritual_passages_updated_at
  BEFORE UPDATE ON public.ritual_passages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_ritual_passages_user ON public.ritual_passages(user_id);
CREATE INDEX idx_ritual_passages_status ON public.ritual_passages(status);
CREATE INDEX idx_ritual_definitions_trigger ON public.ritual_definitions(trigger_event, trigger_context_type);