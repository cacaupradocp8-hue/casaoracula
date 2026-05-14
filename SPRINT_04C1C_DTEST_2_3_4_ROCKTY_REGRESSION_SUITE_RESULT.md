# RELATÓRIO: SPRINT_04C1C_DTEST_2_3_4_ROCKTY_REGRESSION_SUITE_RESULT

## 1. Estado Antes
- **Usuário de Teste**: `test_d1_clube_mensal@oracula.test` (ID: `81b7fdfc-fc46-402f-b5d0-50ca9e2d148e`)
- **Portal em Profiles**: `assinante`
- **Portal em User Roles**: `assinante`
- **Subscription Atual**: `plan_id = clube_mensal`, `status = active`

## 2. Resultado dos Testes

### D.TEST-2 — Unknown Offer Regression
- **Input**: `plan_id = TEST_UNKNOWN_OFFER`, `provider = rockty`
- **Resultado**: **ERRO ESPERADO**
- **Mensagem**: `ERROR: P0001: Oferta Rockty nao mapeada ou inativa: TEST_UNKNOWN_OFFER`
- **Impacto**: Nenhuma alteração em profiles, roles ou subscriptions.
- **Status**: **SUCESSO**

### D.TEST-3 — Clube Anual
- **Input**: `plan_id = 2tgmh6vsiki7fg0buxdfxq`, `provider = rockty`
- **JSON Retornado**:
```json
{
  "plan_id": "clube_anual",
  "portal": "assinante",
  "status": "active",
  "subscription_id": "c92f262a-ddd6-4919-a699-776b93167396",
  "user_id": "81b7fdfc-fc46-402f-b5d0-50ca9e2d148e"
}
```
- **Profiles.portal**: `assinante`
- **User_roles.portal**: `assinante`
- **Subscriptions.plan_id**: `clube_anual`
- **Status**: **SUCESSO**

### D.TEST-4 — Formação Orácula
- **Input**: `plan_id = qqqmfhyjku7ou9kc70gg`, `provider = rockty`
- **JSON Retornado**:
```json
{
  "plan_id": "formacao_oracula",
  "portal": "aluna",
  "status": "active",
  "subscription_id": "c92f262a-ddd6-4919-a699-776b93167396",
  "user_id": "81b7fdfc-fc46-402f-b5d0-50ca9e2d148e"
}
```
- **Profiles.portal**: `aluna`
- **User_roles.portal**: `aluna`
- **Subscriptions.plan_id**: `formacao_oracula`
- **Status**: **SUCESSO**

## 3. Estado Final do Usuário
- **Profiles.portal**: `aluna`
- **User_roles.portal**: `aluna`
- **Subscription Final**:
  - `plan_id`: `formacao_oracula`
  - `external_id`: `TEST_EXT_FORMACAO_D4`
  - `current_period_end`: `2027-05-14` (Compatível com Anual)

## 4. Validações de Segurança
- **Trigger `protect_profile_privileged_fields_trigger`**: Ativa (`tgenabled = O`).
- **Função `system_sync_profile_access`**: Existe e configurada.
- **Bypass manual**: Não realizado (alterações feitas via RPC).
- **Usuários reais**: Nenhum usuário real foi alterado (apenas o usuário de teste `test_d1`).
- **Constraint `subscriptions_user_provider_unique`**: Mantida e ativa.

## 5. Classificação Final
**APROVADO**

Os mapeamentos Rockty para Clube Anual e Formação Orácula estão funcionando corretamente e a regressão para ofertas desconhecidas está protegida.
