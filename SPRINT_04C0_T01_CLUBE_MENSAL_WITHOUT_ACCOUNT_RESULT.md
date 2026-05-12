# SPRINT_04C0_T01_CLUBE_MENSAL_WITHOUT_ACCOUNT_RESULT.md

**Status:** Concluído (Execução Isolada)
**Data:** 2026-05-12
**Objetivo:** Validar se o `offer_id` real do Clube Mensal é reconhecido e gera matrícula pendente correta para email inexistente.

## 1. Payload de Teste (Simulado via CURL)

```json
{
  "event_type": "subscription_created",
  "customer_email": "teste.mensal+01@example.com",
  "plan_id": "karv9y4bewbdjcwbmvtwq",
  "subscription_id": "TEST_SUB_MENSAL",
  "transaction_id": "TEST_TX_MENSAL",
  "status": "active"
}
```

- **Assinatura HMAC:** `aab225fb338baa8130a558888f10d9dee07b45d2c4ba11acb217571a4e0d759c`
- **Header:** `X-Rockty-Signature`

## 2. Resultado da Execução

- **Status HTTP:** `200 OK`
- **Resposta da Função:** `{"success":true,"message":"Stored in pending matriculas"}`

## 3. Impacto no Banco de Dados

| Tabela | Registro Criado | Dados Gravados / Observação |
| :--- | :--- | :--- |
| `webhook_logs` | SIM | Registro bruto armazenado. |
| `webhook_events` | SIM | Evento registrado para idempotência. |
| `matriculas_pendentes` | SIM | `curso_id = karv9y4bewbdjcwbmvtwq`, `portal_destino = assinante`. |
| `subscriptions` | NÃO | Nenhuma assinatura ativa gerada (Correto para email sem conta). |
| `profiles` | NÃO | Inalterado (Correto). |
| `user_roles` | NÃO | Inalterado (Correto). |

## 4. Verificação de Integridade

- **Mapeamento:** O `offer_id` foi corretamente identificado e direcionou para o portal `assinante`.
- **Total Profiles:** 5 (Inalterado)
- **Total User Roles:** 5 (Inalterado)
- **Usuárias Reais Afetadas:** Nenhuma.
- **Usuário Auth Criado:** Não.

## 5. Classificação Final

**[ SEGURO ]**

O teste confirma que o mapeamento do Clube Mensal (`karv9y4bewbdjcwbmvtwq`) está funcional e que o sistema isola corretamente novas compras de emails inexistentes na tabela de pendências, sem poluir a tabela de perfis ou conceder acesso imediato sem conta Auth.

## 6. Confirmação de Isolamento

- Apenas o teste T01 foi executado nesta etapa.
- Nenhuma alteração de código ou publicação foi realizada.
- Nenhuma secret foi exposta no relatório.
