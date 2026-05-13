# SPRINT_04C1C_BLOCK_D_TEST1A_SAFE_TEST_USER_PLAN_V2

## 1. Método Exato de Criação
O método recomendado é a criação via **Painel de Autenticação do Supabase (Auth Admin)** ou via **Fluxo de Signup controlado no App**.

### Por que não usar SQL direto em `auth.users`?
Embora tecnicamente possível, o `INSERT` direto via SQL em `auth.users` no Lovable Cloud/Supabase pode ser arriscado porque:
- Exige manipulação manual de hashes de senha compatíveis com o `auth.uid()`.
- Pode não disparar todos os hooks de metadados internos do Supabase Auth.
- O método via API/Dashboard garante que os triggers de banco de dados (`on_auth_user_created`) sejam disparados seguindo o fluxo padrão do sistema.

## 2. Dados do Usuário de Teste
- **E-mail:** `test_d1_clube_mensal@oracula.test`
- **Nome:** `Teste Clube Mensal D1`
- **User_id Proposto:** Será gerado automaticamente pelo Supabase (UUID v4) para garantir unicidade real.
- **Portal Inicial Esperado:** `visitante`
- **User_roles.portal Inicial Esperado:** `visitante`

## 3. Triggers Envolvidas
- **`handle_new_user`:** Será disparada automaticamente pela criação do registro em `auth.users`, criando as entradas em `profiles` e `user_roles`.
- **`apply_pending_matricula`:** Caso exista um trigger vinculado ao e-mail em `auth.users`, ele será disparado.
- **Por que é seguro (não processará pendências)?** Antes da criação, validaremos que não existem registros para este e-mail específico (`test_d1_clube_mensal@oracula.test`) na tabela `public.matriculas_pendentes`. Sem registros pendentes, a função não terá o que processar.

## 4. Validações Antes da Criação (Auditoria de Limpeza)
Executar os seguintes SELECTs para garantir que o ambiente está "virgem":
- `SELECT id FROM auth.users WHERE email = 'test_d1_clube_mensal@oracula.test';` (Deve ser 0)
- `SELECT id FROM public.profiles WHERE email = 'test_d1_clube_mensal@oracula.test';` (Deve ser 0)
- `SELECT user_id FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test_d1_clube_mensal@oracula.test');` (Deve ser 0)
- `SELECT count(*) FROM public.matriculas_pendentes WHERE email = 'test_d1_clube_mensal@oracula.test';` (Deve ser 0)

## 5. Validações Depois da Criação
Confirmar o estado do novo usuário:
1. **Auth:** UUID gerado em `auth.users`.
2. **Profile:** Registro em `public.profiles` criado com `portal = 'visitante'`.
3. **User_role:** Registro em `public.user_roles` criado com `role = 'visitante'`.
4. **Subscriptions:** `SELECT count(*) FROM public.subscriptions WHERE user_id = <UUID>` deve ser **0**.
5. **Matrículas:** Confirmar que `public.matriculas_pendentes` para este e-mail continua vazio ou inalterado.

## 6. Plano de Limpeza Futura (Não executar agora)
Após a conclusão dos testes (D.TEST-1), a remoção seguirá esta ordem:
1. `DELETE FROM public.subscriptions WHERE user_id = <TEST_UUID>;`
2. `DELETE FROM public.user_roles WHERE user_id = <TEST_UUID>;`
3. `DELETE FROM public.profiles WHERE id = <TEST_UUID>;`
4. `DELETE FROM auth.users WHERE id = <TEST_UUID>;`

## 7. Riscos e Mitigações
| Risco | Mitigação |
| :--- | :--- |
| **Criação sem Profile/Role** | Validar logs de trigger e registros em `profiles`/`user_roles` imediatamente após a criação. |
| **Trigger apply_pending_matricula processar algo** | O uso de um e-mail com domínio `.test` inédito e a validação prévia da tabela de pendências anulam este risco. |
| **Usuário Teste ficar Ativo** | O nome "Teste Clube Mensal D1" e o domínio `.test` facilitam a auditoria e limpeza manual se necessário. |
| **Conflito com E-mail Real** | O uso do domínio reservado `.test` impede qualquer colisão com usuários reais (`.com`, `.com.br`, etc). |
