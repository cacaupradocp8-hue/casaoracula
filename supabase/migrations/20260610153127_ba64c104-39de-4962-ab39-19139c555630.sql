ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS desafio_pergunta TEXT,
ADD COLUMN IF NOT EXISTS desafio_alternativas JSONB,
ADD COLUMN IF NOT EXISTS desafio_leitura_modelo TEXT,
ADD COLUMN IF NOT EXISTS desafio_cuidado_etico TEXT;

-- Tabela para persistência do progresso do Desafio de Escuta
CREATE TABLE IF NOT EXISTS public.clube_desafio_escuta_registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rota_id UUID REFERENCES public.clube_rotas(id) ON DELETE CASCADE,
    estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    alternativa_escolhida TEXT,
    classificacao TEXT,
    feedback_exibido TEXT,
    status TEXT DEFAULT 'concluido',
    data TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Permissões
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_desafio_escuta_registros TO authenticated;
GRANT ALL ON public.clube_desafio_escuta_registros TO service_role;

-- RLS
ALTER TABLE public.clube_desafio_escuta_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar seus próprios registros de desafio de escuta" 
    ON public.clube_desafio_escuta_registros 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_desafio_escuta_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = now(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_desafio_escuta_updated_at 
BEFORE UPDATE ON public.clube_desafio_escuta_registros 
FOR EACH ROW EXECUTE FUNCTION public.update_desafio_escuta_updated_at_column();