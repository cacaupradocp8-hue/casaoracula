-- Fix session_cases foreign key: client_id should reference clientes, not profiles
-- This is needed because therapists select clients from the 'clientes' table, not from 'profiles'

-- Drop existing foreign key constraint
ALTER TABLE public.session_cases DROP CONSTRAINT IF EXISTS session_cases_client_id_fkey;

-- Add correct foreign key referencing clientes table
ALTER TABLE public.session_cases 
ADD CONSTRAINT session_cases_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;