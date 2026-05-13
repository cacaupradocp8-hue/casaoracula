# SPRINT_04C1C_BLOCK_D_TEST1A_SAFE_TEST_USER_PLAN_V2.md

## 1. Método de Criação do Usuário Teste
**Método:** Inserção via SQL direto no schema `auth.users`.

**Justificação Técnica:**
O uso de SQL direto no `auth.users` é a abordagem mais segura e controlada para este cenário de teste no Lovable Cloud/Supabase por permitir:
- Definição de um `user_id` (UUID) estático e previsível, facilitando rastreamento e limpeza.
- Ativação imediata da conta (`email_confirmed_at`) sem necessidade de disparar e-mails reais de confirmação.
- Bypassing de restrições de signup de front-end, mantendo a integridade das triggers de backend.
- Garantia de que todos os metadados necessários (`raw_user_meta_data`) sejam inseridos exatamente como as triggers esperam.

## 2. Dados do Usuário Teste
- **Email:** `test_d1_clube_mensal@oracula.test`
- **Nome:** `Teste Clube Mensal D1`
- **User_ID Proposto:** `d1d1d1d1-d1d1-4d1d-ad1d-d1d1d1d1d1d1`
- **Portal Inicial Esperado:** `visitante`
- **User_Roles Portal Esperado:** `visitante`
- **Senha:** (Será definida via hash seguro `argon2` ou `bcrypt` compatível com Supabase Auth)

## 3. Triggers Envolvidas
- **`handle_new_user` (Trigger `on_auth_user_created`):** 
    - **Será disparada:** Sim, após a inserção no `auth.users`.
    - **Ação:** Criará automaticamente a entrada correspondente em `public.profiles` (com nome e email) e em `public.user_roles` (com portal 'visitante').
- **`apply_pending_matricula` (Trigger `on_auth_user_created_apply_matricula`):**
    - **Será disparada:** Sim.
    - **Comportamento esperado:** Não deve processar nada. A função busca em `matriculas_pendentes` por um registro não processado com o e-mail exato. Como as validações prévias confirmam a ausência deste e-mail na tabela de pendências, o bloco `IF FOUND` não será executado.

## 4. Validações Antes da Criação (Pre-flight)
Serão executadas as seguintes queries para garantir ambiente limpo:
1. `SELECT count(*) FROM auth.users WHERE email = 'test_d1_clube_mensal@oracula.test';` -> **Deve ser 0**
2. `SELECT count(*) FROM public.profiles WHERE email = 'test_d1_clube_mensal@oracula.test';` -> **Deve ser 0**
3. `SELECT count(*) FROM public.user_roles WHERE user_id = 'd1d1d1d1-d1d1-4d1d-ad1d-d1d1d1d1d1d1';` -> **Deve ser 0**
4. `SELECT count(*) FROM public.matriculas_pendentes WHERE email = 'test_d1_clube_mensal@oracula.test';` -> **Deve ser 0**

## 5. Validações Depois da Criação (Post-flight)
1. **Auth:** Conferir existência em `auth.users` com `id` e `email` corretos.
2. **Profile:** Conferir entrada em `public.profiles` com `portal = 'visitante'` (via campo calculado ou meta).
3. **Role:** Conferir entrada em `public.user_roles` onde `portal` deve ser obrigatoriamente `visitante`.
4. **Subscriptions:** Conferir que `public.subscriptions` não possui nenhum registro para este `user_id`.
5. **Matriculas:** Conferir que `public.matriculas` não possui novos registros para este `user_id`.
6. **Pendências:** Confirmar que `public.matriculas_pendentes` continua com 0 registros para este e-mail.

## 6. Plano de Limpeza Futura
Para remover o usuário de teste sem deixar rastros:
1. `DELETE FROM auth.users WHERE id = 'd1d1d1d1-d1d1-4d1d-ad1d-d1d1d1d1d1d1';`
2. Devido à constraint `ON DELETE CASCADE`, as entradas em `public.profiles` e `public.user_roles` serão removidas automaticamente.
3. (Opcional) Limpeza de logs de auditoria se necessário.

## 7. Riscos e Mitigações
- **Criação sem Profile/Role:** Mitigado pela dependência das triggers de banco que são transacionais.
- **Trigger `apply_pending_matricula` processar algo:** Mitigado pela validação prévia (`Pre-flight`) da tabela de pendências.
- **Usuário ficar ativo:** O e-mail `.test` garante que e-mails reais não sejam enviados e o plano de limpeza garante a remoção pós-testes.
- **Conflito com e-mail real:** O domínio `@oracula.test` é reservado e não colidirá com usuários reais da base `@oracula.com.br` ou outros.
- **Segurança:** O usuário será criado com uma senha complexa e permissões mínimas (`visitante`).
