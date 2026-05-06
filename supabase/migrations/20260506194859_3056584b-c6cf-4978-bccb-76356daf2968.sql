-- Bloco 09: Promoção do Admin
-- Alvo: claudiapradocavalcante@gmail.com (b96d37f9-6d45-412c-b358-2115d0c0c86b)

UPDATE public.profiles
SET 
  role = 'admin',
  portal = 'admin',
  access_status = 'active',
  onboarding_completed = true,
  is_professional_verified = true,
  updated_at = now()
WHERE id = 'b96d37f9-6d45-412c-b358-2115d0c0c86b';

-- Garantir user_roles também (idempotente)
INSERT INTO public.user_roles (user_id, portal)
VALUES ('b96d37f9-6d45-412c-b358-2115d0c0c86b', 'admin')
ON CONFLICT (user_id) DO UPDATE SET portal = 'admin';