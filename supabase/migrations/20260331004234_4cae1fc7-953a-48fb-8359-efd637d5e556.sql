
-- Add email field to clientes for invitation flow
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS email text;

-- Create invitation tokens table for secure linking
CREATE TABLE IF NOT EXISTS public.co_convites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  terapeuta_id uuid NOT NULL,
  email text NOT NULL,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);

ALTER TABLE public.co_convites ENABLE ROW LEVEL SECURITY;

-- Therapist can see their own invitations
CREATE POLICY "Therapist can manage own invitations"
  ON public.co_convites FOR ALL
  USING (terapeuta_id = auth.uid())
  WITH CHECK (terapeuta_id = auth.uid());

-- Anyone authenticated can read by token (for accepting)
CREATE POLICY "Authenticated users can read invitations by token"
  ON public.co_convites FOR SELECT
  TO authenticated
  USING (true);

-- Function to auto-link client when they sign up or accept invite
CREATE OR REPLACE FUNCTION public.accept_client_invitation(_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _convite RECORD;
  _user_id uuid;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Não autenticada');
  END IF;

  SELECT * INTO _convite
  FROM public.co_convites
  WHERE token = _token
    AND status = 'pending'
    AND expires_at > now();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Convite inválido ou expirado');
  END IF;

  -- Link client record to this user
  UPDATE public.clientes
  SET client_user_id = _user_id,
      accepted_at = now()
  WHERE id = _convite.cliente_id
    AND client_user_id IS NULL;

  -- Mark invitation as accepted
  UPDATE public.co_convites
  SET status = 'accepted',
      accepted_at = now()
  WHERE id = _convite.id;

  -- Create co_jardins if therapist has an active jardim_heroina for this client
  DECLARE
    _jardim RECORD;
  BEGIN
    SELECT * INTO _jardim
    FROM public.jardim_heroina
    WHERE client_id = _convite.cliente_id
      AND therapist_id = _convite.terapeuta_id
      AND status IN ('active', 'inactive')
    ORDER BY created_at DESC
    LIMIT 1;

    IF FOUND THEN
      INSERT INTO public.co_jardins (client_user_id, therapist_user_id, created_by, status, visibility_scope)
      VALUES (_user_id, _convite.terapeuta_id, _convite.terapeuta_id, 'active', 'client_owned')
      ON CONFLICT DO NOTHING;
    END IF;
  END;

  RETURN jsonb_build_object(
    'success', true,
    'cliente_id', _convite.cliente_id,
    'terapeuta_id', _convite.terapeuta_id
  );
END;
$$;
