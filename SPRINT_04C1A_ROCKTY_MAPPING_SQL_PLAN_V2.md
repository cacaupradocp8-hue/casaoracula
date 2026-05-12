# SPRINT_04C1A_ROCKTY_MAPPING_SQL_PLAN_V2.md

**Status:** Planejamento Técnico Revisado (Aguardando Revisão Final)
**Data:** 2026-05-12
**Versão:** 2.0

## 1. Diagnóstico de Estrutura e Tipos

### Enum `portal_type`
Consulta realizada confirmou os seguintes valores disponíveis:
*   `visitante`, `mentorada`, `aluna_formacao`, `assinante`, `oracula`, `pre_iniciada`, `iniciada`, `admin`, `aluna`.

### Tabela `plans`
*   **IDs atuais:** `visitante`, `fundadora`, `mentoria`, `assinatura`.
*   **Ação:** Criaremos os novos IDs semânticos para garantir a transição estratégica.

## 2. Ordem de Execução da Migration (UP)

A implementação seguirá rigorosamente esta ordem para garantir a integridade referencial:

1.  **Garantir Novos Planos:** Inserir em `public.plans` os IDs: `clube_mensal`, `clube_anual`, `formacao_oracula` (se não existirem).
2.  **Infraestrutura de Mapeamento:** Criar a tabela `public.rockty_offer_mapping` com FK para `plans.id`.
3.  **Popular Mapeamentos:** Inserir os De/Para oficiais (Clube Mensal, Anual, Formação).
4.  **Evolução de Dados:** Adicionar colunas `rockty_offer_id` e `plan_id` em `matriculas_pendentes` para auditoria fina.
5.  **Lógica de Ativação:** Atualizar a função `public.apply_pending_matricula()` e a Trigger associada.

## 3. Matriz de Mapeamento Oficial

| Rockty Offer ID | Plan ID Interno | Portal Destino | Duração (Dias) | Ativo |
| :--- | :--- | :--- | :--- | :--- |
| `karv9y4bewbdjcwbmvtwq` | `clube_mensal` | `assinante` | 30 | true |
| `mayikrzz0kc58ijeqs9a` | `clube_mensal` | `assinante` | 30 | true |
| `2tgmh6vsiki7fg0buxdfxq` | `clube_anual` | `assinante` | 365 | true |
| `qqqmfhyjku7ou9kc70gg` | `formacao_oracula` | `aluna` | 365 | true |
| `TEST_UNKNOWN_OFFER` | `unknown` | `visitante` | NULL | **false** |

*Nota: `TEST_UNKNOWN_OFFER` será inserido com `ativo = false` e `is_test = true`, garantindo que caia no fluxo de revisão manual.*

## 4. Estratégia de `subscriptions` e Idempotência

Para evitar duplicidade, a inserção em `subscriptions` utilizará:
*   **Chave Única:** `(user_id, provider)`.
*   **Lógica:** `ON CONFLICT (user_id, provider) DO UPDATE`.
*   **Campos:** Atualizará `plan_id`, `status`, `current_period_end` e `last_event_at`.

## 5. Lógica da Função `apply_pending_matricula` (Refinada)

1.  **Busca de Mapeamento:** Tenta localizar um registro em `rockty_offer_mapping` onde `rockty_offer_id = pending.curso_id` AND `ativo = true`.
2.  **Sucesso (Mapeamento Encontrado):**
    *   Insere em `matriculas` (`user_id`, `curso_id = mapping.internal_plan_id`).
    *   Atualiza `user_roles.portal = mapping.portal_destino`.
    *   Upsert em `subscriptions` (Status 'active', Provedor 'rockty').
    *   Marca `matriculas_pendentes.processado = true`.
3.  **Falha (Não Mapeado ou Inativo):**
    *   **NÃO** libera acesso.
    *   Registra no campo `webhook_logs` o motivo da falha.
    *   Mantém `processado = false` para que o suporte possa revisar manualmente.

## 6. Tratamento de Registros de Teste (Dry-Run)

*   **T01 (`karv9y...`):** Após a migration, se a usuária correspondente criar conta, o sistema encontrará o mapeamento para `clube_mensal` e ativará corretamente.
*   **T04 (`TEST_UNKNOWN_OFFER`):** Permanecerá pendente. Mesmo com o registro na tabela de mapeamento, o flag `ativo = false` impedirá a liberação automática.
*   **T05 (Compradora Sem Conta):** Continuará gerando pendências. O fluxo só será testado na fase de "Criação de Conta" (Signup).

## 7. Migration DOWN (Reversão Segura)

1.  Restaurar a versão anterior da função `apply_pending_matricula`.
2.  Desativar (mas não apagar imediatamente) a tabela `rockty_offer_mapping` para análise de dados se necessário.
3.  Manter os novos IDs em `plans` para evitar quebras em registros de usuários reais que possam ter sido criados durante a janela de migração.

## 8. Riscos Identificados

*   **Concorrência:** Se dois processos tentarem ativar o mesmo usuário simultaneamente. *Mitigação: Locks de linha do Postgres via `FOR UPDATE`.*
*   **Tipagem Portal:** Valor inválido no mapeamento. *Mitigação: Constraints de check no banco contra o enum `portal_type`.*

---
**Próximo Passo:** Após aprovação deste V2, gerarei o código SQL integral pronto para revisão.
