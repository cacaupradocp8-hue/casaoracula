-- Adicionar campos faltantes à tabela travessias
ALTER TABLE public.travessias 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS icone TEXT DEFAULT 'Compass',
ADD COLUMN IF NOT EXISTS cor_acento TEXT DEFAULT 'amber',
ADD COLUMN IF NOT EXISTS temas TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS portal_minimo portal_type DEFAULT 'visitante',
ADD COLUMN IF NOT EXISTS requer_profissional BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ativa BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ordem INTEGER DEFAULT 0;

-- Atualizar dados existentes com os novos campos
UPDATE public.travessias SET
  slug = CASE number
    WHEN 1 THEN 'mundo-sem-simbolos'
    WHEN 2 THEN 'mulher-alma-antiga'
    WHEN 3 THEN 'codigo-narrativas'
    WHEN 4 THEN 'guardia-caminho'
    ELSE 'travessia-' || number
  END,
  icone = CASE number
    WHEN 1 THEN 'Compass'
    WHEN 2 THEN 'Moon'
    WHEN 3 THEN 'BookOpen'
    WHEN 4 THEN 'Shield'
    ELSE 'Compass'
  END,
  cor_acento = CASE number
    WHEN 1 THEN 'amber'
    WHEN 2 THEN 'purple'
    WHEN 3 THEN 'gold'
    WHEN 4 THEN 'emerald'
    ELSE 'amber'
  END,
  temas = CASE number
    WHEN 1 THEN ARRAY['Ética', 'Limites', 'Glossário', 'Ritos Simples']
    WHEN 2 THEN ARRAY['Arquétipos', 'Sombra', 'Contos', 'Biblioteca']
    WHEN 3 THEN ARRAY['Sala de Sessão', 'Mapas', 'IA', 'Prática']
    WHEN 4 THEN ARRAY['Condução', 'Supervisão', 'Ética Avançada', 'Grupos']
    ELSE ARRAY[]::TEXT[]
  END,
  portal_minimo = CASE number
    WHEN 1 THEN 'visitante'::portal_type
    WHEN 2 THEN 'mentorada'::portal_type
    WHEN 3 THEN 'mentorada'::portal_type
    WHEN 4 THEN 'oracula'::portal_type
    ELSE 'visitante'::portal_type
  END,
  requer_profissional = CASE number
    WHEN 3 THEN true
    WHEN 4 THEN true
    ELSE false
  END,
  ativa = true,
  ordem = number
WHERE slug IS NULL;

-- Garantir RLS está habilitado
ALTER TABLE public.travessias ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas se existirem e recriar
DROP POLICY IF EXISTS "Public can view active travessias" ON public.travessias;
DROP POLICY IF EXISTS "Admin full access to travessias" ON public.travessias;

-- Leitura para travessias ativas ou admin
CREATE POLICY "Public can view active travessias"
ON public.travessias FOR SELECT
USING (ativa = true OR get_user_portal(auth.uid()) = 'admin');

-- Admin acesso total para INSERT/UPDATE/DELETE
CREATE POLICY "Admin full access to travessias"
ON public.travessias FOR ALL
USING (get_user_portal(auth.uid()) = 'admin')
WITH CHECK (get_user_portal(auth.uid()) = 'admin');