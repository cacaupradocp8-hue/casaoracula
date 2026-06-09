CREATE TABLE public.clube_traducao_oracular (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    conto_titulo TEXT NOT NULL,
    territorio_principal TEXT NOT NULL,
    porque_principal TEXT NOT NULL,
    territorio_secundario TEXT,
    porque_secundario TEXT,
    pergunta_integracao TEXT NOT NULL DEFAULT 'Onde este território aparece hoje na minha vida?',
    pergunta_profissional TEXT NOT NULL DEFAULT 'Onde este território aparece nas mulheres que acompanho?',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_traducao_oracular TO authenticated;
GRANT ALL ON public.clube_traducao_oracular TO service_role;

ALTER TABLE public.clube_traducao_oracular ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view translations" ON public.clube_traducao_oracular FOR SELECT USING (true);

CREATE TABLE public.clube_traducao_registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    traducao_id UUID REFERENCES public.clube_traducao_oracular(id) ON DELETE CASCADE,
    estacao_id UUID REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    resposta_integracao TEXT,
    resposta_profissional TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_traducao_registros TO authenticated;
GRANT ALL ON public.clube_traducao_registros TO service_role;

ALTER TABLE public.clube_traducao_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own translation records" ON public.clube_traducao_registros
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Seed data for Clareira do Chamado (La Loba)
INSERT INTO public.clube_traducao_oracular 
(estacao_id, conto_titulo, territorio_principal, porque_principal, territorio_secundario, porque_secundario)
SELECT 
    id, 
    'La Loba', 
    'Bosque dos Arquétipos', 
    'Porque o conto fala da recuperação do instinto e da vitalidade soterrada.',
    'Portão da Chegada',
    'Porque toda recuperação começa quando algo é finalmente reconhecido.'
FROM public.clube_estacoes WHERE slug = 'clareira-do-chamado';
