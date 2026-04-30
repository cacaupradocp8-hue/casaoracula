-- Add level and specific fields for Clube Level (Level 1)
ALTER TABLE public.co_camara_sussurro_casos 
ADD COLUMN IF NOT EXISTS nivel_produto TEXT NOT NULL DEFAULT 'formacao' CHECK (nivel_produto IN ('clube', 'formacao')),
ADD COLUMN IF NOT EXISTS opcoes_leitura JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS explicacao_simples TEXT;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_camara_casos_nivel_produto ON public.co_camara_sussurro_casos(nivel_produto);

-- Update RLS (assuming it's already enabled, but making sure it respects the level)
-- Everyone authenticated can see 'clube' cases (Level 1)
-- Only 'formacao' (aluna/oracula/assinante/admin) can see 'formacao' cases (Level 2)
DROP POLICY IF EXISTS "Users can view active cases" ON public.co_camara_sussurro_casos;

CREATE POLICY "Everyone can view active Clube cases" 
ON public.co_camara_sussurro_casos 
FOR SELECT 
USING (ativo = true AND (nivel_produto = 'clube' OR (SELECT portal FROM user_roles WHERE user_id = auth.uid()) IN ('aluna', 'oracula', 'assinante', 'admin', 'mentorada', 'aluna_formacao', 'pre_iniciada', 'iniciada')));

-- Ensure admins can manage everything
DROP POLICY IF EXISTS "Admins can manage cases" ON public.co_camara_sussurro_casos;
CREATE POLICY "Admins can manage cases" 
ON public.co_camara_sussurro_casos 
FOR ALL 
USING ((SELECT portal FROM user_roles WHERE user_id = auth.uid()) = 'admin');
