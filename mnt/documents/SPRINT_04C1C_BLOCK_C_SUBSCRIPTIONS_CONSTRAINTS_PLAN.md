# SPRINT_04C1C_BLOCK_C_SUBSCRIPTIONS_CONSTRAINTS_PLAN

**Versão:** 1.0  
**Status:** Planejamento  
**Objetivo:** Planejar a alteração segura das constraints e índices da tabela `public.subscriptions` para permitir múltiplos planos por usuário no mesmo provider (ex: Clube e Formação coexistindo).

---

## 1. Schema Atual de `public.subscriptions`

Com base no diagnóstico realizado em 2026-05-13:

### Colunas (Resumo)
| Coluna | Tipo | Nullable | Default |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | NO | `gen_random_uuid()` |
| `user_id` | `uuid` | NO | - |
| `plan_id` | `text` | NO | - |
| `provider` | `text` | NO | - |
| `status` | `text` | NO | - |
| `external_subscription_id` | `text` | YES | - |
| `created_at` | `timestamptz` | NO | `now()` |
| `updated_at` | `timestamptz` | NO | `now()` |

### Constraints e Índices Existentes
- **PK:** `subscriptions_pkey` (id)
- **Unique Constraint:** `subscriptions_user_provider_unique` UNIQUE(`user_id`, `provider`)
- **Index:** `subscriptions_user_provider_unique` (BTREE)

---

## 2. Constraint Atual
Confirmado: Existe a constraint **`subscriptions_user_provider_unique`** definida como `UNIQUE(user_id, provider)`.  
**Impacto:** Esta constraint impede que um usuário tenha mais de um plano ativo (ou inativo) no mesmo provider (ex: impede ter `clube_mensal` e `formacao_oracula` simultaneamente via Rockty).

---

## 3. Diagnóstico de Dados
- **Total de registros:** 0 (Tabela vazia no momento).
- **Conflitos atuais:** Nenhum.
- **Vulnerabilidade:** Se estivesse populada, a ausência de registros facilita a aplicação de novas regras de unicidade sem necessidade de limpeza prévia.

---

## 4. Proposta de Nova Estratégia de Unicidade

Para permitir múltiplos planos sem duplicidade técnica acidental:

1.  **Índice Único Parcial (Proteção de ID Externo):**
    - `UNIQUE (provider, external_subscription_id)`
    - `WHERE external_subscription_id IS NOT NULL`
    - *Objetivo:* Garantir que uma assinatura do provider não seja importada duas vezes.

2.  **Índice Único Composto (Proteção de Plano por Usuário):**
    - `UNIQUE (user_id, provider, plan_id)`
    - *Objetivo:* Impedir que o mesmo usuário tenha duas assinaturas do *mesmo plano* no mesmo provider (ex: dois clubes anuais), mas permitir planos diferentes (ex: um clube e uma formação).

---

## 5. Riscos

- **Dependência de Função:** A função `process_webhook_subscription` provavelmente utiliza `ON CONFLICT (user_id, provider)`. Se a constraint antiga for removida antes da atualização da função, o Webhook quebrará.
- **NULL em IDs Externos:** O índice único parcial não protege registros onde `external_subscription_id` é NULL.
- **NULL em Plan IDs:** Se `plan_id` pudesse ser NULL, o índice composto falharia em bloquear duplicatas. (No schema atual, `plan_id` é NOT NULL).

---

## 6. Opções de Implementação

### Opção C1 — Preparação sem remoção (RECOMENDADA)
- Criar os dois novos índices sugeridos.
- **Manter** `subscriptions_user_provider_unique` por enquanto.
- **Prós:** Risco zero de quebrar o Webhook atual; prepara o banco para o Bloco D.
- **Contras:** Ainda não permite múltiplos planos até que a constraint antiga saia.

### Opção C2 — Troca completa
- Remover `subscriptions_user_provider_unique`.
- Criar novos índices.
- Atualizar `process_webhook_subscription` no mesmo commit.
- **Prós:** Resolve o problema de imediato.
- **Contras:** Alto risco de indisponibilidade se houver erro na sincronização da função.

---

## 7. Recomendação

**Utilizar a Opção C1.**  
É a abordagem mais segura. O Bloco C foca na infraestrutura de índices. O Bloco D tratará da lógica da função. O Bloco D.1 (ou final do D) tratará da remoção da trava antiga.

---

## 8. SQL Proposto (Para Revisão - Não Executar)

```sql
-- BLOCO C: Preparação de índices para múltiplos planos
-- Objetivo: Adicionar proteção extra sem remover a trava antiga por segurança.

-- 1. Índice único parcial para evitar duplicidade de ID externo (Rockty/Stripe)
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_provider_external_id_unique 
ON public.subscriptions (provider, external_subscription_id) 
WHERE external_subscription_id IS NOT NULL;

-- 2. Índice único composto para permitir diferentes planos por usuário/provider
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user_provider_plan_unique 
ON public.subscriptions (user_id, provider, plan_id);
```

---

## 9. Validações Pós-Execução Futura

- `SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'subscriptions';` (Deve mostrar 4 índices: PK, antigo e 2 novos).
- Contagem de registros: Deve permanecer 0.
- `SELECT COUNT(*) FROM pg_proc WHERE proname = 'process_webhook_subscription';` (Deve confirmar que a função não foi alterada).

---
**Próximo Passo:** Aguardar revisão do Plano do Bloco C.
