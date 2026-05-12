# SPRINT_04C1A_ROCKTY_MAPPING_SQL_PLAN_V3.md

**Status:** Planejamento Técnico Final (Aguardando Aprovação Final)
**Data:** 2026-05-12
**Versão:** 3.0

## 1. Diagnóstico de Estrutura (Estado Atual)

### 1.1 Tabela `plans`
*   **IDs Existentes:** `visitante`, `fundadora`, `mentoria`, `assinatura`.
*   **IDs Ausentes:** `clube_mensal`, `clube_anual`, `formacao_oracula`.
*   **Decisão:** A migration deve criar os IDs ausentes antes de qualquer outra operação para garantir integridade referencial (FK).

### 1.2 Gating e Sincronia (`profiles` vs `user_roles`)
*   **Profiles:** Possui coluna `portal` (text).
*   **User_roles:** Possui coluna `portal` (enum).
*   **Gating (Fonte de Verdade):** Confirmado via `AuthContext.tsx`. O app consulta `user_roles.portal` para definir o nível de acesso da usuária.
*   **Decisão BOLD:** A trigger deve atualizar **ambas** as tabelas (`user_roles` e `profiles`) para manter sincronia total, mas o controle de acesso continuará priorizando `user_roles`.

## 2. Nova Tabela `rockty_offer_mapping`

Estrutura proposta para centralizar a conversão de ofertas externas em planos internos:

```sql
CREATE TABLE public.rockty_offer_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rockty_offer_id TEXT UNIQUE NOT NULL, -- O 'id' da oferta que vem no webhook
    internal_plan_id TEXT NOT NULL REFERENCES public.plans(id),
    target_portal TEXT NOT NULL, -- O portal_type destino (ex: 'assinante', 'oracula')
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 3. Auditoria Fina em `matriculas_pendentes`

Novas colunas para rastreabilidade total do processamento:

*   `rockty_offer_id` (TEXT): ID original recebido.
*   `plan_id` (TEXT): ID do plano interno resolvido via mapeamento.
*   `processing_status` (TEXT): `pending`, `processed`, `unmapped`, `error`.
*   `processing_error` (TEXT): Descrição do erro se houver.
*   `last_attempt_at` (TIMESTAMP): Data da última tentativa de processamento.

## 4. Estratégia Segura para Subscriptions

Para evitar que uma assinatura nova (ex: Formação) sobrescreva uma assinatura ativa de outro produto (ex: Clube), a idempotência será reforçada.

*   **Nova Chave Única:** `UNIQUE (provider, external_subscription_id)`.
*   **Fallback de Idempotência:** `UNIQUE (user_id, provider, plan_id)`.
*   **Regra de Negócio:** Se o `external_subscription_id` já existir, apenas atualizamos o status. Se for novo para o mesmo `user_id` e `plan_id`, atualizamos o existente ou criamos novo conforme política de upgrade.

## 5. Lógica da Trigger `apply_pending_matricula` (V3)

A trigger será reescrita com um bloco `BEGIN ... EXCEPTION` para garantir que falhas no processamento da matrícula **não travem o cadastro da usuária**.

1.  **Busca Mapeamento:** Tenta encontrar `internal_plan_id` e `target_portal` na tabela `rockty_offer_mapping`.
2.  **Proteção contra Unknown:**
    *   Se NÃO encontrar mapeamento:
        *   Marca `processing_status = 'unmapped'`.
        *   Registra `processing_error = 'Oferta não mapeada'`.
        *   **Não** libera portal.
        *   **Não** cria subscription.
        *   Finaliza com sucesso (perfil de visitante criado).
3.  **Processamento com Sucesso:**
    *   Insere/Atualiza `subscriptions`.
    *   Insere `matriculas` vinculadas ao `plan_id`.
    *   Atualiza `user_roles.portal` E `profiles.portal`.
    *   Marca `processing_status = 'processed'` e `processed = true`.

## 6. Tratamento de Registros TEST_

Os registros `TEST_01`, `TEST_04`, `TEST_05` gerados anteriormente:
*   **Não serão processados automaticamente.**
*   A migration de UP não disparará reprocessamento retroativo.
*   No Dry-Run, eles aparecerão como `unmapped` por design (pois o offer_id `TEST_UNKNOWN_OFFER` não será inserido no mapeamento).

## 7. Migration UP (Conceitual)

1.  **Backup:** Snapshot das tabelas `plans`, `user_roles`, `profiles`, `subscriptions`.
2.  **Planos Novos:** Inserir `clube_mensal`, `clube_anual`, `formacao_oracula` em `plans`.
3.  **Mapeamento:** Criar `rockty_offer_mapping` e inserir as 4 ofertas reais (sem TEST_).
4.  **Alterar `matriculas_pendentes`:** Adicionar colunas de auditoria.
5.  **Alterar `subscriptions`:** Atualizar constraints de unicidade.
6.  **Nova Função de Trigger:** Substituir a lógica antiga pela nova lógica BOLD V3.

## 8. Migration DOWN (Conceitual)

1.  **Desabilitar Mapeamento:** Renomear `rockty_offer_mapping` para `rockty_offer_mapping_disabled`.
2.  **Reverter Trigger:** Restaurar a função de trigger anterior (baseada em `curso_id`).
3.  **Preservar Dados:** Manter as novas colunas em `matriculas_pendentes` (vazias ou nulas) para não perder histórico de auditoria.

## 9. Dry-Run Planejado

Executar queries de validação antes da aplicação final:
*   Validar se todos os `rockty_offer_id` das pendências atuais possuem correspondente no novo mapeamento (exceto `TEST_`).
*   Verificar se existem usuários com `external_subscription_id` duplicado que possam causar conflito no novo `UNIQUE`.

## 10. Riscos Identificados

*   **Inconsistência Temporária:** Usuárias criadas exatamente durante a execução da migration podem cair no fluxo antigo ou novo. *Mitigação: Janela curta e execução em transação única.*
*   **Trigger Travando Sign Up:** Erros inesperados na lógica de matrícula. *Mitigação: Bloco EXCEPTION capturando erros e logando em processing_error.*

## 11. Critérios de Aprovação

1.  O SQL final deve ser gerado separadamente após aprovação deste plano.
2.  Nenhuma matrícula deve ser liberada para `TEST_UNKNOWN_OFFER`.
3.  A sincronia entre `profiles.portal` e `user_roles.portal` deve ser verificada pós-migração.
