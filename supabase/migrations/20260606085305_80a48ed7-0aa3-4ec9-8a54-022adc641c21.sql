-- Adicionar flag founder_beta ao profile
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS founder_beta BOOLEAN DEFAULT false;

-- Criar tabela de feedback das fundadoras
CREATE TABLE IF NOT EXISTS public.founder_feedback (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    clareza TEXT,
    confusao TEXT,
    aplicabilidade TEXT,
    travou TEXT,
    encantamento TEXT,
    remocao TEXT,
    pagaria TEXT,
    valor TEXT,
    sugestoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.founder_feedback TO authenticated;
GRANT ALL ON public.founder_feedback TO service_role;

-- RLS
ALTER TABLE public.founder_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fundadoras podem gerenciar seus feedbacks" 
ON public.founder_feedback FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = now(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_founder_feedback_updated_at 
BEFORE UPDATE ON public.founder_feedback 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();