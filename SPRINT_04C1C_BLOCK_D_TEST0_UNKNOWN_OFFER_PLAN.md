# SPRINT_04C1C_BLOCK_D_TEST0_UNKNOWN_OFFER_PLAN.md

Plano de teste seguro para validação de oferta desconhecida (Unknown Offer) no BLOCO D.

## 1. Estado Atual antes do Teste (Snapshot)
- **Total Subscriptions:** 0
- **Total Profiles:** 5
- **Total User Roles:** 5
- **Total Matrículas Pendentes:** 3

## 2. Payload/RPC Simulado (Script de Teste)
O teste será realizado via chamada direta da função (RPC), sem passar por webhooks ou triggers.

**Parâmetros:**
- `_user_id`: 'afe12d58-16ad-41dc-ab6a-ff230adedd6e' (ID de teste seguro existente no DB)
- `_provider`: 'rockty'
- `_plan_id`: 'TEST_UNKNOWN_OFFER' (ID inexistente na tabela rockty_offer_mapping)
- `_external_subscription_id`: 'TEST_EXT_UNKNOWN_D0'
- `_status`: 'active'
- `_portal`: 'assinante' (Portal solicitado pelo payload, mas deve ser ignorado/bloqueado)

**SQL de execução (Planejado):**
```sql
SELECT public.process_webhook_subscription(
  'afe12d58-16ad-41dc-ab6a-ff230adedd6e',
  'rockty',
  'TEST_UNKNOWN_OFFER',
  'active',
  'assinante',
  'active',
  now(),
  now() + interval '30 days',
  now() + interval '30 days',
  'TEST_EXT_UNKNOWN_D0'
);
```

## 3. Resultado Esperado
- **Retorno da Função:** JSON contendo `{"error": "Oferta Rockty nao mapeada ou inativa", "offer_id": "TEST_UNKNOWN_OFFER"}`.
- **Tabela Subscriptions:** Nenhum registro novo criado.
- **Tabela Profiles:** O portal do usuário deve permanecer como `visitante` (não deve mudar para `assinante`).
- **Tabela User Roles:** Sem alteração.
- **Matrículas Pendentes:** Sem alteração.

## 4. Validações Pós-Teste (Apenas SELECT)
- [ ] `SELECT count(*) FROM subscriptions;` -> Deve retornar 0.
- [ ] `SELECT portal FROM profiles WHERE id = 'afe12d58-16ad-41dc-ab6a-ff230adedd6e';` -> Deve retornar 'visitante'.
- [ ] `SELECT portal FROM user_roles WHERE user_id = 'afe12d58-16ad-41dc-ab6a-ff230adedd6e';` -> Deve retornar 'visitante'.
- [ ] `SELECT count(*) FROM matriculas_pendentes;` -> Deve retornar 3.

## 5. Análise de Riscos
- **Risco 1 (Efeito Colateral):** A função atualizar o portal do usuário no `profiles` antes de validar se a oferta Rockty é válida. *Proteção: A validação de mapping é a primeira instrução da função.*
- **Risco 2 (Duplicidade):** A função criar a `subscription` antes da validação. *Proteção: O `INSERT` só ocorre após a resolução do `internal_plan_id`.*
- **Risco 3 (Reprocessamento):** O teste disparar alguma trigger legada. *Proteção: Como a transação falha/retorna antes do DML, nenhuma trigger de INSERT/UPDATE será disparada.*

## 6. Próximos Passos
- Aguardar autorização para execução deste plano de teste (T-D.0).
