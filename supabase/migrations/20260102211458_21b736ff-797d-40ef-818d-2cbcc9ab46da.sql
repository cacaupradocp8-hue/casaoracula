-- Create table for pending enrollments (users who paid but haven't signed up yet)
CREATE TABLE public.matriculas_pendentes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  curso_id text NOT NULL DEFAULT 'formacao_oracula',
  portal_destino portal_type NOT NULL DEFAULT 'pre_iniciada',
  produto_rockty text,
  transaction_id text,
  processado boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.matriculas_pendentes ENABLE ROW LEVEL SECURITY;

-- Only admins can manage pending enrollments
CREATE POLICY "Admins can manage matriculas_pendentes"
ON public.matriculas_pendentes
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Create index for email lookups
CREATE INDEX idx_matriculas_pendentes_email ON public.matriculas_pendentes(email);
CREATE INDEX idx_matriculas_pendentes_processado ON public.matriculas_pendentes(processado);

-- Function to apply pending enrollment when user signs up
CREATE OR REPLACE FUNCTION public.apply_pending_matricula()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pending RECORD;
BEGIN
  -- Find pending enrollment for this email
  SELECT * INTO pending
  FROM public.matriculas_pendentes
  WHERE email = NEW.email
    AND processado = false
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    -- Create enrollment
    INSERT INTO public.matriculas (user_id, curso_id, ativa, data_inicio)
    VALUES (NEW.id, pending.curso_id, true, now())
    ON CONFLICT (user_id, curso_id) DO UPDATE SET ativa = true;

    -- Update user portal level
    UPDATE public.user_roles
    SET portal = pending.portal_destino
    WHERE user_id = NEW.id;

    -- Mark pending as processed
    UPDATE public.matriculas_pendentes
    SET processado = true, updated_at = now()
    WHERE id = pending.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to apply pending enrollment after user creation
CREATE TRIGGER on_auth_user_created_apply_matricula
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.apply_pending_matricula();