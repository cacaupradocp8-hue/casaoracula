-- Fix co_jardins visibility check to include client_owned
ALTER TABLE public.co_jardins DROP CONSTRAINT co_jardins_visibility_check;
ALTER TABLE public.co_jardins ADD CONSTRAINT co_jardins_visibility_check 
  CHECK (visibility_scope = ANY (ARRAY['therapist_only'::text, 'shared'::text, 'full'::text, 'client_owned'::text]));