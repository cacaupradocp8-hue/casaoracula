ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS traducao_territorio_principal TEXT,
ADD COLUMN IF NOT EXISTS traducao_justificativa_principal TEXT,
ADD COLUMN IF NOT EXISTS traducao_territorio_secundario TEXT,
ADD COLUMN IF NOT EXISTS traducao_justificativa_secundaria TEXT,
ADD COLUMN IF NOT EXISTS traducao_porta TEXT,
ADD COLUMN IF NOT EXISTS traducao_torre TEXT,
ADD COLUMN IF NOT EXISTS traducao_labirinto TEXT,
ADD COLUMN IF NOT EXISTS traducao_ferramenta_associada TEXT,
ADD COLUMN IF NOT EXISTS traducao_pergunta_pessoal TEXT,
ADD COLUMN IF NOT EXISTS traducao_pergunta_profissional TEXT;

CREATE TABLE IF NOT EXISTS public.clube_traducao_registros_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rota_id UUID NOT NULL REFERENCES public.clube_rotas(id) ON DELETE CASCADE,
    estacao_id UUID NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    conto_origem TEXT NOT NULL,
    territorio_principal TEXT,
    territorio_secundario TEXT,
    porta TEXT,
    torre TEXT,
    labirinto TEXT,
    ferramenta_associada TEXT,
    resposta_pessoal TEXT,
    resposta_profissional TEXT,
    concluido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_traducao_registros_v2 TO authenticated;
GRANT ALL ON public.clube_traducao_registros_v2 TO service_role;

ALTER TABLE public.clube_traducao_registros_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own translation records" ON public.clube_traducao_registros_v2
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_traducao_v2_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = now(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_traducao_v2_updated_at 
BEFORE UPDATE ON public.clube_traducao_registros_v2 
FOR EACH ROW EXECUTE FUNCTION public.update_traducao_v2_updated_at_column();