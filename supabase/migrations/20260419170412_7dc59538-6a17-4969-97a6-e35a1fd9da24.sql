-- ============================================================
-- FASE 1: Evoluir 80/20 → Laboratório Oracular (3 fases)
-- ============================================================

-- ---------- season_labs: configuração autoral da obra ----------
ALTER TABLE public.season_labs
  -- Cartografia (sugestões da obra)
  ADD COLUMN IF NOT EXISTS cart_torre_sugerida text,
  ADD COLUMN IF NOT EXISTS cart_porta_sugerida text,
  ADD COLUMN IF NOT EXISTS cart_labirinto_sugerido text,
  ADD COLUMN IF NOT EXISTS cart_distrito_sugerido text,
  ADD COLUMN IF NOT EXISTS cart_arquetipos_sugeridos text[],
  ADD COLUMN IF NOT EXISTS cart_observacoes_obra text,
  -- Espelho Clínico
  ADD COLUMN IF NOT EXISTS esp_exemplos_manifestacao text,
  ADD COLUMN IF NOT EXISTS esp_categorias_padrao text[],
  ADD COLUMN IF NOT EXISTS esp_riscos_clinicos text,
  ADD COLUMN IF NOT EXISTS esp_contraindicacoes text,
  -- Forja Narrativa
  ADD COLUMN IF NOT EXISTS forja_template_objetivo text,
  ADD COLUMN IF NOT EXISTS forja_template_estrategia text,
  ADD COLUMN IF NOT EXISTS forja_perguntas_chave text[],
  ADD COLUMN IF NOT EXISTS forja_intervencao_modelo text,
  ADD COLUMN IF NOT EXISTS forja_fechamento_sugerido text;

-- ---------- lab_8020_progress: progresso da usuária ----------
ALTER TABLE public.lab_8020_progress
  -- Origem do laboratório (estação OU livro do acervo)
  ADD COLUMN IF NOT EXISTS book_id uuid REFERENCES public.books(id) ON DELETE SET NULL,
  -- Fase Cartografia
  ADD COLUMN IF NOT EXISTS cart_torre text,
  ADD COLUMN IF NOT EXISTS cart_porta text,
  ADD COLUMN IF NOT EXISTS cart_labirinto text,
  ADD COLUMN IF NOT EXISTS cart_distrito text,
  ADD COLUMN IF NOT EXISTS cart_arquetipos text[],
  ADD COLUMN IF NOT EXISTS cart_observacoes text,
  ADD COLUMN IF NOT EXISTS cart_analise_ia jsonb,
  ADD COLUMN IF NOT EXISTS cart_status text DEFAULT 'not_started',
  -- Fase Espelho Clínico
  ADD COLUMN IF NOT EXISTS esp_onde_ve text,
  ADD COLUMN IF NOT EXISTS esp_manifestacao text,
  ADD COLUMN IF NOT EXISTS esp_risco text,
  ADD COLUMN IF NOT EXISTS esp_nao_fazer text,
  ADD COLUMN IF NOT EXISTS esp_categorias_selecionadas text[],
  ADD COLUMN IF NOT EXISTS esp_analise_ia jsonb,
  ADD COLUMN IF NOT EXISTS esp_status text DEFAULT 'not_started',
  -- Fase Forja Narrativa
  ADD COLUMN IF NOT EXISTS forja_objetivo text,
  ADD COLUMN IF NOT EXISTS forja_estrategia text,
  ADD COLUMN IF NOT EXISTS forja_perguntas text,
  ADD COLUMN IF NOT EXISTS forja_intervencao text,
  ADD COLUMN IF NOT EXISTS forja_fechamento text,
  ADD COLUMN IF NOT EXISTS forja_riscos text,
  ADD COLUMN IF NOT EXISTS forja_respostas_cliente text,
  ADD COLUMN IF NOT EXISTS forja_ajustes_rota text,
  ADD COLUMN IF NOT EXISTS forja_plano_ia jsonb,
  ADD COLUMN IF NOT EXISTS forja_status text DEFAULT 'not_started';

-- season_id pode ser nulo agora (laboratório de livro livre do acervo)
ALTER TABLE public.lab_8020_progress
  ALTER COLUMN season_id DROP NOT NULL;

-- Garantir que a usuária tenha no máximo um progresso por (user, season) ou (user, book)
CREATE UNIQUE INDEX IF NOT EXISTS lab_progress_user_season_uniq
  ON public.lab_8020_progress(user_id, season_id)
  WHERE season_id IS NOT NULL AND book_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS lab_progress_user_book_uniq
  ON public.lab_8020_progress(user_id, book_id)
  WHERE book_id IS NOT NULL;

-- Validação: precisa ter ao menos uma origem
CREATE OR REPLACE FUNCTION public.validate_lab_progress_origin()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.season_id IS NULL AND NEW.book_id IS NULL THEN
    RAISE EXCEPTION 'lab_8020_progress requires either season_id or book_id';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_lab_progress_origin ON public.lab_8020_progress;
CREATE TRIGGER trg_validate_lab_progress_origin
  BEFORE INSERT OR UPDATE ON public.lab_8020_progress
  FOR EACH ROW EXECUTE FUNCTION public.validate_lab_progress_origin();
