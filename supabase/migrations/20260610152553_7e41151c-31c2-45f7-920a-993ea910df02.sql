ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS caso_nome_ficticio TEXT,
ADD COLUMN IF NOT EXISTS caso_idade TEXT,
ADD COLUMN IF NOT EXISTS caso_contexto TEXT,
ADD COLUMN IF NOT EXISTS caso_frase_central TEXT,
ADD COLUMN IF NOT EXISTS caso_campo_superficie TEXT,
ADD COLUMN IF NOT EXISTS caso_campo_simbolico TEXT,
ADD COLUMN IF NOT EXISTS caso_campo_nao_concluir TEXT,
ADD COLUMN IF NOT EXISTS caso_relacao_conto TEXT,
ADD COLUMN IF NOT EXISTS caso_pergunta_conducao TEXT,
ADD COLUMN IF NOT EXISTS caso_cautela_etica TEXT;

-- Tabela para persistência do progresso do Caso Simbólico
CREATE TABLE IF NOT EXISTS public.clube_caso_simbolico_registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rota_id UUID REFERENCES public.clube_rotas(id) ON DELETE CASCADE,
    estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    caso_titulo TEXT,
    status TEXT DEFAULT 'concluido',
    data TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Permissões
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_caso_simbolico_registros TO authenticated;
GRANT ALL ON public.clube_caso_simbolico_registros TO service_role;

-- RLS
ALTER TABLE public.clube_caso_simbolico_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar seus próprios registros de caso simbólico" 
    ON public.clube_caso_simbolico_registros 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_caso_simbolico_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = now(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_caso_simbolico_updated_at 
BEFORE UPDATE ON public.clube_caso_simbolico_registros 
FOR EACH ROW EXECUTE FUNCTION public.update_caso_simbolico_updated_at_column();