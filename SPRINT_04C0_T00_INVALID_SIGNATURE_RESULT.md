# Sprint 04C.0: Resultado do Teste T00 (Assinatura Inválida)

**Status:** Concluído com Sucesso
**Objetivo:** Validar a rejeição de webhooks com assinatura HMAC-SHA256 incorreta.

---

## 1. Evidências da Execução

- **Método:** HTTP POST via `curl`
- **URL:** `https://pvjiznbfwtjqmpeiqqzk.supabase.co/functions/v1/rockty-webhook`
- **Header Enviado:** `X-Rockty-Signature: invalid_signature_test_value`
- **Payload Usado:**
```json
{
  "event_type": "subscription_created",
  "customer_email": "t00.invalid@example.com",
  "plan_id": "karv9y4bewbdjcwbmvtwq",
  "subscription_id": "TEST_T00_INVALID"
}
```

---

## 2. Resultados Obtidos

- **Status HTTP Retornado:** `401 Unauthorized`
- **Corpo da Resposta:** `{"error":"Invalid signature"}`
- **Deno Execution ID:** `e620af21-cacc-406a-b435-ba3b867aab89`

---

## 3. Verificação de Impacto no Banco (Integridade)

| Tabela | Estado Anterior | Estado Atual | Novo Registro? |
| :--- | :--- | :--- | :--- |
| `webhook_logs` | 1 | 1 | **Não** (Rejeitado antes do log) |
| `webhook_events` | 0 | 0 | **Não** |
| `subscriptions` | 0 | 0 | **Não** |
| `matriculas_pendentes` | 0 | 0 | **Não** |
| `profiles` | 5 | 5 | **Não** |
| `user_roles` | 5 | 5 | **Não** |

---

## 4. Conclusões

1. **Segurança:** A Edge Function interrompeu o processamento imediatamente após falhar na validação da assinatura, conforme esperado.
2. **Integridade:** Nenhuma tabela de negócio ou log foi alterada pelo payload não autorizado.
3. **Isolamento:** Nenhum outro teste (T01-T05) foi executado. O ambiente permanece limpo e idêntico ao baseline.
4. **Erro:** O erro retornado pela função foi exatamente `Invalid signature`.

---

**Critério de Aprovação:** O teste T00 prova que o sistema está protegido contra disparos não autorizados de webhooks.
