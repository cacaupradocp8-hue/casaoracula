ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS data_nascimento DATE,
  ADD COLUMN IF NOT EXISTS estado_civil TEXT,
  ADD COLUMN IF NOT EXISTS numero_filhos INTEGER,
  ADD COLUMN IF NOT EXISTS informacoes_relevantes TEXT;

CREATE OR REPLACE FUNCTION public.bootstrap_cliente_jardim_base()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _case_id UUID;
BEGIN
  INSERT INTO public.session_cases (therapist_id, client_id, title, status)
  VALUES (
    NEW.terapeuta_id,
    NEW.id,
    CONCAT('Jornada de ', NEW.nome),
    'active'
  )
  RETURNING id INTO _case_id;

  INSERT INTO public.jardim_heroina (
    case_id,
    therapist_id,
    client_id,
    status
  )
  VALUES (
    _case_id,
    NEW.terapeuta_id,
    NEW.id,
    'inactive'
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bootstrap_cliente_jardim_base ON public.clientes;

CREATE TRIGGER trg_bootstrap_cliente_jardim_base
AFTER INSERT ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION public.bootstrap_cliente_jardim_base();