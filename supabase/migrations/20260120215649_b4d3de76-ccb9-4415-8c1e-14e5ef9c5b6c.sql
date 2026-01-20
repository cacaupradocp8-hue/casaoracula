-- Tabela de Grupos Terapêuticos
CREATE TABLE public.therapeutic_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Participantes do Grupo
CREATE TABLE public.group_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativo BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(group_id, cliente_id)
);

-- Tabela de Sessões de Grupo
CREATE TABLE public.group_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.therapeutic_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_sessions ENABLE ROW LEVEL SECURITY;

-- RLS para therapeutic_groups
CREATE POLICY "Terapeutas podem ver seus próprios grupos"
ON public.therapeutic_groups FOR SELECT
USING (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem criar grupos"
ON public.therapeutic_groups FOR INSERT
WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem atualizar seus grupos"
ON public.therapeutic_groups FOR UPDATE
USING (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem deletar seus grupos"
ON public.therapeutic_groups FOR DELETE
USING (auth.uid() = therapist_id);

-- RLS para group_participants
CREATE POLICY "Terapeutas podem ver participantes dos seus grupos"
ON public.group_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.therapeutic_groups g
    WHERE g.id = group_id AND g.therapist_id = auth.uid()
  )
);

CREATE POLICY "Terapeutas podem adicionar participantes aos seus grupos"
ON public.group_participants FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.therapeutic_groups g
    WHERE g.id = group_id AND g.therapist_id = auth.uid()
  )
);

CREATE POLICY "Terapeutas podem atualizar participantes dos seus grupos"
ON public.group_participants FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.therapeutic_groups g
    WHERE g.id = group_id AND g.therapist_id = auth.uid()
  )
);

CREATE POLICY "Terapeutas podem remover participantes dos seus grupos"
ON public.group_participants FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.therapeutic_groups g
    WHERE g.id = group_id AND g.therapist_id = auth.uid()
  )
);

-- RLS para group_sessions
CREATE POLICY "Terapeutas podem ver sessões dos seus grupos"
ON public.group_sessions FOR SELECT
USING (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem criar sessões nos seus grupos"
ON public.group_sessions FOR INSERT
WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem atualizar sessões dos seus grupos"
ON public.group_sessions FOR UPDATE
USING (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem deletar sessões dos seus grupos"
ON public.group_sessions FOR DELETE
USING (auth.uid() = therapist_id);

-- Triggers para updated_at
CREATE TRIGGER update_therapeutic_groups_updated_at
BEFORE UPDATE ON public.therapeutic_groups
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_sessions_updated_at
BEFORE UPDATE ON public.group_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();