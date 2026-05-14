# SPRINT_04C1C_BLOCK_F_ROCKTY_WEBHOOK_END_TO_END_TEST_RESULT.md

## 1. Payloads usados

### F.TEST-1 (Clube Mensal - Existente)
```json
{
  "event_type": "subscription_created",
  "customer_email": "test_d1_clube_mensal@oracula.test",
  "customer_name": "Test User F1",
  "subscription_id": "sub_f1_1778761921582",
  "plan_id": "karv9y4bewbdjcwbmvtwq",
  "status": "active"
}
```

### F.TEST-2 (Formação Orácula - Existente)
```json
{
  "event_type": "subscription_created",
  "customer_email": "test_d1_clube_mensal@oracula.test",
  "customer_name": "Test User F1",
  "subscription_id": "sub_f2_1778761923467",
  "plan_id": "qqqmfhyjku7ou9kc70gg",
  "status": "active"
}
```

### F.TEST-3 (Compra sem conta)
```json
{
  "event_type": "subscription_created",
  "customer_email": "test_f3_pending_1778761923860@oracula.test",
  "customer_name": "Test Pending User F3",
  "subscription_id": "sub_f3_1778761923860",
  "plan_id": "karv9y4bewbdjcwbmvtwq",
  "status": "active"
}
```

### F.TEST-4 (Unknown Offer)
```json
{
  "event_type": "subscription_created",
  "customer_email": "test_d1_clube_mensal@oracula.test",
  "customer_name": "Test User F1",
  "subscription_id": "sub_f4_1778761925357",
  "plan_id": "TEST_UNKNOWN_OFFER",
  "status": "active"
}
```

## 2. Confirmação HMAC
- HMAC verificado com sucesso em todos os testes usando a secret `ROCKTY_WEBHOOK_SECRET`.
- Header usado: `X-Rockty-Signature`.

## 3. Resultado HTTP
- **F.TEST-1**: 200 OK
- **F.TEST-2**: 200 OK
- **F.TEST-3**: 200 OK
- **F.TEST-4**: 500 Internal Server Error (Esperado devido à exceção de mapeamento na RPC)

## 4. Webhook_logs criados
- **F.TEST-1**: `1eda13c3-070d-4646-a705-21e52a99cfd5` (processed: true)
- **F.TEST-2**: `fda09c78-9185-4b40-bca8-7bd5ea3a5468` (processed: true)
- **F.TEST-3**: `0af0ba0d-40cc-49e6-94dd-1ce5eb790aad` (processed: false - pending)
- **F.TEST-4**: `069ce8b9-874e-441b-a11f-e76f59adcf6d` (processed: false - error)

## 5. Webhook_events criados
- **F.TEST-1**: `sub_sub_f1_1778761921582_subscription_created`
- **F.TEST-2**: `sub_sub_f2_1778761923467_subscription_created`
- **F.TEST-3**: `sub_sub_f3_1778761923860_subscription_created`
- **F.TEST-4**: Não criado (Rollback da transação por erro de mapeamento).

## 6. Subscriptions criadas/atualizadas
- Usuário `81b7fdfc...`:
  - Após F.TEST-1: `plan_id: clube_mensal`, `status: active`.
  - Após F.TEST-2: `plan_id: formacao_oracula`, `status: active`.

## 7. Matriculas_pendentes criadas
- Email `test_f3_pending_1778761923860@oracula.test`:
  - `curso_id: karv9y4bewbdjcwbmvtwq`
  - `processado: false`

## 8. Portals finais em profiles/user_roles
- Usuário `test_d1_clube_mensal@oracula.test`:
  - `profile.portal`: `aluna`
  - `user_roles.portal`: `aluna`
  - (Confirmado sincronismo via `system_sync_profile_access`)

## 9. Confirmação de nenhum usuário real alterado
- Testes restritos a emails `@oracula.test`.
- Nenhuma alteração em usuários produtivos detectada.

## 10. Classificação final
**APROVADO**
