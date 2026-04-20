
-- =========================================================
-- 1. co_detectores_eventos
-- =========================================================
CREATE TABLE IF NOT EXISTS public.co_detectores_eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL,
  therapist_user_id UUID NOT NULL,
  session_id UUID,
  detector_tipo TEXT NOT NULL,
  intensidade TEXT NOT NULL DEFAULT 'media',
  origem TEXT NOT NULL DEFAULT 'sessao',
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Validação por trigger (sem CHECK rígido para flexibilidade futura)
CREATE OR REPLACE FUNCTION public.co_validate_detector_evento()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.detector_tipo NOT IN ('estagnacao','dissociacao','evitacao','fusao') THEN
    RAISE EXCEPTION 'detector_tipo inválido: %', NEW.detector_tipo;
  END IF;
  IF NEW.intensidade NOT IN ('baixa','media','alta') THEN
    RAISE EXCEPTION 'intensidade inválida: %', NEW.intensidade;
  END IF;
  IF NEW.origem NOT IN ('jardim','sessao','ia') THEN
    RAISE EXCEPTION 'origem inválida: %', NEW.origem;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_co_validate_detector_evento
  BEFORE INSERT OR UPDATE ON public.co_detectores_eventos
  FOR EACH ROW EXECUTE FUNCTION public.co_validate_detector_evento();

CREATE INDEX idx_co_detectores_client ON public.co_detectores_eventos(client_user_id);
CREATE INDEX idx_co_detectores_therapist ON public.co_detectores_eventos(therapist_user_id);
CREATE INDEX idx_co_detectores_session ON public.co_detectores_eventos(session_id);

ALTER TABLE public.co_detectores_eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cliente vê seus detectores"
  ON public.co_detectores_eventos FOR SELECT
  USING (auth.uid() = client_user_id);

CREATE POLICY "Terapeuta vê detectores de clientes vinculados"
  ON public.co_detectores_eventos FOR SELECT
  USING (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Terapeuta cria detectores p/ clientes vinculados"
  ON public.co_detectores_eventos FOR INSERT
  WITH CHECK (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Terapeuta atualiza detectores"
  ON public.co_detectores_eventos FOR UPDATE
  USING (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Terapeuta apaga detectores"
  ON public.co_detectores_eventos FOR DELETE
  USING (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Admin acesso total detectores"
  ON public.co_detectores_eventos FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- =========================================================
-- 2. co_mapa_vivo
-- =========================================================
CREATE TABLE IF NOT EXISTS public.co_mapa_vivo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL UNIQUE,
  eixo_movimento TEXT NOT NULL DEFAULT 'estagnacao',
  presenca_emocional TEXT NOT NULL DEFAULT 'baixa',
  eixo_confronto TEXT NOT NULL DEFAULT 'evita',
  regulacao TEXT NOT NULL DEFAULT 'desorganizada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.co_validate_mapa_vivo()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.eixo_movimento NOT IN ('estagnacao','oscilacao','deslocamento') THEN
    RAISE EXCEPTION 'eixo_movimento inválido: %', NEW.eixo_movimento;
  END IF;
  IF NEW.presenca_emocional NOT IN ('baixa','parcial','integrada') THEN
    RAISE EXCEPTION 'presenca_emocional inválida: %', NEW.presenca_emocional;
  END IF;
  IF NEW.eixo_confronto NOT IN ('evita','oscila','sustenta') THEN
    RAISE EXCEPTION 'eixo_confronto inválido: %', NEW.eixo_confronto;
  END IF;
  IF NEW.regulacao NOT IN ('desorganizada','instavel','regulada') THEN
    RAISE EXCEPTION 'regulacao inválida: %', NEW.regulacao;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_co_validate_mapa_vivo
  BEFORE INSERT OR UPDATE ON public.co_mapa_vivo
  FOR EACH ROW EXECUTE FUNCTION public.co_validate_mapa_vivo();

CREATE TRIGGER trg_co_mapa_vivo_updated_at
  BEFORE UPDATE ON public.co_mapa_vivo
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.co_mapa_vivo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cliente vê seu mapa vivo"
  ON public.co_mapa_vivo FOR SELECT
  USING (auth.uid() = client_user_id);

CREATE POLICY "Terapeuta vê mapa vivo de cliente vinculado"
  ON public.co_mapa_vivo FOR SELECT
  USING (public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Terapeuta cria mapa vivo p/ cliente vinculado"
  ON public.co_mapa_vivo FOR INSERT
  WITH CHECK (public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Terapeuta atualiza mapa vivo"
  ON public.co_mapa_vivo FOR UPDATE
  USING (public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Cliente atualiza próprio mapa vivo"
  ON public.co_mapa_vivo FOR UPDATE
  USING (auth.uid() = client_user_id);

CREATE POLICY "Admin acesso total mapa vivo"
  ON public.co_mapa_vivo FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- =========================================================
-- 3. co_intervencoes
-- =========================================================
CREATE TABLE IF NOT EXISTS public.co_intervencoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_user_id UUID NOT NULL,
  client_user_id UUID NOT NULL,
  session_id UUID,
  tipo TEXT NOT NULL,
  descricao TEXT,
  houve_deslocamento BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.co_validate_intervencao_tipo()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.tipo NOT IN ('ruptura','limite','grounding','redirecionamento') THEN
    RAISE EXCEPTION 'tipo de intervenção inválido: %', NEW.tipo;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_co_validate_intervencao_tipo
  BEFORE INSERT OR UPDATE ON public.co_intervencoes
  FOR EACH ROW EXECUTE FUNCTION public.co_validate_intervencao_tipo();

CREATE INDEX idx_co_intervencoes_client ON public.co_intervencoes(client_user_id);
CREATE INDEX idx_co_intervencoes_therapist ON public.co_intervencoes(therapist_user_id);
CREATE INDEX idx_co_intervencoes_session ON public.co_intervencoes(session_id);

ALTER TABLE public.co_intervencoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cliente vê intervenções a seu respeito"
  ON public.co_intervencoes FOR SELECT
  USING (auth.uid() = client_user_id);

CREATE POLICY "Terapeuta vê suas intervenções"
  ON public.co_intervencoes FOR SELECT
  USING (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Terapeuta cria intervenções"
  ON public.co_intervencoes FOR INSERT
  WITH CHECK (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Terapeuta atualiza intervenções"
  ON public.co_intervencoes FOR UPDATE
  USING (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Terapeuta apaga intervenções"
  ON public.co_intervencoes FOR DELETE
  USING (auth.uid() = therapist_user_id AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Admin acesso total intervenções"
  ON public.co_intervencoes FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- =========================================================
-- 4. Extensão de co_jardim_entries
-- =========================================================
ALTER TABLE public.co_jardim_entries
  ADD COLUMN IF NOT EXISTS emocao TEXT,
  ADD COLUMN IF NOT EXISTS padrao_detectado TEXT,
  ADD COLUMN IF NOT EXISTS movimento TEXT,
  ADD COLUMN IF NOT EXISTS analisado_ia BOOLEAN NOT NULL DEFAULT false;
