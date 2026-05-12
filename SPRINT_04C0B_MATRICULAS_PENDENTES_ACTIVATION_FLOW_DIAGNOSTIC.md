# SPRINT_04C0B_MATRICULAS_PENDENTES_ACTIVATION_FLOW_DIAGNOSTIC.md

**Status:** Diagnóstico Concluído (Somente Leitura)
**Data:** 2026-05-12
**Objetivo:** Mapear o fluxo de ativação de compras represadas em `matriculas_pendentes` e identificar riscos de mapeamento de IDs.

## 1. Onde matriculas_pendentes é lida

O fluxo de consumo é automatizado via gatilho de banco de dados (Trigger):

1.  **Entrada:** `rockty-webhook` (Edge Function) insere em `matriculas_pendentes` quando o email não possui conta no Supabase Auth.
2.  **Gatilho:** `on_auth_user_created_apply_matricula` (Trigger na tabela `auth.users`).
3.  **Processamento:** Função `public.apply_pending_matricula()`.
4.  **Consumo:** Executada imediatamente após o usuário criar sua conta (Sign Up).

## 2. Campos usados para liberar acesso

A função `apply_pending_matricula` utiliza os seguintes campos:

-   **email:** Para localizar a pendência (Chave de busca).
-   **curso_id:** Gravado na tabela `matriculas` (Controle de acesso a cursos específicos).
-   **portal_destino:** Atualiza o campo `portal` na tabela `user_roles`.
-   **id (matriculas_pendentes):** Para marcar o registro como `processado = true`.

## 3. Mapeamento de IDs: curso_id vs plan_id

Atualmente, o `rockty-webhook` grava o **Rockty offer_id** no campo `curso_id`.

-   **Situação Atual:** No teste T01, gravou `karv9y4bewbdjcwbmvtwq` em `curso_id`.
-   **Impacto:** Se a usuária criar conta agora, a tabela `public.matriculas` terá um registro onde `curso_id = 'karv9y4bewbdjcwbmvtwq'`.

## 4. Conversão de IDs (Rockty → Interno)

**Não existe conversão automática no fluxo de ativação atual.**

A função `apply_pending_matricula` faz um `INSERT` direto do valor contido em `curso_id`. Se o valor for um ID da Rockty, ele será persistido como tal. 

Para que o sistema reconheça o acesso ao "Clube Oracular" ou "Formação", o front-end ou as políticas de RLS precisam estar preparados para ler esse ID específico da Rockty ou o sistema deve realizar a conversão antes da gravação.

## 5. O que acontece quando a usuária cria conta

Passo a passo executado pela Trigger:

1.  **Busca:** Procura o registro mais recente não processado para o email.
2.  **Matrícula:** Insere em `public.matriculas` (ID usuário + ID do curso/plano).
3.  **Role/Portal:** Atualiza `user_roles.portal` para o valor de `portal_destino` (ex: `assinante`).
4.  **Baixa:** Marca a pendência como `processado = true`.
5.  **Lacuna:** O `profile` **não** recebe o status de assinatura via este fluxo (apenas via webhook direto para usuários existentes). A tabela `subscriptions` também **não** é populada retroativamente por esta Trigger.

## 6. Riscos Identificados

-   **[ ALTO ] Inconsistência de IDs:** A tabela `subscriptions` usa `plan_id` interno (ex: `clube_mensal`), enquanto `matriculas` receberá o `offer_id` da Rockty. Isso gera duas fontes de verdade com linguagens diferentes.
-   **[ MÉDIO ] Perfil Incompleto:** Usuárias ativadas via pendência terão `user_roles` correto, mas `profiles.subscription_status` pode permanecer como `none` até o próximo evento da Rockty (renovação).
-   **[ BAIXO ] Subscriptions Vazia:** A tabela `subscriptions` não terá o registro inicial da compra se ela foi processada via `matriculas_pendentes`.

## 7. Recomendações

1.  **Padronização de IDs:** O `rockty-webhook` deve converter o `offer_id` para o `plan_id` interno antes de gravar em `matriculas_pendentes`.
2.  **Extensão da Trigger:** Atualizar `apply_pending_matricula` para também inserir na tabela `subscriptions`, garantindo paridade entre os fluxos (Webhook Direto vs Pendência).
3.  **Auditoria de Campo:** Confirmar se o portal e o front-end utilizam `matriculas.curso_id` ou `subscriptions.plan_id` para liberar as páginas.

---
**Garantia de Sigilo:** As assinaturas HMAC nos próximos relatórios serão truncadas ou omitidas conforme solicitado.
