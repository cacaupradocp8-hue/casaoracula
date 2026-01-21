-- Step 2: Remove policies that depend on terapeuta_clientes functions FIRST
DROP POLICY IF EXISTS "Terapeutas can create casos for linked clients" ON casos;
DROP POLICY IF EXISTS "Terapeutas can view casos of linked clients" ON casos;
DROP POLICY IF EXISTS "Terapeutas can update casos of linked clients" ON casos;

-- Drop the policy on big5 and eneagrama
DROP POLICY IF EXISTS "Terapeutas podem ver registros de seus clientes" ON big5_registros;
DROP POLICY IF EXISTS "Terapeutas podem ver registros de seus clientes" ON eneagrama_registros;

-- Now drop the functions that depended on terapeuta_clientes
DROP FUNCTION IF EXISTS public.can_create_caso(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_terapeuta_of_cliente(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_linked_therapist(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.registro_pertence_terapeuta(uuid, uuid, uuid) CASCADE;

-- Drop terapeuta_clientes table
DROP TABLE IF EXISTS terapeuta_clientes CASCADE;

-- Migrate existing users to new portal types
UPDATE user_roles SET portal = 'mentorada' WHERE portal = 'pre_iniciada';
UPDATE user_roles SET portal = 'oracula' WHERE portal = 'iniciada';

-- Update any content that references old portal types (portal_type enum)
UPDATE conteudo_travessias SET portal_minimo = 'mentorada' WHERE portal_minimo = 'pre_iniciada';
UPDATE conteudo_travessias SET portal_minimo = 'oracula' WHERE portal_minimo = 'iniciada';

UPDATE agentes SET portal_minimo = 'mentorada' WHERE portal_minimo = 'pre_iniciada';
UPDATE agentes SET portal_minimo = 'oracula' WHERE portal_minimo = 'iniciada';

UPDATE courses SET portal_minimo = 'mentorada' WHERE portal_minimo = 'pre_iniciada';
UPDATE courses SET portal_minimo = 'oracula' WHERE portal_minimo = 'iniciada';

UPDATE oracle_decks SET minimum_portal = 'mentorada' WHERE minimum_portal = 'pre_iniciada';
UPDATE oracle_decks SET minimum_portal = 'oracula' WHERE minimum_portal = 'iniciada';

UPDATE content_blocks SET portal_minimo = 'mentorada' WHERE portal_minimo = 'pre_iniciada';
UPDATE content_blocks SET portal_minimo = 'oracula' WHERE portal_minimo = 'iniciada';

-- Update has_portal_access function to include new portal types
CREATE OR REPLACE FUNCTION public.has_portal_access(_user_id uuid, _min_portal portal_type)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT CASE 
    WHEN _min_portal = 'visitante' THEN true
    WHEN _min_portal = 'mentorada' THEN public.get_user_portal(_user_id) IN ('mentorada', 'aluna_formacao', 'assinante', 'oracula', 'admin')
    WHEN _min_portal = 'aluna_formacao' THEN public.get_user_portal(_user_id) IN ('aluna_formacao', 'assinante', 'oracula', 'admin')
    WHEN _min_portal = 'assinante' THEN public.get_user_portal(_user_id) IN ('assinante', 'oracula', 'admin')
    WHEN _min_portal = 'oracula' THEN public.get_user_portal(_user_id) IN ('oracula', 'admin')
    WHEN _min_portal = 'admin' THEN public.get_user_portal(_user_id) = 'admin'
    -- Legacy fallback for old values
    WHEN _min_portal = 'pre_iniciada' THEN public.get_user_portal(_user_id) IN ('mentorada', 'aluna_formacao', 'assinante', 'oracula', 'admin')
    WHEN _min_portal = 'iniciada' THEN public.get_user_portal(_user_id) IN ('oracula', 'admin')
    ELSE false
  END
$function$;

-- Update get_user_nivel_sala to use new portal types
CREATE OR REPLACE FUNCTION public.get_user_nivel_sala(_user_id uuid)
 RETURNS nivel_sala
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT CASE get_user_portal(_user_id)
    WHEN 'visitante' THEN 'NIVEL_0'::nivel_sala
    WHEN 'mentorada' THEN 'NIVEL_1'::nivel_sala
    WHEN 'aluna_formacao' THEN 'NIVEL_1'::nivel_sala
    WHEN 'assinante' THEN 'NIVEL_2'::nivel_sala
    WHEN 'oracula' THEN 'NIVEL_2'::nivel_sala
    WHEN 'admin' THEN 'NIVEL_3'::nivel_sala
    -- Legacy fallback
    WHEN 'pre_iniciada' THEN 'NIVEL_1'::nivel_sala
    WHEN 'iniciada' THEN 'NIVEL_2'::nivel_sala
    ELSE 'NIVEL_0'::nivel_sala
  END
$function$;

-- Update user_has_portal_access function
CREATE OR REPLACE FUNCTION public.user_has_portal_access(required_portal portal_type)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_portal public.portal_type;
  portal_levels JSONB := '{"visitante": 1, "mentorada": 2, "aluna_formacao": 3, "assinante": 4, "oracula": 5, "admin": 6, "pre_iniciada": 2, "iniciada": 5}'::jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN (portal_levels->>required_portal::text)::int <= 1;
  END IF;
  
  SELECT portal INTO user_portal
  FROM public.user_roles
  WHERE user_id = auth.uid();
  
  IF user_portal IS NULL THEN
    user_portal := 'visitante';
  END IF;
  
  RETURN (portal_levels->>user_portal::text)::int >= (portal_levels->>required_portal::text)::int;
END;
$function$;

-- Add simple RLS policy for casos (therapist owns their own cases)
CREATE POLICY "Therapists can manage their own cases"
ON casos FOR ALL
USING (auth.uid() = terapeuta_id)
WITH CHECK (auth.uid() = terapeuta_id);