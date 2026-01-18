-- Promover claudiapradocavalcante@gmail.com para admin
UPDATE public.user_roles 
SET portal = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'claudiapradocavalcante@gmail.com'
);

-- Se não existir registro em user_roles, criar um
INSERT INTO public.user_roles (user_id, portal)
SELECT id, 'admin'::portal_type
FROM auth.users 
WHERE email = 'claudiapradocavalcante@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.users.id
  );