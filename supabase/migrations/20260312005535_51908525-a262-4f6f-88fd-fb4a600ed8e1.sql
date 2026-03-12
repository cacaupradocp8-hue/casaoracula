-- FIX 1: Privilege escalation on profiles table
-- Protect privileged fields via trigger (WITH CHECK can't reference OLD)

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    NEW.role := OLD.role;
    NEW.portal := OLD.portal;
    NEW.access_status := OLD.access_status;
    NEW.subscription_status := OLD.subscription_status;
    NEW.access_expires_at := OLD.access_expires_at;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_privileged_fields_trigger ON public.profiles;
CREATE TRIGGER protect_profile_privileged_fields_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileged_fields();

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- FIX 2: lista_espera anonymous data exposure
DROP POLICY IF EXISTS "Users can view own entry" ON public.lista_espera;
CREATE POLICY "Users can view own entry"
  ON public.lista_espera
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- FIX 3: email_logs open INSERT
DROP POLICY IF EXISTS "Service can insert email logs" ON public.email_logs;
CREATE POLICY "Authenticated can insert own email logs"
  ON public.email_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- FIX 4: video_playback_logs open INSERT
DROP POLICY IF EXISTS "Service can insert playback logs" ON public.video_playback_logs;
CREATE POLICY "Authenticated can insert own playback logs"
  ON public.video_playback_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);