
-- 1. Add control columns to clientes
ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS has_initial_cartography boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_initial_cidadela boolean NOT NULL DEFAULT false;

-- 2. Replace bootstrap trigger to only create empty jardim container
CREATE OR REPLACE FUNCTION public.bootstrap_cliente_jardim_base()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create a bare jardim_heroina container (inactive, empty).
  -- Session cases, journeys, maps, cidadela are NOT created here.
  -- They are generated after the initial cartography is completed.
  INSERT INTO public.jardim_heroina (
    therapist_id,
    client_id,
    status
  )
  VALUES (
    NEW.terapeuta_id,
    NEW.id,
    'inactive'
  );

  RETURN NEW;
END;
$function$;
