-- Create the Câmara do Sussurro cases table
CREATE TABLE public.co_camara_sussurro_casos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    idade INTEGER,
    contexto TEXT,
    fala_inicial TEXT,
    distrito_dominante TEXT,
    torre_provavel TEXT,
    erro_comum TEXT,
    pergunta_ideal TEXT,
    leitura_simbolica TEXT,
    resposta_correta TEXT,
    dificuldade TEXT CHECK (dificuldade IN ('iniciante', 'intermediario', 'avancado')),
    tipo_cliente TEXT,
    tema_emocional TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    ciclo_id UUID REFERENCES public.clube_livro_ciclos(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.co_camara_sussurro_casos ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for now, assuming admin access is handled at app level or by role)
CREATE POLICY "Allow public read access to active cases"
    ON public.co_camara_sussurro_casos
    FOR SELECT
    USING (ativo = true);

CREATE POLICY "Allow authenticated users to manage cases"
    ON public.co_camara_sussurro_casos
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_co_camara_sussurro_casos_updated_at
    BEFORE UPDATE ON public.co_camara_sussurro_casos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
