-- ============================================
-- NARROTERAPIA ORACULAR™ - Database Setup
-- ============================================

-- 1. Create table for clinical tales (12 official stories)
CREATE TABLE public.contos_clinicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  texto_conto TEXT NOT NULL,
  
  -- Clinical fields
  quando_usar TEXT NOT NULL,
  o_que_observar TEXT NOT NULL,
  riscos_uso_inadequado TEXT NOT NULL,
  
  -- Metadata
  origem_cultural TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contos_clinicos ENABLE ROW LEVEL SECURITY;

-- RLS: Only certified users (aluna_formacao+) can read
CREATE POLICY "Certified users can read clinical tales"
ON public.contos_clinicos
FOR SELECT
USING (
  public.get_user_portal(auth.uid()) IN ('aluna_formacao', 'assinante', 'oracula', 'admin')
);

-- RLS: Only admin can manage
CREATE POLICY "Admin can manage clinical tales"
ON public.contos_clinicos
FOR ALL
USING (public.is_admin(auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER update_contos_clinicos_updated_at
BEFORE UPDATE ON public.contos_clinicos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Add new fields to library_items for study stories
ALTER TABLE public.library_items 
ADD COLUMN IF NOT EXISTS origem_cultural TEXT,
ADD COLUMN IF NOT EXISTS observacoes_leitura TEXT;

-- 3. Add categoria for Narroterapia audios if not exists
-- (audio_assets already has categoria column, we just need to use it)