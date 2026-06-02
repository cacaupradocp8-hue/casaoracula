-- Tabela para feedback da condução clínica (necessária para a Etapa J)
CREATE TABLE public.conducao_clinica_feedback (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES auth.users(id),
    utilidade TEXT NOT NULL CHECK (utilidade IN ('Muito útil', 'Parcialmente útil', 'Pouco útil')),
    observacao TEXT,
    territorios TEXT[] DEFAULT '{}'::text[],
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Permissões
GRANT SELECT, INSERT ON public.conducao_clinica_feedback TO authenticated;
GRANT ALL ON public.conducao_clinica_feedback TO service_role;

-- RLS
ALTER TABLE public.conducao_clinica_feedback ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Terapeutas podem inserir seu próprio feedback"
ON public.conducao_clinica_feedback
FOR INSERT
WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Administradores e terapeutas podem ver feedbacks"
ON public.conducao_clinica_feedback
FOR SELECT
USING (true); -- Permitindo leitura geral para o dashboard administrativo
