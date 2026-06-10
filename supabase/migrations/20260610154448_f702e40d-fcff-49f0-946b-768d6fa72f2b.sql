ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS ferramenta_nome TEXT,
ADD COLUMN IF NOT EXISTS ferramenta_descricao TEXT,
ADD COLUMN IF NOT EXISTS ferramenta_eixos JSONB,
ADD COLUMN IF NOT EXISTS ferramenta_resultados JSONB;

-- Tabela para persistência do progresso da Ferramenta Oracular
CREATE TABLE IF NOT EXISTS public.clube_ferramenta_oracular_registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rota_id UUID REFERENCES public.clube_rotas(id) ON DELETE CASCADE,
    estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    nome_ferramenta TEXT,
    respostas JSONB,
    resultado_simbolico TEXT,
    territorio_impactado TEXT,
    rastro TEXT,
    status TEXT DEFAULT 'concluido',
    data TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Permissões
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_ferramenta_oracular_registros TO authenticated;
GRANT ALL ON public.clube_ferramenta_oracular_registros TO service_role;

-- RLS
ALTER TABLE public.clube_ferramenta_oracular_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar seus próprios registros de ferramenta oracular" 
    ON public.clube_ferramenta_oracular_registros 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_ferramenta_oracular_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = now(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ferramenta_oracular_updated_at 
BEFORE UPDATE ON public.clube_ferramenta_oracular_registros 
FOR EACH ROW EXECUTE FUNCTION public.update_ferramenta_oracular_updated_at_column();