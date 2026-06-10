ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS missao_titulo TEXT,
ADD COLUMN IF NOT EXISTS missao_texto TEXT,
ADD COLUMN IF NOT EXISTS missao_checklist JSONB,
ADD COLUMN IF NOT EXISTS missao_label_observacao TEXT,
ADD COLUMN IF NOT EXISTS missao_label_sinal TEXT,
ADD COLUMN IF NOT EXISTS missao_label_pergunta TEXT;

-- Tabela para persistência do progresso da Missão de Campo
CREATE TABLE IF NOT EXISTS public.clube_missao_campo_registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rota_id UUID REFERENCES public.clube_rotas(id) ON DELETE CASCADE,
    estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    titulo_missao TEXT,
    checklist_concluido JSONB,
    resposta_observacao TEXT,
    resposta_sinal TEXT,
    resposta_pergunta TEXT,
    status TEXT DEFAULT 'concluido',
    data TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Permissões
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_missao_campo_registros TO authenticated;
GRANT ALL ON public.clube_missao_campo_registros TO service_role;

-- RLS
ALTER TABLE public.clube_missao_campo_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar seus próprios registros de missão de campo" 
    ON public.clube_missao_campo_registros 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_missao_campo_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = now(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_missao_campo_updated_at 
BEFORE UPDATE ON public.clube_missao_campo_registros 
FOR EACH ROW EXECUTE FUNCTION public.update_missao_campo_updated_at_column();