ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS cartografia_rastro_nome TEXT,
ADD COLUMN IF NOT EXISTS cartografia_ferramenta_desbloqueada TEXT,
ADD COLUMN IF NOT EXISTS cartografia_distrito_impactado TEXT,
ADD COLUMN IF NOT EXISTS cartografia_distrito_secundario TEXT,
ADD COLUMN IF NOT EXISTS cartografia_competencia TEXT,
ADD COLUMN IF NOT EXISTS cartografia_proxima_travessia TEXT,
ADD COLUMN IF NOT EXISTS cartografia_mensagem_conclusao TEXT;

-- Tabela para persistência do progresso da Cartografia da Loba
CREATE TABLE IF NOT EXISTS public.clube_cartografia_loba_registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rota_id UUID REFERENCES public.clube_rotas(id) ON DELETE CASCADE,
    estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    estacao_nome TEXT,
    rastro_nome TEXT,
    ferramenta_desbloqueada TEXT,
    distrito_impactado TEXT,
    distrito_secundario TEXT,
    competencia_desenvolvida TEXT,
    proxima_travessia TEXT,
    status TEXT DEFAULT 'concluido',
    data TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Permissões
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_cartografia_loba_registros TO authenticated;
GRANT ALL ON public.clube_cartografia_loba_registros TO service_role;

-- RLS
ALTER TABLE public.clube_cartografia_loba_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar seus próprios registros de cartografia" 
    ON public.clube_cartografia_loba_registros 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_cartografia_loba_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = now(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cartografia_loba_updated_at 
BEFORE UPDATE ON public.clube_cartografia_loba_registros 
FOR EACH ROW EXECUTE FUNCTION public.update_cartografia_loba_updated_at_column();