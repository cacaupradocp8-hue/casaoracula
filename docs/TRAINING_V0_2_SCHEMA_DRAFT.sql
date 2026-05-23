-- ============================================================================
-- TRAINING V0.2 SCHEMA DRAFT — CASA ORÁCULA 2.0
-- ============================================================================
-- FINALIDADE: Persistência pedagógica isolada para a Sala de Treinamento.
-- STATUS: Rascunho para revisão técnica e ética. NÃO EXECUTAR AINDA.
-- ============================================================================

/* 
  GUARDRAILS ÉTICOS OBRIGATÓRIOS:
  1. Estas tabelas são EXCLUSIVAMENTE para treino pedagógico e simulações.
  2. PROIBIDO o armazenamento de dados de clientes reais ou prontuários.
  3. PROIBIDO o armazenamento de diagnósticos (CID/DSM) ou nomes de terceiros reais.
  4. Estes dados NÃO devem alimentar o Atlas Orácula profissional automaticamente.
  5. Estes dados NÃO devem ser enviados para IA sem consentimento explícito e nova etapa aprovada.
  6. O campo 'is_fictional' deve ser sempre TRUE para garantir o isolamento ético.
*/

-- ----------------------------------------------------------------------------
-- 1. TABELA: training_progress
-- ----------------------------------------------------------------------------
-- Descrição: Guarda o progresso geral da aluna em módulos da Sala de Treinamento.

CREATE TABLE IF NOT EXISTS public.training_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_key TEXT NOT NULL,
    module_title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started',
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints de validação
    CONSTRAINT check_progress_range CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    CONSTRAINT check_valid_status CHECK (status IN ('not_started', 'in_progress', 'completed', 'revisited')),
    CONSTRAINT unique_user_module UNIQUE (user_id, module_key)
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_training_progress_user ON public.training_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_user_module ON public.training_progress(user_id, module_key);
CREATE INDEX IF NOT EXISTS idx_training_progress_last_activity ON public.training_progress(last_activity_at);

-- ----------------------------------------------------------------------------
-- 2. TABELA: training_submissions
-- ----------------------------------------------------------------------------
-- Descrição: Guarda respostas pedagógicas de exercícios simulados.

CREATE TABLE IF NOT EXISTS public.training_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_key TEXT NOT NULL,
    exercise_key TEXT NOT NULL,
    exercise_type TEXT NOT NULL,
    case_key TEXT,
    prompt_text TEXT,
    response_text TEXT NOT NULL,
    response_metadata JSONB DEFAULT '{}'::jsonb,
    is_fictional BOOLEAN NOT NULL DEFAULT TRUE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints de segurança e integridade
    CONSTRAINT check_is_fictional CHECK (is_fictional = TRUE), -- Barreira Ética
    CONSTRAINT check_exercise_type CHECK (exercise_type IN (
        'essay', 
        'multiple_choice', 
        'symbolic_map', 
        'guided_reflection', 
        'formulation_practice'
    ))
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_training_submissions_user ON public.training_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_training_submissions_user_module ON public.training_submissions(user_id, module_key);
CREATE INDEX IF NOT EXISTS idx_training_submissions_user_exercise ON public.training_submissions(user_id, exercise_key);
CREATE INDEX IF NOT EXISTS idx_training_submissions_submitted ON public.training_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_training_submissions_archived ON public.training_submissions(is_archived);

-- ----------------------------------------------------------------------------
-- 3. RLS (Row Level Security) - PROPOSTA
-- ----------------------------------------------------------------------------

ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_submissions ENABLE ROW LEVEL SECURITY;

-- Policies para training_progress
CREATE POLICY "Users can view their own progress" 
ON public.training_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.training_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.training_progress FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" 
ON public.training_progress FOR DELETE 
USING (auth.uid() = user_id);

-- Policies para training_submissions
CREATE POLICY "Users can view their own submissions" 
ON public.training_submissions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions" 
ON public.training_submissions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" 
ON public.training_submissions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete or archive their own submissions" 
ON public.training_submissions FOR DELETE 
USING (auth.uid() = user_id);

-- NOTA: Não são criadas políticas de acesso para profissionais ou IA.
-- Acesso Admin deve ser definido via roles específicas (ex: service_role ou rbac customizado) se necessário para suporte.

-- ----------------------------------------------------------------------------
-- 4. FUNÇÕES E TRIGGERS (Opcional - Rascunho)
-- ----------------------------------------------------------------------------

/*
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_progress
BEFORE UPDATE ON public.training_progress
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_submissions
BEFORE UPDATE ON public.training_submissions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
*/

-- ============================================================================
-- FIM DO DRAFT V0.2
-- ============================================================================
