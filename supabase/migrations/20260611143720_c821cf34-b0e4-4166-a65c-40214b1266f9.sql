CREATE TABLE IF NOT EXISTS public.clube_mapa_instinto_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rota_id UUID,
  estacao_id UUID,
  
  -- Territory States
  corpo TEXT NOT NULL DEFAULT 'Soterrado',
  intuicao TEXT NOT NULL DEFAULT 'Soterrado',
  desejo TEXT NOT NULL DEFAULT 'Soterrado',
  limites TEXT NOT NULL DEFAULT 'Soterrado',
  criatividade TEXT NOT NULL DEFAULT 'Soterrado',
  vitalidade TEXT NOT NULL DEFAULT 'Soterrado',
  
  -- Analysis
  territorio_mais_aceso TEXT,
  territorio_mais_soterrado TEXT,
  distrito_cidadela_impactado TEXT,
  
  -- Meta
  status TEXT DEFAULT 'concluido',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_mapa_instinto_registros TO authenticated;
GRANT ALL ON public.clube_mapa_instinto_registros TO service_role;

-- RLS
ALTER TABLE public.clube_mapa_instinto_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own instinto mapping" 
  ON public.clube_mapa_instinto_registros 
  FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.updated_at = now(); 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clube_mapa_instinto_updated_at 
BEFORE UPDATE ON public.clube_mapa_instinto_registros 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();