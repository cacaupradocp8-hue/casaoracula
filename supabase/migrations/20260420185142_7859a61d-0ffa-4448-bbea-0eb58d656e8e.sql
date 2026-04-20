-- Add contexto + payload_hash for dedup
ALTER TABLE public.co_detectores_eventos
  ADD COLUMN IF NOT EXISTS contexto text,
  ADD COLUMN IF NOT EXISTS payload_hash text;

-- Update validator to accept new origem values
CREATE OR REPLACE FUNCTION public.co_validate_detector_evento()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.detector_tipo NOT IN ('estagnacao','dissociacao','evitacao','fusao') THEN
    RAISE EXCEPTION 'detector_tipo inválido: %', NEW.detector_tipo;
  END IF;
  IF NEW.intensidade NOT IN ('baixa','media','alta') THEN
    RAISE EXCEPTION 'intensidade inválida: %', NEW.intensidade;
  END IF;
  IF NEW.origem NOT IN ('heuristica','ia','hibrido','jardim','sessao') THEN
    RAISE EXCEPTION 'origem inválida: %', NEW.origem;
  END IF;
  IF NEW.contexto IS NOT NULL AND NEW.contexto NOT IN ('jardim','sessao') THEN
    RAISE EXCEPTION 'contexto inválido: %', NEW.contexto;
  END IF;
  RETURN NEW;
END;
$function$;

-- Index to speed up dedup lookups
CREATE INDEX IF NOT EXISTS idx_co_detectores_dedup
  ON public.co_detectores_eventos (client_user_id, contexto, payload_hash, created_at DESC);
