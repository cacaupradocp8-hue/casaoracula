-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_degustacao_request_created ON public.degustacao_requests;
DROP FUNCTION IF EXISTS public.notify_admin_degustacao_request() CASCADE;

-- Create corrected function using proper table/field names
CREATE OR REPLACE FUNCTION public.notify_admin_degustacao_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_ids UUID[];
  admin_id UUID;
  user_name TEXT;
BEGIN
  -- Get all admin IDs from user_roles table
  SELECT ARRAY_AGG(user_id) INTO admin_ids
  FROM public.user_roles
  WHERE portal = 'admin';
  
  -- Get user name using correct field 'nome'
  SELECT COALESCE(nome, email, 'Visitante') INTO user_name
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- Create notification for each admin using correct table 'notifications'
  IF admin_ids IS NOT NULL THEN
    FOREACH admin_id IN ARRAY admin_ids
    LOOP
      INSERT INTO public.notifications (user_id, type, title, body)
      VALUES (
        admin_id,
        'info',
        'Novo pedido de degustação',
        user_name || ' solicitou acesso de degustação por 24h.'
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on degustacao_requests table
CREATE TRIGGER on_degustacao_request_created
  AFTER INSERT ON public.degustacao_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_degustacao_request();