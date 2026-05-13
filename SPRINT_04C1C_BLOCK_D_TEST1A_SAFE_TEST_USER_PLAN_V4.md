# PLANO: SPRINT_04C1C_BLOCK_D_TEST1A_SAFE_TEST_USER_PLAN_V4

Este plano descreve a criação de um usuário de teste de forma estritamente controlada via API administrativa para validar o comportamento automático do sistema (triggers), sem intervenções manuais em tabelas de perfil ou permissões.

## 1. Objetivo
Validar se a infraestrutura base (auth, triggers e permissões default) está funcionando corretamente para um novo usuário antes de iniciar os testes de integração Rockty (D.TEST-1).

## 2. Método de Execução (Strict Admin)
- **Ferramenta:** Script de automação (Bun) utilizando a `service_role` via cliente Supabase Admin.
- **Ação:** Chamada exclusiva a `auth.admin.createUser`.
- **Restrição:** Proibida a criação manual de registros em `profiles` ou `user_roles`. O sucesso depende da execução automática da trigger `handle_new_user`.

## 3. Dados do Usuário de Teste
- **Email:** `test_d1_clube_mensal@oracula.test`
- **Nome:** `Teste Clube Mensal D1`
- **Configuração:** `email_confirm: true`.
- **Expectativa:** Portal inicial `visitante`.

## 4. Verificações Pré-Voo (Pre-flight)
O script deve validar a ausência de resíduos antes de tentar criar o usuário:
1. Confirmar que o e-mail não existe em `auth.users`.
2. Confirmar que o e-mail não existe em `public.profiles`.
3. Confirmar que o e-mail não existe em `public.matriculas_pendentes`.
4. Confirmar que o ID externo `TEST_EXT_CLUBE_MENSAL_D1` não existe em `public.subscriptions`.

## 5. Fluxo de Execução
1. Executar `auth.admin.createUser` com os metadados de nome.
2. **Pausa técnica:** Aguardar 2 segundos para propagação das triggers do banco de dados.
3. Consultar as tabelas `profiles` e `user_roles` filtrando pelo ID do novo usuário.

## 6. Verificações Pós-Voo (Post-flight) - CRÍTICO
O sucesso do plano exige que todos os itens abaixo sejam verdadeiros:
1. **Identidade:** Usuário presente em `auth.users`.
2. **Perfil Automático:** Registro em `public.profiles` existe (criado via trigger).
3. **Permissão Automática:** Registro em `public.user_roles` existe (criado via trigger).
4. **Estado Neutro:** `profile.portal` e `user_roles.portal` devem ser exatamente `visitante`.
5. **Isolamento:** Nenhuma assinatura ou matrícula deve ter sido gerada para este UUID.

## 7. Tratamento de Falhas (Fail-Fast)
Se o perfil ou a role não forem encontrados:
- **PARAR IMEDIATAMENTE.**
- Reportar o erro de falha na trigger.
- **Não** criar perfis ou roles manualmente.
- **Não** prosseguir para o teste D.TEST-1.

## 8. Plano de Limpeza (Futuro/Pendente de Autorização)
Procedimento a ser executado apenas após sinalização:
1. Remover `public.user_roles` do usuário de teste.
2. Remover `public.profiles` do usuário de teste.
3. Remover qualquer assinatura de teste vinculada.
4. Remover o usuário de `auth.users` via `auth.admin.deleteUser`.

---
**Regras de Segurança:**
- Sem SQL direto em `auth.users`.
- Sem alterações em Webhooks ou Edge Functions.
- Sem remoção de constraints de unicidade.
- Sem publicação em produção.
