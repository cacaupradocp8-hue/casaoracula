
-- Adicionar CHECK constraint no campo contexto
ALTER TABLE public.co_cartografia_profile
ADD CONSTRAINT co_cartografia_profile_contexto_check
CHECK (contexto IN ('clube', 'formacao', 'casa_das_maquinas'));

-- Adicionar colunas para futura relação terapeuta/cliente
ALTER TABLE public.co_cartografia_profile
ADD COLUMN client_user_id UUID,
ADD COLUMN therapist_user_id UUID;

-- Índices para busca por cliente/terapeuta
CREATE INDEX idx_co_cartografia_profile_client ON public.co_cartografia_profile (client_user_id) WHERE client_user_id IS NOT NULL;
CREATE INDEX idx_co_cartografia_profile_therapist ON public.co_cartografia_profile (therapist_user_id) WHERE therapist_user_id IS NOT NULL;
