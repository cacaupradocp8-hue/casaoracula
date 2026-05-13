# SPRINT_04C1C_BLOCK_D_TEST1_CLUBE_MENSAL_RPC_PLAN.md

Plano de teste seguro para validação de tradução de oferta real (Clube Mensal) no BLOCO D.

## 1. Estratégia de Usuário de Teste
- **Diagnóstico:** O usuário fictício `00000000-0000-0000-0000-000000000999` não existe no banco.
- **Proposta:** Para um teste completo que valide a sincronização de `profiles` e `user_roles`, é necessária uma etapa prévia de criação deste usuário de teste.
- **Segurança:** O usuário será criado com e-mail `teste_clube_mensal_d1@ficticio.com` para garantir isolamento total de clientes reais.

## 2. Estado Antes do Teste (Baseline)
Serão capturadas as contagens atuais de:
- `subscriptions`
- `profiles`
- `user_roles`
- `matriculas_pendentes`

**Verificação de Constraint:**
- Confirmar que `subscriptions_user_provider_unique` (UNIQUE user_id, provider) ainda está ativa.

## 3. Chamada RPC Planejada
A execução consiste em chamar a função `public.process_webhook_subscription` com os seguintes parâmetros:

```sql
SELECT public.process_webhook_subscription(
    _user_id := '00000000-0000-0000-0000-000000000999',
    _provider := 'rockty',
    _plan_id := 'karv9y4bewbdjcwbmvtwq', -- Offer ID real do Clube Mensal
    _status := 'active',
    _portal := 'visitante',              -- Mapping deve sobrescrever para 'assinante'
    _subscription_status_profile := 'active',
    _current_period_start := now(),
    _current_period_end := now() + interval '30 days',
    _next_billing_date := now() + interval '30 days',
    _external_subscription_id := 'TEST_EXT_CLUBE_MENSAL_D1',
    _customer_name := 'Teste Clube Mensal'
);
```

## 4. Resultado Esperado e Validações
### Comportamento da Função:
- **Sucesso Estrutural:** A função deve retornar um JSON indicando `success: true`.
- **Tradução de Plan ID:** O campo `plan_id` no registro criado em `subscriptions` deve ser `clube_mensal` (e não o hash da Rockty).
- **Precedência de Portal:** O portal em `profiles` e `user_roles` deve ser atualizado para `assinante` (conforme mapping), ignorando o parâmetro `_portal := 'visitante'`.

### Integridade dos Dados:
- **Subscriptions:** +1 registro (ID externo: `TEST_EXT_CLUBE_MENSAL_D1`).
- **Profiles:** O portal do usuário de teste deve ser `assinante`.
- **User Roles:** O portal do usuário de teste deve ser `assinante`.
- **Matrículas Pendentes:** Nenhuma alteração (contagem igual à baseline).
- **Isolamento:** Nenhum usuário real ou assinatura real deve ser alterado.

## 5. Riscos e Observações Técnicas
- **Risco de Mapping:** Identificada possível divergência: o banco atualmente mapeia `karv9y4bewbdjcwbmvtwq` para `aluna`, mas o requisito do teste espera `assinante`. O teste servirá para confirmar se o mapping precisa de ajuste.
- **Risco de Schema:** Se a função referenciar colunas inexistentes na tabela de mapping (ex: `internal_plan_id` vs `plan_id`), o teste falhará com erro de SQL, o que é um resultado válido para o diagnóstico.

## 6. Plano de Limpeza
- **Ação:** Após a validação dos resultados, os registros criados (usuário de teste e assinatura de teste) serão mantidos até autorização explícita para remoção.
- **Comando de Rollback (Se solicitado):**
  ```sql
  DELETE FROM public.subscriptions WHERE external_subscription_id = 'TEST_EXT_CLUBE_MENSAL_D1';
  DELETE FROM public.user_roles WHERE user_id = '00000000-0000-0000-0000-000000000999';
  DELETE FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000999';
  ```

---
**Status:** Aguardando autorização para criação do usuário de teste e posterior execução do RPC.
