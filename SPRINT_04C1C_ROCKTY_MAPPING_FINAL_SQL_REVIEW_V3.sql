-- =====================================================================
-- SPRINT_04C1C_ROCKTY_MAPPING_FINAL_SQL_REVIEW_V3.sql
-- Versão: V3.3 FINAL V3 (REVISÃO — NÃO EXECUTAR)
-- Data: 2026-05-12
-- Objetivo: Mapeamento oficial Rockty offer_id → plan interno + portal.
--
-- Correções V3:
--   1. Validação de schemas (plans e matriculas_pendentes).
--   2. Inclusão de external_subscription_id em matriculas_pendentes.
--   3. Idempotência avançada em process_webhook_subscription (prioriza external_id).
--   4. Preservação de external_subscription_id no apply_pending_matricula.
--   5. Seção de Backfill opcional para rockty_offer_id.
--   6. Validações pós-migration atualizadas para registros legados.
-- =====================================================================

BEGIN;

-- =====================================================================
-- ETAPA 0 — Backup defensivo das funções existentes
-- =====================================================================

CREATE TABLE IF NOT EXISTS public._sprint_04c1c_function_backup (
  id BIGSERIAL PRIMARY KEY,
  function_name TEXT NOT NULL,
  definition TEXT NOT NULL,
  backed_up_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public._sprint_04c1c_function_backup (function_name, definition)
SELECT 'apply_pending_matricula', pg_get_functiondef('public.apply_pending_matricula'::regproc)
WHERE NOT EXISTS (SELECT 1 FROM public._sprint_04c1c_function_backup WHERE function_name = 'apply_pending_matricula' AND id > 0);

INSERT INTO public._sprint_04c1c_function_backup (function_name, definition)
SELECT 'process_webhook_subscription', pg_get_functiondef('public.process_webhook_subscription'::regproc)
WHERE NOT EXISTS (SELECT 1 FROM public._sprint_04c1c_function_backup WHERE function_name = 'process_webhook_subscription' AND id > 0);

-- =====================================================================
-- ETAPA 1 — Criar plans ausentes
-- Confirmado Schema: (id, nome, descricao, portal_resultante, ativo)
-- =====================================================================

INSERT INTO public.plans (id, nome, descricao, portal_resultante, ativo)
VALUES
  ('clube_mensal',     'Clube Mensal',     'Assinatura mensal do Clube',  'assinante', true),
  ('clube_anual',      'Clube Anual',      'Assinatura anual do Clube',   'assinante', true),
  ('formacao_oracula', 'Formação Oráculas','Formação completa Oráculas',  'aluna',     true)
ON CONFLICT (id) DO UPDATE SET
  portal_resultante = EXCLUDED.portal_resultante,
  ativo = true;

-- =====================================================================
-- ETAPA 2 — Criar tabela rockty_offer_mapping (matriz oficial)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.rockty_offer_mapping (
  rockty_offer_id   TEXT PRIMARY KEY,
  internal_plan_id  TEXT NOT NULL REFERENCES public.plans(id),
  portal_destino    public.portal_type NOT NULL,
  descricao         TEXT,
  ativo             BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rockty_offer_mapping ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='rockty_offer_mapping'
      AND policyname='rockty_offer_mapping_admin_all'
  ) THEN
    CREATE POLICY rockty_offer_mapping_admin_all
      ON public.rockty_offer_mapping
      FOR ALL TO authenticated
      USING (public.is_admin(auth.uid()))
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END$$;

-- Inserir matriz oficial (formacao_oracula -> portal aluna)
INSERT INTO public.rockty_offer_mapping
  (rockty_offer_id, internal_plan_id, portal_destino, descricao)
VALUES
  ('karv9y4bewbdjcwbmvtwq',  'clube_mensal',     'assinante', 'Rockty: Clube Mensal'),
  ('mayikrzz0kc58ijeqs9a',   'clube_mensal',     'assinante', 'Rockty: Clube Mensal (oferta alt.)'),
  ('2tgmh6vsiki7fg0buxdfxq', 'clube_anual',      'assinante', 'Rockty: Clube Anual'),
  ('qqqmfhyjku7ou9kc70gg',   'formacao_oracula', 'aluna',     'Rockty: Formação Oráculas')
ON CONFLICT (rockty_offer_id) DO UPDATE
SET internal_plan_id = EXCLUDED.internal_plan_id,
    portal_destino   = EXCLUDED.portal_destino,
    descricao        = EXCLUDED.descricao,
    updated_at       = now();

-- =====================================================================
-- ETAPA 3 — Estender matriculas_pendentes
-- Inclusão de external_subscription_id e IDs de controle
-- =====================================================================

ALTER TABLE public.matriculas_pendentes
  ADD COLUMN IF NOT EXISTS rockty_offer_id           TEXT,
  ADD COLUMN IF NOT EXISTS external_subscription_id  TEXT,
  ADD COLUMN IF NOT EXISTS plan_id                   TEXT REFERENCES public.plans(id),
  ADD COLUMN IF NOT EXISTS processing_status         TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS processing_error          TEXT,
  ADD COLUMN IF NOT EXISTS last_attempt_at           TIMESTAMPTZ;

-- Trigger de validação de status
CREATE OR REPLACE FUNCTION public.validate_matriculas_pendentes_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.processing_status NOT IN ('pending','processed','unmapped','error') THEN
    RAISE EXCEPTION 'processing_status inválido: %', NEW.processing_status;
  END IF;
  RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS trg_validate_matriculas_pendentes_status ON public.matriculas_pendentes;
CREATE TRIGGER trg_validate_matriculas_pendentes_status
  BEFORE INSERT OR UPDATE ON public.matriculas_pendentes
  FOR EACH ROW EXECUTE FUNCTION public.validate_matriculas_pendentes_status();

-- =====================================================================
-- ETAPA 4 — (OPCIONAL) Backfill de registros legados
-- Comentado para revisão: Copia curso_id/produto_rockty para rockty_offer_id
-- =====================================================================
/*
UPDATE public.matriculas_pendentes
SET rockty_offer_id = COALESCE(produto_rockty, curso_id)
WHERE rockty_offer_id IS NULL
  AND (produto_rockty IS NOT NULL OR curso_id IS NOT NULL);
*/

-- =====================================================================
-- ETAPA 5 — Reforçar UNIQUEs em subscriptions
-- Remove regra legada que impedia múltiplos planos por usuário/provider
-- =====================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_user_provider_unique' AND conrelid = 'public.subscriptions'::regclass) THEN
    ALTER TABLE public.subscriptions DROP CONSTRAINT subscriptions_user_provider_unique;
  END IF;
END$$;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_provider_extid_unique
  ON public.subscriptions (provider, external_subscription_id)
  WHERE external_subscription_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_provider_plan_unique
  ON public.subscriptions (user_id, provider, plan_id);

-- =====================================================================
-- ETAPA 6 — Atualizar funções (apply_pending_matricula + process_webhook)
-- =====================================================================

-- 6.1 apply_pending_matricula (Agora preserva external_subscription_id)
CREATE OR REPLACE FUNCTION public.apply_pending_matricula()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pending  RECORD;
  mapping  RECORD;
  target_offer_id TEXT;
BEGIN
  -- Busca a pendência mais recente para o email que acabou de se cadastrar
  SELECT * INTO pending
  FROM public.matriculas_pendentes
  WHERE email = NEW.email
    AND processing_status IN ('pending','unmapped','error')
    AND processado = false
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  -- Fallback seguro para capturar o offer_id (legado ou novo)
  target_offer_id := COALESCE(pending.rockty_offer_id, pending.produto_rockty, pending.curso_id);

  -- Busca o mapeamento na matriz oficial
  SELECT * INTO mapping
  FROM public.rockty_offer_mapping
  WHERE rockty_offer_id = target_offer_id
    AND ativo = true
  LIMIT 1;

  -- Se não encontrar mapeamento, marca como unmapped e segue o fluxo de signup sem travar
  IF NOT FOUND OR mapping IS NULL THEN
    UPDATE public.matriculas_pendentes
    SET processing_status = 'unmapped',
        processing_error  = 'oferta não mapeada: ' || COALESCE(target_offer_id, 'null'),
        last_attempt_at   = now(),
        updated_at        = now()
    WHERE id = pending.id;
    RETURN NEW;
  END IF;

  -- Criar matrícula com plan interno mapeado
  INSERT INTO public.matriculas (user_id, curso_id, ativa, data_inicio)
  VALUES (NEW.id, mapping.internal_plan_id, true, now())
  ON CONFLICT (user_id, curso_id) DO UPDATE SET ativa = true;

  -- Criar/atualizar subscription (Preserva external_subscription_id vindo da pendência)
  INSERT INTO public.subscriptions
    (user_id, provider, plan_id, status, external_subscription_id, last_event_at)
  VALUES
    (NEW.id, 'rockty', mapping.internal_plan_id, 'active', pending.external_subscription_id, now())
  ON CONFLICT (user_id, provider, plan_id) DO UPDATE
    SET status = 'active', 
        external_subscription_id = COALESCE(EXCLUDED.external_subscription_id, subscriptions.external_subscription_id),
        last_event_at = now(), 
        updated_at = now();

  -- Sincronizar Portais (Resultante do mapeamento)
  UPDATE public.user_roles SET portal = mapping.portal_destino WHERE user_id = NEW.id;
  UPDATE public.profiles SET portal = mapping.portal_destino, updated_at = now() WHERE id = NEW.id;

  -- Finalizar pendência com sucesso
  UPDATE public.matriculas_pendentes
  SET processing_status = 'processed',
      processing_error  = NULL,
      plan_id           = mapping.internal_plan_id,
      last_attempt_at   = now(),
      processado        = true,
      updated_at        = now()
  WHERE id = pending.id;

  RETURN NEW;
END$$;

-- 6.2 process_webhook_subscription (Idempotência priorizando external_id)
CREATE OR REPLACE FUNCTION public.process_webhook_subscription(
  _user_id uuid, _provider text, _plan_id text, _status text, _portal text, 
  _subscription_status_profile text, _current_period_start timestamptz, 
  _current_period_end timestamptz, _next_billing_date timestamptz, 
  _external_subscription_id text, _customer_name text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sub_id uuid;
  _result jsonb;
BEGIN
  -- Lógica de Idempotência:
  -- 1. Se _external_subscription_id existe, tenta atualizar por ele primeiro.
  -- 2. Se não existir ID externo ou não encontrar registro, usa ON CONFLICT (user_id, provider, plan_id).

  IF _external_subscription_id IS NOT NULL THEN
    UPDATE subscriptions SET
      status = _status,
      plan_id = _plan_id, -- Permite troca de plano mantendo o ID externo
      current_period_start = COALESCE(_current_period_start, current_period_start),
      current_period_end = COALESCE(_current_period_end, current_period_end),
      next_billing_date = _next_billing_date,
      last_event_at = now(),
      updated_at = now()
    WHERE provider = _provider 
      AND external_subscription_id = _external_subscription_id
    RETURNING id INTO _sub_id;
  END IF;

  IF _sub_id IS NULL THEN
    INSERT INTO subscriptions (
      user_id, provider, plan_id, status, current_period_start, 
      current_period_end, next_billing_date, external_subscription_id, last_event_at
    )
    VALUES (
      _user_id, _provider, _plan_id, _status, _current_period_start, 
      _current_period_end, _next_billing_date, _external_subscription_id, now()
    )
    ON CONFLICT (user_id, provider, plan_id) DO UPDATE SET
      status = EXCLUDED.status,
      current_period_start = COALESCE(EXCLUDED.current_period_start, subscriptions.current_period_start),
      current_period_end = COALESCE(EXCLUDED.current_period_end, subscriptions.current_period_end),
      next_billing_date = EXCLUDED.next_billing_date,
      external_subscription_id = COALESCE(EXCLUDED.external_subscription_id, subscriptions.external_subscription_id),
      last_event_at = now(),
      updated_at = now()
    RETURNING id INTO _sub_id;
  END IF;

  -- Atualiza o portal e metadados no profile
  UPDATE profiles SET
    portal = _portal::portal_type,
    subscription_status = _subscription_status_profile,
    access_expires_at = CASE WHEN _status = 'active' THEN NULL ELSE access_expires_at END,
    nome = COALESCE(_customer_name, nome),
    updated_at = now()
  WHERE id = _user_id;

  -- Sincroniza portal nas roles
  UPDATE user_roles SET portal = _portal::portal_type WHERE user_id = _user_id;

  _result := jsonb_build_object('subscription_id', _sub_id, 'user_id', _user_id, 'portal', _portal, 'status', _status);
  RETURN _result;
END;
$$;

-- =====================================================================
-- ETAPA 7 — (COMENTADA) Sincronização em Massa de Portais
-- =====================================================================
/*
UPDATE public.profiles p
   SET portal = ur.portal,
       updated_at = now()
  FROM public.user_roles ur
 WHERE ur.user_id = p.id
   AND p.portal IS DISTINCT FROM ur.portal;
*/

-- =====================================================================
-- ETAPA 8 — Validações (Somente Leitura - Compatível com Legado)
-- =====================================================================

DO $$
DECLARE
  c_plans         INT;
  c_mapping       INT;
  c_test_unmapped INT;
  c_sub_dup_plan  INT;
  c_portal_aluna  INT;
BEGIN
  SELECT count(*) INTO c_plans FROM public.plans WHERE id IN ('clube_mensal','clube_anual','formacao_oracula');
  SELECT count(*) INTO c_mapping FROM public.rockty_offer_mapping;
  
  -- Validação usando COALESCE para suportar registros que ainda não rodaram backfill
  SELECT count(*) INTO c_test_unmapped 
  FROM public.matriculas_pendentes 
  WHERE COALESCE(rockty_offer_id, produto_rockty, curso_id) = 'TEST_UNKNOWN_OFFER' 
    AND (processing_status = 'unmapped' OR (processado = false AND processing_status = 'pending'));

  SELECT count(*) INTO c_sub_dup_plan FROM (SELECT 1 FROM public.subscriptions GROUP BY user_id, provider, plan_id HAVING count(*) > 1) x;
  SELECT count(*) INTO c_portal_aluna FROM public.rockty_offer_mapping WHERE internal_plan_id = 'formacao_oracula' AND portal_destino = 'aluna';

  RAISE NOTICE 'plans criados (3): %', c_plans;
  RAISE NOTICE 'mapping rows (4): %', c_mapping;
  RAISE NOTICE 'formacao_oracula -> aluna (1): %', c_portal_aluna;
  RAISE NOTICE 'subs duplicadas por plan (0): %', c_sub_dup_plan;
  RAISE NOTICE 'pendências TEST_UNKNOWN_OFFER encontradas: %', c_test_unmapped;
END$$;

COMMIT;

-- =====================================================================
-- DOWN / ROLLBACK (RESTAURAÇÃO MANUAL)
-- =====================================================================
/*
BEGIN;
DO $$
DECLARE def_apply TEXT; def_webhook TEXT;
BEGIN
  SELECT definition INTO def_apply FROM public._sprint_04c1c_function_backup WHERE function_name = 'apply_pending_matricula' ORDER BY id DESC LIMIT 1;
  IF def_apply IS NOT NULL THEN EXECUTE def_apply; END IF;

  SELECT definition INTO def_webhook FROM public._sprint_04c1c_function_backup WHERE function_name = 'process_webhook_subscription' ORDER BY id DESC LIMIT 1;
  IF def_webhook IS NOT NULL THEN EXECUTE def_webhook; END IF;
END$$;
-- Manter colunas novas (não afetam logicamente as funções antigas)
DROP INDEX IF EXISTS public.subscriptions_user_provider_plan_unique;
DROP INDEX IF EXISTS public.subscriptions_provider_extid_unique;
-- ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_provider_unique UNIQUE (user_id, provider);
COMMIT;
*/
