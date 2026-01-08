
-- ===========================================
-- FIX THERAPIST ↔ CLIENT LINKING SYSTEM
-- ===========================================

-- Drop existing problematic SELECT policies for therapists viewing records
DROP POLICY IF EXISTS "Terapeutas can view Big5 records via caso" ON big5_registros;
DROP POLICY IF EXISTS "Terapeutas can view Eneagrama records via caso" ON eneagrama_registros;

-- Create new comprehensive SELECT policies for therapists
-- They can view records if:
-- 1. They created the record (terapeuta_id = auth.uid())
-- 2. The record belongs to a client they are actively linked to

CREATE POLICY "Terapeutas can view linked client Big5 records"
ON big5_registros
FOR SELECT
USING (
  -- Admin bypass
  get_user_portal(auth.uid()) = 'admin'::portal_type
  OR
  -- Therapist who created the record
  auth.uid() = terapeuta_id
  OR
  -- Therapist linked to the client (can see client's self-assessments AND their own assessments)
  EXISTS (
    SELECT 1 FROM terapeuta_clientes tc
    WHERE tc.terapeuta_id = auth.uid()
      AND tc.cliente_id = big5_registros.user_id
      AND tc.ativo = true
  )
);

CREATE POLICY "Terapeutas can view linked client Eneagrama records"
ON eneagrama_registros
FOR SELECT
USING (
  -- Admin bypass
  get_user_portal(auth.uid()) = 'admin'::portal_type
  OR
  -- Therapist who created the record
  auth.uid() = terapeuta_id
  OR
  -- Therapist linked to the client (can see client's self-assessments AND their own assessments)
  EXISTS (
    SELECT 1 FROM terapeuta_clientes tc
    WHERE tc.terapeuta_id = auth.uid()
      AND tc.cliente_id = eneagrama_registros.user_id
      AND tc.ativo = true
  )
);

-- Also update the "Clientes can view own" policy to be more specific
-- (keeping it as is - it already works correctly)

-- Create a helper function for checking therapist-client link
CREATE OR REPLACE FUNCTION public.is_linked_therapist(_terapeuta_id uuid, _cliente_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.terapeuta_clientes
    WHERE terapeuta_id = _terapeuta_id
      AND cliente_id = _cliente_id
      AND ativo = true
  )
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_linked_therapist(uuid, uuid) TO authenticated;
