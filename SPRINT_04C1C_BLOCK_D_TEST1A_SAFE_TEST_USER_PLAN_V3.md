# PLANO: SPRINT_04C1C_BLOCK_D_TEST1A_SAFE_TEST_USER_PLAN_V3

Este plano descreve a criação de um usuário de teste de forma segura e controlada para validar o fluxo de acesso Rockty, atendendo aos requisitos de não utilizar SQL direto no schema `auth`.

## 1. Método de Criação (Seguro e Controlado)
- **Ferramenta:** Script de automação (Bun) utilizando o cliente Supabase com privilégios administrativos (`auth.admin.createUser`).
- **Trigger `handle_new_user`:** O fluxo via API Admin dispara as triggers nativas do banco de dados, garantindo que o comportamento seja idêntico ao de um cadastro real.
- **Criação de `profiles` e `user_roles`:** Será verificado se a trigger automática criou os registros. Caso contrário, serão criados via API `public` de forma controlada.
- **Confirmação de E-mail:** O usuário será criado com a flag `email_confirm: true`, eliminando o envio de e-mails reais de verificação.
- **Segurança:** Uso exclusivo do domínio `@oracula.test` para evitar qualquer conflito com usuários reais ou serviços de entrega de e-mail.

## 2. Dados do Usuário de Teste
- **E-mail:** `test_d1_clube_mensal@oracula.test`
- **Nome:** Teste Clube Mensal D1
- **Portal Inicial Esperado (Profile):** `visitante`
- **Portal Inicial Esperado (User Roles):** `visitante`

## 3. Validações Pré-Execução (Pre-flight)
Executar via consultas seguras (`SELECT`) antes de qualquer alteração:
- [ ] `auth.users`: Confirmar que o e-mail não existe.
- [ ] `public.profiles`: Confirmar que não existe perfil vinculado.
- [ ] `public.user_roles`: Confirmar que não há permissões vinculadas ao e-mail/ID.
- [ ] `public.matriculas_pendentes`: Confirmar que não há processamentos pendentes para este e-mail.
- [ ] `public.subscriptions`: Confirmar que `external_subscription_id = 'TEST_EXT_CLUBE_MENSAL_D1'` não existe.

## 4. Validações Pós-Execução (Post-flight)
- [ ] **Auth User:** Confirmar criação via API.
- [ ] **Profile:** Validar existência e campo `portal = 'visitante'`.
- [ ] **User Role:** Validar existência e campo `portal = 'visitante'`.
- [ ] **Integridade:** Garantir que **nenhuma** `subscription` ou `matricula` foi gerada neste estágio.
- [ ] **Logs:** Verificar se nenhuma pendência de matrícula foi processada por engano.

## 5. Plano de Limpeza Futura (Rollback)
*A ser executado apenas após autorização futura e conclusão dos testes D.TEST.*
- Remover `subscriptions` de teste (se geradas no passo D.TEST-1).
- Remover registros em `user_roles`.
- Remover registro em `profiles`.
- Remover o usuário de `auth.users` via `auth.admin.deleteUser`.

## 6. Gestão de Riscos
- **Usuário sem profile:** O script validará a criação imediata após o disparo da trigger.
- **Trigger não disparar:** Se a trigger falhar, o plano prevê interrupção e reporte do erro antes de prosseguir para testes de acesso.
- **Processamento por engano:** O status de `visitante` e a validação prévia de `matriculas_pendentes` garantem que o usuário comece em estado neutro.
- **Conflito de E-mail:** O domínio reservado `.test` impede qualquer interação com servidores de e-mail externos.

---
**Status:** Aguardando Aprovação para Versão V3.
**Regra:** Não executar comandos de criação até aprovação explícita desta versão do plano.
