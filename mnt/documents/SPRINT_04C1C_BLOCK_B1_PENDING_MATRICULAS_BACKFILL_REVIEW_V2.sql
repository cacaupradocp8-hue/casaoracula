-- SPRINT_04C1C_BLOCK_B1_PENDING_MATRICULAS_BACKFILL_REVIEW_V2.sql
-- Objetivo: Backfill controlado de auditoria para as 3 pendências existentes
-- Data: 2026-05-13
-- Regras: Sem processar matrícula, sem alterar portais, sem alterar subscriptions.
-- Ajuste V2: Usar internal_plan_id da tabela rockty_offer_mapping.

-- 1. SELECT DRY-RUN (Antes do UPDATE)
-- Mostra a previsão de alteração para cada pendência baseada no mapeamento
SELECT 
    m.id,
    m.email,
    m.curso_id,
    m.produto_rockty,
    m.rockty_offer_id as offer_id_atual,
    rom.rockty_offer_id as offer_id_futuro,
    m.plan_id as plan_id_atual,
    rom.internal_plan_id as plan_id_futuro,
    m.processing_status as status_atual,
    CASE 
        WHEN rom.rockty_offer_id IS NOT NULL THEN 'pending'
        WHEN m.curso_id = 'TEST_UNKNOWN_OFFER' THEN 'unmapped'
        ELSE 'unmapped'
    END as status_futuro,
    m.processing_error as erro_atual,
    CASE 
        WHEN rom.rockty_offer_id IS NOT NULL THEN NULL
        WHEN m.curso_id = 'TEST_UNKNOWN_OFFER' THEN 'Oferta não mapeada'
        ELSE 'Oferta desconhecida para revisão manual'
    END as erro_futuro,
    m.processado
FROM public.matriculas_pendentes m
LEFT JOIN public.rockty_offer_mapping rom ON (m.curso_id = rom.rockty_offer_id OR m.produto_rockty = rom.rockty_offer_id)
WHERE m.processado = false;

-- 2. UPDATE IDEMPOTENTE (Não executar ainda)
/*
BEGIN;

-- 2.1 Backfill para Ofertas Mapeadas (Usando internal_plan_id)
UPDATE public.matriculas_pendentes m
SET 
    rockty_offer_id = rom.rockty_offer_id,
    plan_id = rom.internal_plan_id,
    processing_status = 'pending',
    processing_error = NULL
FROM public.rockty_offer_mapping rom
WHERE (m.curso_id = rom.rockty_offer_id OR m.produto_rockty = rom.rockty_offer_id)
AND m.processado = false;

-- 2.2 Backfill para TEST_UNKNOWN_OFFER
UPDATE public.matriculas_pendentes
SET 
    rockty_offer_id = 'TEST_UNKNOWN_OFFER',
    plan_id = NULL,
    processing_status = 'unmapped',
    processing_error = 'Oferta não mapeada'
WHERE (curso_id = 'TEST_UNKNOWN_OFFER' OR produto_rockty = 'TEST_UNKNOWN_OFFER')
AND processado = false;

-- 2.3 Backfill para Desconhecidos (Fallback)
UPDATE public.matriculas_pendentes
SET 
    processing_status = 'unmapped',
    processing_error = 'Oferta desconhecida para revisão manual'
WHERE (processing_status = 'pending' OR processing_status IS NULL)
AND rockty_offer_id IS NULL
AND processado = false;

COMMIT;
*/

-- 3. VALIDAÇÕES PÓS-BACKFILL
-- 3.1 Contagens Gerais
SELECT 
    (SELECT COUNT(*) FROM public.matriculas_pendentes WHERE processado = false) as pendencias_nao_processadas,
    (SELECT COUNT(*) FROM public.matriculas_pendentes WHERE rockty_offer_id IS NOT NULL) as total_com_offer_id,
    (SELECT COUNT(*) FROM public.matriculas_pendentes WHERE plan_id IS NOT NULL) as total_com_plan_id,
    (SELECT COUNT(*) FROM public.matriculas_pendentes WHERE processing_status = 'pending') as total_pending,
    (SELECT COUNT(*) FROM public.matriculas_pendentes WHERE processing_status = 'unmapped') as total_unmapped;

-- 3.2 Snapshot de Segurança (Devem ser iguais aos valores pré-execução)
SELECT 
    (SELECT COUNT(*) FROM public.subscriptions) as total_subscriptions,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    (SELECT COUNT(*) FROM public.user_roles) as total_user_roles;
