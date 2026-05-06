-- SQL Final de Promoção do Novo Admin
-- Placeholder: [AUTH_USER_ID] (UUID gerado após o signup no novo Supabase)
-- Placeholder: [EMAIL_ADMIN] (Seu email de acesso)

-- Passo 1: Garantir que o perfil exista (caso o trigger falhe ou não exista)
INSERT INTO public.profiles (
    id, 
    email, 
    role, 
    portal, 
    onboarding_completed, 
    is_professional_verified,
    access_status
)
VALUES (
    '[AUTH_USER_ID]', 
    '[EMAIL_ADMIN]', 
    'admin', 
    'admin', 
    true, 
    true,
    'active'
)
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin', 
    portal = 'admin',
    access_status = 'active';

-- Passo 2: Validar acesso
-- SELECT * FROM public.profiles WHERE role = 'admin';
