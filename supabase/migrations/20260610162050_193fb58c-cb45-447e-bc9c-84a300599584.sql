ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS fechamento_titulo TEXT,
ADD COLUMN IF NOT EXISTS fechamento_subtitulo TEXT,
ADD COLUMN IF NOT EXISTS fechamento_audio_url TEXT,
ADD COLUMN IF NOT EXISTS fechamento_botao_proxima TEXT;

-- Tabela para persistência da conclusão da Estação
CREATE TABLE IF NOT EXISTS public.clube_conclusao_estacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rota_id UUID REFERENCES public.clube_rotas(id) ON DELETE CASCADE,
    estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    fechamento_concluido BOOLEAN DEFAULT true,
    proxima_estacao_liberada TEXT,
    data_conclusao TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, estacao_id)
);

-- Permissões
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_conclusao_estacoes TO authenticated;
GRANT ALL ON public.clube_conclusao_estacoes TO service_role;

-- RLS
ALTER TABLE public.clube_conclusao_estacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar suas conclusões de estação" 
    ON public.clube_conclusao_estacoes 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_conclusao_estacoes_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = now(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conclusao_estacoes_updated_at 
BEFORE UPDATE ON public.clube_conclusao_estacoes 
FOR EACH ROW EXECUTE FUNCTION public.update_conclusao_estacoes_updated_at_column();