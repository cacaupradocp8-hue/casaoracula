-- Create symbolic families table for organizing traversals
CREATE TABLE public.travessia_familias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  icone TEXT DEFAULT 'Sparkles',
  ordem INTEGER DEFAULT 0,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.travessia_familias ENABLE ROW LEVEL SECURITY;

-- Public read access for active families
CREATE POLICY "Anyone can view active families"
ON public.travessia_familias
FOR SELECT
USING (ativa = true);

-- Admin full access
CREATE POLICY "Admins can manage families"
ON public.travessia_familias
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Add familia_id to travessia_library_items
ALTER TABLE public.travessia_library_items 
ADD COLUMN familia_id UUID REFERENCES public.travessia_familias(id);

-- Insert the initial symbolic families
INSERT INTO public.travessia_familias (nome, descricao, ordem) VALUES
('Travessias da Ruptura & Desorganização', 
 'Quando estruturas identitárias colapsam. Quando padrões repetitivos se rompem dolorosamente. Quando algo não sustenta mais, mas nada novo está claro ainda.', 
 1),
('Travessias do Corpo', 
 'Quando o corpo fala o que a mente silencia. Quando sintomas se tornam mensageiros. Quando a experiência somática precisa de campo simbólico.', 
 2),
('Travessias da Identidade Feminina', 
 'Quando a mulher questiona os papéis que habita. Quando a máscara pesa demais. Quando o feminino pede reinvenção.', 
 3);

-- Update existing item to link to family
UPDATE public.travessia_library_items 
SET familia_id = (SELECT id FROM public.travessia_familias WHERE nome LIKE '%Imprevisível%' LIMIT 1)
WHERE categoria LIKE '%Imprevisível%';

-- Insert Cartografia da Torre into the Biblioteca
INSERT INTO public.travessia_library_items (
  slug,
  titulo_ritual,
  subtitulo,
  categoria,
  quando_chamada,
  o_que_sustenta,
  como_atravessar,
  portal_minimo,
  publicado,
  ordem,
  familia_id
) VALUES (
  'cartografia-da-torre',
  'Cartografia da Torre',
  'Mapeamento simbólico das estruturas que desmoronam',
  'Travessias da Ruptura & Desorganização',
  'Quando estruturas identitárias colapsam. Quando padrões repetitivos se rompem dolorosamente. Quando a cliente se sente desorientada, irritada ou internamente fragmentada. Quando algo não sustenta mais, mas nada novo está claro ainda.',
  'Leitura simbólica da crise sem patologizar. Distinção entre colapso e transformação. Metabolização psíquica da ruptura. Recuperação da agência interna durante o caos.',
  'Escrita ritual entre sessões. Reflexão simbólica guiada em mentoria. Como espaço de contenção quando o silêncio é mais terapêutico que a intervenção.',
  'pre_iniciada',
  true,
  1,
  (SELECT id FROM public.travessia_familias WHERE nome LIKE '%Ruptura%' LIMIT 1)
);

-- Create trigger for updated_at
CREATE TRIGGER update_travessia_familias_updated_at
BEFORE UPDATE ON public.travessia_familias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();