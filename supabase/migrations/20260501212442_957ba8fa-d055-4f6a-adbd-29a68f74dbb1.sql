-- Create table for the 80/20 essence of each work (book)
CREATE TABLE public.clube_obras_essencia_8020 (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    
    -- Essence Fields
    nucleo_vivo TEXT,
    tensao_central TEXT,
    imagem_organizadora TEXT,
    aplicacao_terapeutica TEXT,
    distorcao_comum TEXT,
    
    -- Premium UI Fields
    resumo_premium TEXT,
    perguntas_clinicas TEXT[], -- Array of strings
    riscos_eticos TEXT,
    exercicio TEXT,
    
    -- Context/Metadata
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clube_obras_essencia_8020 ENABLE ROW LEVEL SECURITY;

-- Policies: Authenticated users can read
CREATE POLICY "Authenticated users can view essence 80/20" 
ON public.clube_obras_essencia_8020 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create function to update timestamps if it doesn't exist (it usually does but just in case)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_clube_obras_essencia_8020_updated_at
BEFORE UPDATE ON public.clube_obras_essencia_8020
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();