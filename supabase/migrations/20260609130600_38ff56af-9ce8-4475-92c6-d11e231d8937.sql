-- Câmara da Escuta - Obras Simbólicas
CREATE TABLE public.clube_camara_escuta_obras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    tipo TEXT NOT NULL, -- musica, poema, cena_filme, conto, pintura, fotografia, obra_visual
    autor TEXT,
    url TEXT NOT NULL,
    funcao_escuta TEXT NOT NULL, -- Curta explicação (máximo 3 parágrafos)
    pergunta_psique TEXT NOT NULL,
    pergunta_oficio TEXT NOT NULL,
    reflexao_opcional TEXT,
    territorio_principal TEXT NOT NULL,
    territorio_secundario_1 TEXT,
    territorio_secundario_2 TEXT,
    rota_id UUID REFERENCES public.clube_rotas(id) ON DELETE CASCADE,
    estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Registros de Escuta da Participante
CREATE TABLE public.clube_camara_escuta_registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    obra_id UUID NOT NULL REFERENCES public.clube_camara_escuta_obras(id) ON DELETE CASCADE,
    simbolo_observado TEXT NOT NULL,
    emocao_predominante TEXT NOT NULL,
    territorio_impactado TEXT NOT NULL,
    data_escuta TIMESTAMP WITH TIME ZONE DEFAULT now(),
    registro_psique TEXT, -- Resposta à pergunta da psique
    registro_oficio TEXT, -- Resposta à pergunta do ofício
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Grants
GRANT SELECT ON public.clube_camara_escuta_obras TO authenticated;
GRANT SELECT ON public.clube_camara_escuta_obras TO anon;
GRANT ALL ON public.clube_camara_escuta_obras TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.clube_camara_escuta_registros TO authenticated;
GRANT ALL ON public.clube_camara_escuta_registros TO service_role;

-- RLS
ALTER TABLE public.clube_camara_escuta_obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_camara_escuta_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active obras" ON public.clube_camara_escuta_obras FOR SELECT USING (ativo = true);

CREATE POLICY "Users can manage their own registros" ON public.clube_camara_escuta_registros
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Update Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clube_camara_escuta_obras_updated_at
    BEFORE UPDATE ON public.clube_camara_escuta_obras
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data for Clareira do Chamado (Rota dos Lobos)
-- We need the ID of 'Clareira do Chamado' station. I'll insert a mock or wait to get it.
-- Actually, I'll provide the insert in a separate tool call if needed, but adding a generic one for Rota dos Lobos.
