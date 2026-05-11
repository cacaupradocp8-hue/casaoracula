# Sprint 04C.0: Plano de Teste Controlado do Webhook Rockty

**Status:** Planejamento Concluído (Aguardando Aprovação)
**Objetivo:** Validar a integridade do fluxo de recebimento, registro e processamento de webhooks da Rockty sem impactar usuárias reais ou a produção.

---

## 1. Estado Atual Confirmado (Baseline)

- **Edge Function:** `rockty-webhook` ativa e acessível.
- **URL de Destino:** `https://pvjiznbfwtjqmpeiqqzk.supabase.co/functions/v1/rockty-webhook`
- **Volumetria Atual:**
    - `webhook_logs`: 1 registro (erro/teste prévio).
    - `webhook_events`: 0 registros.
    - `subscriptions`: 0 registros.
    - `matriculas_pendentes`: 0 registros.
    - `plans`: 4 registros (Clube Mensal, Clube Anual, Formação Orácula, etc).

---

## 2. Metodologia de Teste Recomendada

### Abordagem: Chamada Manual Controlada (Scripted HTTP POST)
Como não utilizaremos o ambiente de produção da Rockty para disparos reais neste momento, simularemos o comportamento do servidor da Rockty via `curl` ou script técnico.

**Segurança do Teste:**
- Utilização de `customer_email` com sufixo `+test@` (ex: `test.webhook+oracula@gmail.com`).
- Uso de `ROCKTY_WEBHOOK_SECRET` real para validar a lógica de assinatura HMAC.
- Todos os IDs de transação e assinatura terão o prefixo `TEST_`.

---

## 3. Cenários de Teste e Payloads

Para cada cenário, será gerada uma assinatura HMAC-SHA256 válida usando o segredo do projeto.

### T01: Clube Mensal (Usuária com Conta)
- **Email:** `test.existente+mensal@example.com` (Criar perfil antes do teste)
- **Event:** `subscription_created`
- **Offer ID:** `rockty_clube_mensal` (ou similar conforme tabela `plans`)
- **Resultado:** `subscriptions` ativa, `profiles.portal = 'assinante'`.

### T02: Clube Anual (Usuária sem Conta)
- **Email:** `test.nova+anual@example.com` (Não existe no banco)
- **Event:** `subscription_created`
- **Offer ID:** `rockty_clube_anual`
- **Resultado:** `matriculas_pendentes` populada, `webhook_events` registrado.

### T03: Formação Orácula (Renovação)
- **Email:** `test.existente+formacao@example.com`
- **Event:** `subscription_renewed`
- **Offer ID:** `rockty_formacao_oracula`
- **Resultado:** `subscriptions.current_period_end` atualizado.

### T04: Offer ID Desconhecido (Segurança)
- **Email:** `test.unknown@example.com`
- **Event:** `payment_confirmed`
- **Offer ID:** `oferta_fantasma_999`
- **Resultado:** Logado em `webhook_logs`, mas processamento deve cair no fallback seguro ou retornar erro controlado (sem liberar portal indevido).

### T05: Assinatura Inválida (Segurança)
- **Ação:** Enviar payload correto com cabeçalho `X-Rockty-Signature` incorreto.
- **Resultado:** HTTP 401 Unauthorized. Nada alterado no banco.

---

## 4. Definição Técnica dos Payloads (Exemplo T01)

```json
{
  "event_type": "subscription_created",
  "customer_email": "test.webhook+01@example.com",
  "customer_name": "Test Webhook User",
  "subscription_id": "TEST_SUB_12345",
  "status": "active",
  "plan_id": "rockty_clube_mensal",
  "transaction_id": "TEST_TXN_12345",
  "current_period_start": "2026-05-11T12:00:00Z",
  "current_period_end": "2026-06-11T12:00:00Z"
}
```

---

## 5. Resultados Esperados vs. Critérios de Êxito

| Tabela | Comportamento Esperado |
| :--- | :--- |
| **webhook_logs** | Deve conter o JSON bruto de cada tentativa, inclusive erros. |
| **webhook_events** | Registro único por `event_id` (idempotência). |
| **subscriptions** | Registro criado apenas para planos válidos e usuárias com ID. |
| **matriculas_pendentes**| Entrada criada para emails sem `auth.users`. |
| **profiles** | Coluna `portal` deve mudar para `assinante` em sucessos. |

---

## 6. Riscos e Mitigações

1. **Afetar Profile Real:** Mitigado pelo uso restrito de emails `test.webhook+*`.
2. **Assinatura HMAC:** Requer acesso ao segredo para gerar o hash. O teste falhará se o segredo no Edge Function estiver diferente do usado no script.
3. **Idempotência:** Se rodarmos o mesmo teste 2x, o segundo deve retornar `deduplicated: true`.

---

## 7. Plano de Limpeza Pós-Teste

Os registros de teste serão facilmente identificáveis por:
- Emails terminando em `+test@...` ou similares.
- IDs começando com `TEST_`.

**Ação:** Após validação, os registros permanecerão no banco marcados como teste (via metadados ou padrão de nome) para histórico de auditoria, a menos que a exclusão seja explicitamente solicitada na Sprint 04D.

---

## 8. Próximos Passos (Aguardando Aprovação)

1. Aprovação deste plano (04C.0).
2. Execução técnica via ferramenta `curl_edge_functions` (04C.1).
3. Relatório de evidências dos logs criados.
