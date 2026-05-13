ALTER TABLE public.profiles DISABLE TRIGGER protect_profile_privileged_fields_trigger;

UPDATE public.profiles SET portal = 'assinante' WHERE id = '81b7fdfc-fc46-402f-b5d0-50ca9e2d148e';

ALTER TABLE public.profiles ENABLE TRIGGER protect_profile_privileged_fields_trigger;