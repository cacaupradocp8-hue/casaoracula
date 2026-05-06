ALTER TABLE public.profiles DISABLE TRIGGER USER;

UPDATE public.profiles
SET 
  role = 'admin',
  portal = 'admin',
  access_status = 'member_continuity',
  onboarding_completed = true,
  is_professional_verified = true,
  updated_at = now()
WHERE id = 'b96d37f9-6d45-412c-b358-2115d0c0c86b';

ALTER TABLE public.profiles ENABLE TRIGGER USER;