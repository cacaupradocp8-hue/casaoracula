# SPRINT_04C1C_BLOCK_B_MATRICULAS_PENDENTES_AUDIT_COLUMNS_PLAN

**Versão:** 1.0  
**Status:** Planejamento  
**Objetivo:** Preparar a tabela `public.matriculas_pendentes` para auditoria fina e processamento futuro das compras Rockty, sem alterar funções, triggers ou webhook.

---

## 1. Schema Atual de `public.matriculas_pendentes`

Com base no diagnóstico realizado em 2026-05-13:

### Colunas
| Coluna | Tipo | Nullable | Default |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | NO | `gen_random_uuid()` |
| `email` | `text` | NO | - |
| `curso_id` | `text` | NO | `'formacao_oracula'` |
| `portal_destino` | `USER-DEFINED (portal_type)` | NO | `'pre_iniciada'` |
| `produto_rockty` | `text` | YES | - |
| `transaction_id` | `text` | YES | - |
| `processado` | `boolean` | NO | `false` |
| `created_at` | `timestamptz` | NO | `now()` |
| `updated_at` | `timestamptz` | NO | `now()` |

### Constraints e Índices
- **PK:** `matriculas_pendentes_pkey` (id)
- **Unique:** `matriculas_pendentes_email_curso_unique` (email, curso_id)
- **Index:** `idx_matriculas_pendentes_email` (email)
- **Index:** `idx_matriculas_pendentes_processado` (processado)

---

## 2. Status das Colunas de Auditoria Propostas

| Coluna Proposta | Status Atual | Ação BLOCO B |
| :--- | :--- | :--- |
| `rockty_offer_id` | Ausente | Adicionar (`text`) |
| `plan_id` | Ausente | Adicionar (`text references public.plans(id)`) |
| `external_subscription_id` | Ausente | Adicionar (`text`) |
| `processing_status` | Ausente | Adicionar (`text default 'pending'`) |
| `processing_error` | Ausente | Adicionar (`text`) |
| `last_attempt_at` | Ausente | Adicionar (`timestamptz`) |

---

## 3. SQL Proposto (Idempotente)

```sql
-- BLOCO B: Adição de colunas de auditoria em matriculas_pendentes
-- Sem alteração de dados existentes, triggers ou funções.

DO $$ 
BEGIN
    -- 1. rockty_offer_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas_pendentes' AND column_name = 'rockty_offer_id') THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN rockty_offer_id text;
    END IF;

    -- 2. plan_id (com FK para plans)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas_pendentes' AND column_name = 'plan_id') THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN plan_id text REFERENCES public.plans(id);
    END IF;

    -- 3. external_subscription_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas_pendentes' AND column_name = 'external_subscription_id') THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN external_subscription_id text;
    END IF;

    -- 4. processing_status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas_pendentes' AND column_name = 'processing_status') THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN processing_status text DEFAULT 'pending';
    END IF;

    -- 5. processing_error
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas_pendentes' AND column_name = 'processing_error') THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN processing_error text;
    END IF;

    -- 6. last_attempt_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas_pendentes' AND column_name = 'last_attempt_at') THEN
        ALTER TABLE public.matriculas_pendentes ADD COLUMN last_attempt_at timestamptz;
    END IF;
END $$;
```

---

## 4. Validações Pós-Execução (Script de Auditoria)

Após a execução, os seguintes selects devem ser rodados para garantir a integridade:

1.  **Validação de Schema:**
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'matriculas_pendentes';`
2.  **Contagem de Pendências:**
    `SELECT COUNT(*) FROM public.matriculas_pendentes WHERE processado = false;`
3.  **Integridade de Processamento:**
    `SELECT COUNT(*) FROM public.matriculas_pendentes WHERE processing_status != 'pending';` (Deve ser 0)
4.  **Verificação de Portals:**
    `SELECT COUNT(*) FROM public.profiles WHERE portal_tipo IS NULL;` (Apenas para garantir que não houve alteração colateral)
5.  **Verificação de Subscriptions:**
    `SELECT COUNT(*) FROM public.subscriptions;` (Deve manter o valor anterior à execução)

---

## 5. Riscos e Mitigação

-   **FK Fail:** Se houver tentativa de inserir um `plan_id` que não existe em `public.plans`. *Mitigação: Não haverá INSERT/UPDATE neste bloco.*
-   **Conflito de Nomes:** Coluna já existir com tipo diferente. *Mitigação: O script usa IF NOT EXISTS para evitar erros, mas o diagnóstico inicial confirmou a ausência total.*
-   **Dados Legados:** Registros antigos continuam usando `curso_id`. *Mitigação: O processamento futuro (Bloco C) deverá tratar a coexistência ou conversão via Backfill (Bloco B.1).*

---

## 6. Decisão de Backfill

**NÃO será realizado backfill neste bloco.**
As pendências existentes permanecerão com as novas colunas nulas. O preenchimento (`rockty_offer_id` -> `plan_id`) será tratado exclusivamente no **BLOCO B.1**.

---

## 7. Regras de Ouro (Proibições)

-   Não alterar `apply_pending_matricula`.
-   Não alterar `process_webhook_subscription`.
-   Não alterar Webhook ou Edge Functions.
-   Não publicar.
-   Não atualizar registros (`UPDATE`).
