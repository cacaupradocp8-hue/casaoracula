# SPRINT_04C1_PENDING_MATRICULAS_MAPPING_FIX_PLAN.md

**Status:** Planejamento (Aguardando Aprovação)
**Data:** 2026-05-12
**Versão:** 1.0

## 1. Diagnóstico Atual

*   **Tabela `matriculas_pendentes`**: Possui os campos `curso_id` (Text) e `portal_destino` (Enum). Atualmente, o Webhook grava o `offer_id` da Rockty no campo `curso_id`.
*   **Tabela `matriculas`**: Possui `curso_id` (Text). É a tabela que o sistema consulta para liberar acesso a conteúdos específicos.
*   **Trigger `on_auth_user_created_apply_matricula`**: Dispara após o cadastro no Auth e chama a função `apply_pending_matricula`.
*   **Função `apply_pending_matricula`**: Faz um `INSERT` simples: `VALUES (NEW.id, pending.curso_id, ...)`.
*   **Subscriptions**: Atualmente este fluxo de pendências **não** popula a tabela `subscriptions`, criando uma lacuna de auditoria (usuária tem acesso mas não tem registro de assinatura ativa).

## 2. Problema Atual

1.  **Inconsistência Semântica**: O campo `curso_id` na tabela `matriculas` deveria conter o ID interno (ex: `clube_mensal`), mas está recebendo o ID técnico da Rockty (ex: `karv9y...`).
2.  **Quebra de Auditoria**: O sistema de "Área de Membros" pode não reconhecer o `offer_id` como um plano válido se ele esperar os IDs amigáveis.
3.  **Incompletude**: A ausência de registro na tabela `subscriptions` impede o controle de vigência (data de expiração) e status financeiro unificado.

## 3. Matriz Oficial de Conversão

| Rockty Offer ID | Plan ID Interno | Portal Destino | Produto / Área |
| :--- | :--- | :--- | :--- |
| `karv9y4bewbdjcwbmvtwq` | `clube_mensal` | `assinante` | Clube Oracular |
| `mayikrzz0kc58ijeqs9a` | `clube_mensal` | `assinante` | Clube Oracular (Legado) |
| `2tgmh6vsiki7fg0buxdfxq` | `clube_anual` | `assinante` | Clube Oracular Anual |
| `qqqmfhyjku7ou9kc70gg` | `formacao_oracula` | `aluna` | Formação Orácula |
| `TEST_UNKNOWN_OFFER` | `unknown` | `visitante` | Revisão Manual Requerida |

## 4. Opções de Correção

### Opção A: Ajuste no Webhook e Campo Extra
*   Adicionar `rockty_offer_id` em `matriculas_pendentes`.
*   O Webhook faz o De/Para antes de gravar.
*   **Prós**: Simples de implementar no código TypeScript.
*   **Contras**: Regras de negócio ficam "espalhadas" no código da Edge Function.

### Opção B: Conversão na Trigger (Hardcoded)
*   Alterar a função PL/pgSQL para converter via `CASE WHEN`.
*   **Prós**: Garante a integridade direto no banco.
*   **Contras**: Difícil manutenção; cada oferta nova exige alteração de código SQL.

### Opção C: Tabela de Mapeamento (Recomendada)
*   Criar `public.rockty_offer_mapping`.
*   Webhook e Trigger consultam esta tabela.
*   **Segurança**: Máxima (Centraliza a verdade).
*   **Reversibilidade**: Total (Basta alterar a tabela).
*   **Impacto**: Estrutural, mas limpo.
*   **Esforço**: Moderado (Criação de tabela + Ajuste de Função).

## 5. Recomendação Técnica: Opção C

**Por que?** É a única que resolve o problema de forma definitiva e escalável. Permite que o Admin altere mapeamentos sem tocar em código. Além disso, permite que a Trigger `apply_pending_matricula` seja inteligente o suficiente para criar tanto a `matricula` quanto a `subscription` de uma só vez, usando dados da tabela de mapeamento.

## 6. Plano de Implementação Futuro (Sprint 04C1)

1.  **Backup**: Snapshot dos 5 perfis e tabelas afetadas.
2.  **Migration UP**:
    *   Criar `rockty_offer_mapping`.
    *   Popular a tabela com a Matriz Oficial.
    *   Atualizar `apply_pending_matricula` para:
        1. Buscar o mapeamento pelo `offer_id`.
        2. Se não achar, marcar para revisão.
        3. Se achar, inserir em `matriculas` (usando `plan_id`) e em `subscriptions`.
3.  **Ajuste Webhook**: Alterar `rockty-webhook` para gravar o `offer_id` no campo correto de pendência.
4.  **Teste de Rollback**: Validar retorno ao estado anterior.
5.  **Teste Dry-Run**: Usar IDs `TEST_` para validar o fluxo fim-a-fim.

## 7. Regras de Execução

*   **NÃO** executar agora. Este é apenas o plano.
*   **NÃO** autorizados T02 e T03 até a correção da arquitetura de mapeamento.
*   Os 5 registros de teste criados anteriormente (`TEST_`) servirão de base para a futura limpeza ou reprocessamento pós-correção.

## 8. Critérios de Validação

*   [ ] `matriculas_pendentes` registra o `offer_id` original mas identifica o `plan_id` alvo.
*   [ ] Ao criar conta, a usuária ganha registro em `matriculas` E `subscriptions` com o ID interno correto.
*   [ ] O portal destino (aluna/assinante) é aplicado conforme a tabela de mapeamento.
*   [ ] Compras de ofertas não mapeadas caem em estado "pendente de revisão" sem liberar acesso.
