-- SPRINT_04C1C_BLOCK_B_MATRICULAS_PENDENTES_AUDIT_COLUMNS_REVIEW.sql
-- Objetivo: Adicionar colunas de auditoria na tabela matriculas_pendentes
-- Data: 2026-05-13
-- Regras: Sem UPDATE, sem DELETE, sem Backfill, sem alteração de funções/triggers.

DO $$ 
BEGIN
    -- 1. rockty_offer_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'rockty_offer_id'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN rockty_offer_id text;
    END IF;

    -- 2. plan_id (com FK para plans)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'plan_id'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN plan_id text REFERENCES public.plans(id);
    END IF;

    -- 3. external_subscription_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'external_subscription_id'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN external_subscription_id text;
    END IF;

    -- 4. processing_status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'processing_status'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN processing_status text DEFAULT 'pending';
    END IF;

    -- 5. processing_error
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'processing_error'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN processing_error text;
    END IF;

    -- 6. last_attempt_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes' AND column_name = 'last_attempt_at'
    ) THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN last_attempt_at timestamptz;
    END IF;
END $$;

-- ==========================================
-- VALIDAÇÕES PÓS-EXECUÇÃO
-- ==========================================

-- 1. Schema final de public.matriculas_pendentes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'matriculas_pendentes'
ORDER BY ordinal_position;

-- 2. Confirmação específica das 6 colunas adicionadas
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'matriculas_pendentes' 
  AND column_name IN (
    'rockty_offer_id', 
    'plan_id', 
    'external_subscription_id', 
    'processing_status', 
    'processing_error', 
    'last_attempt_at'
  );

-- 3. Contagem total de pendências
SELECT COUNT(*) as total_registros FROM public.matriculas_pendentes;

-- 4. Contagem de pendências não processadas (processado = false)
SELECT COUNT(*) as pendencias_nao_processadas FROM public.matriculas_pendentes WHERE processado = false;

-- 5. Contagem de registros com processing_status diferente de 'pending' (deve ser 0)
SELECT COUNT(*) as status_divergente_de_pending FROM public.matriculas_pendentes WHERE processing_status != 'pending';

-- 6. Confirmação de que subscriptions não mudou (Snapshot da contagem)
SELECT COUNT(*) as total_subscriptions FROM public.subscriptions;

-- 7. Confirmação de que profiles e user_roles não mudaram (Snapshot da contagem)
SELECT 
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    (SELECT COUNT(*) FROM public.user_roles) as total_user_roles;
