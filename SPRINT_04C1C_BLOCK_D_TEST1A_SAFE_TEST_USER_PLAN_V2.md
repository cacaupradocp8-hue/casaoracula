# SPRINT_04C1C_BLOCK_D_TEST1A_SAFE_TEST_USER_PLAN_V2

## 1. Estratégia Recomendada de Criação
Para garantir a integridade total do ecossistema Lovable Cloud/Supabase, a estratégia recomendada é a **Criação via Painel de Autenticação do Supabase (Auth Admin)** ou via **Fluxo de Signup do App com Confirmação Automática**, em vez de `INSERT` direto em `auth.users`.

### Por que este método é seguro?
- **Triggers Ativos:** Garante o disparo do trigger `on_auth_user_created` (se existente), que é responsável por orquestrar a criação automática em `profiles` e `user_roles`.
- **Integridade de Schema:** Evita erros de hash de senha ou metadados de sistema que um `INSERT` manual poderia causar.
- **Isolamento:** Usa o domínio `.test`, garantindo que nenhum e-mail real seja enviado.

### Fluxo esperado:
1. Criação do usuário em `auth.users`.
2. Disparo automático de `handle_new_user` (trigger).
3. Criação automática do registro em `public.profiles` (portal: visitante).
4. Criação automática do registro em `public.user_roles` (role: visitante).

## 2. Dados do Usuário de Teste
- **E-mail:** `test_d1_clube_mensal@oracula.test`
- **Senha:** `Teste@D1_2026` (provisória para criação)
- **Nome:** `Teste Clube Mensal D1`
- **Portal Inicial:** `visitante`
- **User Role Inicial:** `visitante`

## 3. Validações Antes do Teste (D.TEST-1)
Antes de chamar a função RPC, devemos confirmar via `SELECT`:
1. **Auth:** O `id` (UUID) foi gerado em `auth.users`.
2. **Profile:** Existe registro em `public.profiles` com o `id` acima e `portal = 'visitante'`.
3. **Role:** Existe registro em `public.user_roles` com o `id` acima e `role = 'visitante'`.
4. **Subscription:** `SELECT count(*) FROM public.subscriptions WHERE user_id = <UUID>` deve ser **0**.
5. **ID Externo:** `SELECT count(*) FROM public.subscriptions WHERE external_subscription_id = 'TEST_EXT_CLUBE_MENSAL_D1'` deve ser **0**.

## 4. Plano de Limpeza Futura (Pós-Validação)
Quando autorizado, a limpeza seguirá a ordem reversa de dependência:
1. `DELETE FROM public.subscriptions WHERE user_id = <UUID>;`
2. `DELETE FROM public.user_roles WHERE user_id = <UUID>;`
3. `DELETE FROM public.profiles WHERE id = <UUID>;`
4. `DELETE FROM auth.users WHERE id = <UUID>;` (via Auth Admin ou RPC seguro).

## 5. Riscos e Mitigações
| Risco | Mitigação |
| :--- | :--- |
| **Inconsistência de Profile:** O trigger não disparar. | **Ação:** Validar existência de Profile/Role ANTES do RPC. |
| **E-mail Real:** Enviar e-mail para domínio de produção. | **Ação:** Usar estritamente o domínio `@oracula.test`. |
| **Apply Pendente:** Disparar matrículas antigas por engano. | **Ação:** O teste usa um UUID novo, sem histórico em `matriculas_pendentes`. |
| **Sujeira no Banco:** Deixar usuário teste ativo. | **Ação:** Prefixar nome com "TESTE" e e-mail com "test_" para fácil identificação. |

---
**Regra de Ouro:** Não executar o teste RPC (D.TEST-1) até que a existência e o portal "visitante" deste usuário sejam confirmados via log no chat.
