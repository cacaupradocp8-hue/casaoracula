# Plano de Teste D.TEST-1: Clube Mensal RPC Safety Test

## Objetivo
Validar se a função RPC `public.process_webhook_subscription` traduz corretamente o `offer_id` externo da Rockty para o `plan_id` interno (`clube_mensal`) e o portal correspondente (`assinante`), utilizando o usuário de teste criado no D.TEST-1A.

## 1. Identificação do Usuário de Teste
- **user_id**: `81b7fdfc-fc46-402f-b5d0-50ca9e2d148e`
- **email**: `test_d1_clube_mensal@oracula.test`
- **profile.portal atual**: `visitante`
- **user_roles.portal atual**: `visitante`
- **Confirmação**: O usuário está em estado inicial de visitante e não possui assinaturas vinculadas.

## 2. Estado Antes do Teste (Snapshot)
- **Total Subscriptions**: 0
- **Total Profiles**: 6
- **Total User Roles**: 6
- **Total Matrículas Pendentes**: 3
- **External ID Check**: Não existe assinatura com `external_subscription_id = 'TEST_EXT_CLUBE_MENSAL_D1'`.
- **User ID Check**: Não existe assinatura vinculada ao `user_id` de teste.

## 3. Chamada RPC Planejada
A execução será realizada via SQL/RPC simulando o processamento do webhook:

```sql
SELECT public.process_webhook_subscription(
  _user_id := '81b7fdfc-fc46-402f-b5d0-50ca9e2d148e',
  _provider := 'rockty',
  _plan_id := 'karv9y4bewbdjcwbmvtwq', -- Offer ID real do Clube Mensal
  _status := 'active',
  _portal := 'visitante', -- Forçado como visitante para testar se o mapping interno tem precedência
  _subscription_status_profile := 'active',
  _current_period_start := now(),
  _current_period_end := now() + interval '30 days',
  _next_billing_date := now() + interval '30 days',
  _external_subscription_id := 'TEST_EXT_CLUBE_MENSAL_D1',
  _customer_name := 'Teste Clube Mensal D1'
);
```

## 4. Resultado Esperado
- **Retorno**: JSON indicando sucesso.
- **Tabela `subscriptions`**:
  - Nova linha criada.
  - `plan_id = 'clube_mensal'` (traduzido do offer_id).
  - `provider = 'rockty'`.
  - `external_subscription_id = 'TEST_EXT_CLUBE_MENSAL_D1'`.
- **Tabela `profiles`**:
  - `portal = 'assinante'` (mapping deve sobrescrever o `_portal` enviado).
- **Tabela `user_roles`**:
  - `portal = 'assinante'`.
- **Isolamento**:
  - Nenhuma alteração em `matriculas_pendentes`.
  - Nenhum usuário real afetado.

## 5. Validações Pós-Teste
1. Verificar se a contagem global de assinaturas aumentou exatamente em 1.
2. Confirmar `plan_id = 'clube_mensal'` na nova assinatura.
3. Confirmar `portal = 'assinante'` no `profiles` do `user_id` de teste.
4. Confirmar `portal = 'assinante'` no `user_roles` do `user_id` de teste.
5. Garantir que a contagem de `matriculas_pendentes` permanece em 3.
6. Verificar se a constraint `subscriptions_user_provider_unique` permanece ativa (não deve haver erro de duplicidade se tentado novamente, mas sim atualização).
7. Confirmar que nenhuma Edge Function ou Webhook externo foi disparado.

## 6. Riscos Identificados
- **Mapeamento Falho**: A função gravar o `offer_id` externo (`karv9y4...`) diretamente no campo `plan_id`.
- **Precedência de Parâmetro**: A função respeitar o `_portal = 'visitante'` enviado na chamada em vez de aplicar o mapping para `assinante`.
- **Constraint Error**: A função falhar devido à constraint `subscriptions_user_provider_unique` se houver resquícios de testes anteriores não limpos.
- **Isolamento**: Erro de lógica que afete outros usuários ou registros de matrícula.
- **Datas**: `current_period_end` ser gravado como nulo ou com timezone incorreto.

## 7. Plano de Limpeza Futura
- **Nota**: A limpeza NÃO será executada neste bloco.
- **Registros para Remoção**:
  - Assinatura: `external_subscription_id = 'TEST_EXT_CLUBE_MENSAL_D1'`.
  - Usuário: `test_d1_clube_mensal@oracula.test`.
- A remoção deve ocorrer em um bloco futuro de cleanup autorizado.

---
**Regras de Execução:**
- Não executar sem autorização expressa.
- Não publicar alterações.
- Não tocar em dados de produção.
