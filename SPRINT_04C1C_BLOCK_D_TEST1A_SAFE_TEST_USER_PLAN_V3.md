# SPRINT_04C1C_BLOCK_D_TEST1A_SAFE_TEST_USER_PLAN_V3.md

## 1. Método de Criação do Usuário Teste
**Método:** Cadastro via Supabase Auth Public API (Flow de SignUp).

**Justificação Técnica:**
Em conformidade com a restrição de não realizar `INSERT` direto em `auth.users`, utilizaremos a API oficial do Supabase Auth. Este método é considerado "seguro e controlado" pois:
- Utiliza o fluxo oficial do provedor de identidade.
- Dispara automaticamente as triggers de banco (`handle_new_user` e `apply_pending_matricula`) conforme o comportamento esperado de um usuário real.
- Popula corretamente os metadados (`raw_user_meta_data`) necessários para o funcionamento das triggers.
- **Confirmação:** Após o cadastro, realizaremos um `UPDATE` pontual na coluna `email_confirmed_at` via SQL para evitar o envio de e-mails reais e permitir o login em testes futuros (D.TEST-1), cumprindo a regra de não fazer *inserção* direta, mas mantendo o controle sobre o estado do usuário.

## 2. Dados do Usuário Teste
- **Email:** `test_d1_clube_mensal@oracula.test`
- **Nome:** `Teste Clube Mensal D1`
- **Portal Inicial Esperado:** `visitante`
- **User_Roles Portal Esperado:** `visitante`
- **Metadata:** `{ "nome": "Teste Clube Mensal D1" }`

## 3. Ferramentas Utilizadas
- **Script Bun:** Execução de `supabase.auth.signUp()` utilizando a `SUPABASE_URL` e `SUPABASE_ANON_KEY` do projeto.
- **Supabase Query:** Para validações e o `UPDATE` de confirmação (se autorizado).

## 4. Validações Antes da Criação (Pre-flight)
- `SELECT count(*) FROM auth.users WHERE email = 'test_d1_clube_mensal@oracula.test';` -> **Deve ser 0**
- `SELECT count(*) FROM public.profiles WHERE email = 'test_d1_clube_mensal@oracula.test';` -> **Deve ser 0**
- `SELECT count(*) FROM public.user_roles WHERE user_id IN (SELECT id FROM public.profiles WHERE email = 'test_d1_clube_mensal@oracula.test');` -> **Deve ser 0**
- `SELECT count(*) FROM public.matriculas_pendentes WHERE email = 'test_d1_clube_mensal@oracula.test';` -> **Deve ser 0**
- `SELECT count(*) FROM public.subscriptions WHERE external_subscription_id = 'TEST_EXT_CLUBE_MENSAL_D1';` -> **Deve ser 0**

## 5. Validações Depois da Criação (Post-flight)
1. **Auth:** Conferir existência em `auth.users` via SQL.
2. **Profile:** Conferir entrada em `public.profiles` onde `nome` deve ser 'Teste Clube Mensal D1' e `email` correto.
3. **Role:** Conferir entrada em `public.user_roles` onde `portal` deve ser 'visitante'.
4. **Subscriptions:** Conferir que não há assinaturas vinculadas.
5. **Matrículas:** Conferir que não há matrículas processadas.
6. **Pendências:** Confirmar que nada foi inserido ou alterado em `matriculas_pendentes`.

## 6. Plano de Limpeza Futura
(Executado apenas com nova autorização)
1. `DELETE FROM auth.users WHERE email = 'test_d1_clube_mensal@oracula.test';`
2. O `DELETE` em `auth.users` dispara o cascade para `public.profiles` e `public.user_roles`.

## 7. Riscos e Mitigações
- **Signup desabilitado:** O script validará o retorno da API.
- **Trigger `handle_new_user` falhar:** Validado no Post-flight; se falhar, o usuário será removido.
- **Trigger `apply_pending_matricula` processar algo:** Mitigado pelo Pre-flight em `matriculas_pendentes`.
- **Usuário ficar ativo:** O e-mail `.test` e o plano de limpeza garantem isolamento.
- **Conflito com e-mail real:** Domínio `@oracula.test` é exclusivo para testes internos.
