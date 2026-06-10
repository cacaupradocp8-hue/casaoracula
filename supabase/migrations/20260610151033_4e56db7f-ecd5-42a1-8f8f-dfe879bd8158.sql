CREATE TABLE IF NOT EXISTS public.clube_sussurros_registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rota_id UUID NOT NULL REFERENCES public.clube_rotas(id) ON DELETE CASCADE,
    estacao_id UUID NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    conto_titulo TEXT NOT NULL,
    respostas JSONB NOT NULL DEFAULT '{}',
    concluido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS conto_titulo TEXT,
ADD COLUMN IF NOT EXISTS conto_sintese TEXT,
ADD COLUMN IF NOT EXISTS conto_texto TEXT,
ADD COLUMN IF NOT EXISTS conto_audio_url TEXT,
ADD COLUMN IF NOT EXISTS conto_imagem_url TEXT,
ADD COLUMN IF NOT EXISTS conto_erro_comum TEXT,
ADD COLUMN IF NOT EXISTS conto_sussurro_guardia TEXT;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_sussurros_registros TO authenticated;
GRANT ALL ON public.clube_sussurros_registros TO service_role;

ALTER TABLE public.clube_sussurros_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own story whispers" ON public.clube_sussurros_registros
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_sussurros_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = now(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sussurros_updated_at 
BEFORE UPDATE ON public.clube_sussurros_registros 
FOR EACH ROW EXECUTE FUNCTION public.update_sussurros_updated_at_column();