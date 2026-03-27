
-- Function: auto-update journey_districts when a session is created/updated with a district_id
CREATE OR REPLACE FUNCTION public.update_journey_on_session()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _journey_id UUID;
  _current_state TEXT;
  _current_count INTEGER;
  _new_state TEXT;
BEGIN
  -- Only proceed if session has a client_id and district_id
  IF NEW.client_id IS NULL OR NEW.district_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get or create journey for this client
  SELECT id INTO _journey_id
  FROM public.journeys
  WHERE client_id = NEW.client_id
  LIMIT 1;

  IF _journey_id IS NULL THEN
    INSERT INTO public.journeys (client_id, current_district_id, process_state)
    VALUES (NEW.client_id, NEW.district_id, 'em_andamento')
    RETURNING id INTO _journey_id;
  ELSE
    -- Update current district
    UPDATE public.journeys
    SET current_district_id = NEW.district_id, updated_at = now()
    WHERE id = _journey_id;
  END IF;

  -- Get current state for this district
  SELECT state, sessions_count INTO _current_state, _current_count
  FROM public.journey_districts
  WHERE journey_id = _journey_id AND district_id = NEW.district_id;

  IF _current_state IS NULL THEN
    -- First session in this district: set to ativo
    INSERT INTO public.journey_districts (journey_id, district_id, state, sessions_count, last_session_at)
    VALUES (_journey_id, NEW.district_id, 'ativo', 1, now());

    -- Log state change
    INSERT INTO public.district_state_changes (client_id, district_id, from_state, to_state, reason)
    VALUES (NEW.client_id, NEW.district_id, 'inativo', 'ativo', 'Primeira sessão registrada no distrito');
  ELSE
    _current_count := COALESCE(_current_count, 0) + 1;
    
    -- Auto-integrate after 3 sessions
    IF _current_count >= 3 AND _current_state != 'integrado' THEN
      _new_state := 'integrado';
      -- Log state change
      INSERT INTO public.district_state_changes (client_id, district_id, from_state, to_state, reason)
      VALUES (NEW.client_id, NEW.district_id, _current_state, 'integrado', 'Auto-integrado após 3 sessões no distrito');
    ELSE
      _new_state := _current_state;
    END IF;

    UPDATE public.journey_districts
    SET sessions_count = _current_count,
        last_session_at = now(),
        state = _new_state
    WHERE journey_id = _journey_id AND district_id = NEW.district_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on sessions table
DROP TRIGGER IF EXISTS trg_update_journey_on_session ON public.sessions;
CREATE TRIGGER trg_update_journey_on_session
  AFTER INSERT ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_journey_on_session();
