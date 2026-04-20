-- Tabela de memória longitudinal de intervenções aplicadas
CREATE TABLE IF NOT EXISTS public.co_intervencoes_aplicadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_user_id UUID NOT NULL,
  therapist_user_id UUID NOT NULL,
  session_id UUID NULL,
  tipo_intervencao TEXT NOT NULL,
  categoria_alvo TEXT NULL,
  resposta_cliente TEXT NULL,
  percepcao_terapeuta TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Validation trigger (instead of CHECK, for flexibility)
CREATE OR REPLACE FUNCTION public.co_validate_intervencao_aplicada()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.tipo_intervencao NOT IN (
    'pergunta_ruptura','confronto_leve','grounding_corpo',
    'separacao_simbolica','sustentar_presenca'
  ) THEN
    RAISE EXCEPTION 'tipo_intervencao inválido: %', NEW.tipo_intervencao;
  END IF;
  IF NEW.categoria_alvo IS NOT NULL AND NEW.categoria_alvo NOT IN (
    'estagnacao','evitacao','dissociacao','fusao'
  ) THEN
    RAISE EXCEPTION 'categoria_alvo inválida: %', NEW.categoria_alvo;
  END IF;
  IF NEW.percepcao_terapeuta IS NOT NULL AND NEW.percepcao_terapeuta NOT IN (
    'eficaz','neutra','sem_efeito'
  ) THEN
    RAISE EXCEPTION 'percepcao_terapeuta inválida: %', NEW.percepcao_terapeuta;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_co_validate_intervencao_aplicada
BEFORE INSERT OR UPDATE ON public.co_intervencoes_aplicadas
FOR EACH ROW EXECUTE FUNCTION public.co_validate_intervencao_aplicada();

CREATE TRIGGER trg_co_intervencoes_aplicadas_updated_at
BEFORE UPDATE ON public.co_intervencoes_aplicadas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_co_int_aplic_client ON public.co_intervencoes_aplicadas(client_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_co_int_aplic_therapist ON public.co_intervencoes_aplicadas(therapist_user_id, created_at DESC);

-- RLS
ALTER TABLE public.co_intervencoes_aplicadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access co_int_aplicadas"
ON public.co_intervencoes_aplicadas FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Client reads own intervencoes_aplicadas"
ON public.co_intervencoes_aplicadas FOR SELECT
USING (auth.uid() = client_user_id);

CREATE POLICY "Therapist reads linked intervencoes_aplicadas"
ON public.co_intervencoes_aplicadas FOR SELECT
USING (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Therapist inserts intervencoes_aplicadas"
ON public.co_intervencoes_aplicadas FOR INSERT
WITH CHECK (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Therapist updates own intervencoes_aplicadas"
ON public.co_intervencoes_aplicadas FOR UPDATE
USING (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id))
WITH CHECK (auth.uid() = therapist_user_id);

CREATE POLICY "Therapist deletes own intervencoes_aplicadas"
ON public.co_intervencoes_aplicadas FOR DELETE
USING (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));