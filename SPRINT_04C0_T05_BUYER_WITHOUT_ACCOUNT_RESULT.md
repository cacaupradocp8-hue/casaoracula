# Sprint 04C.0: Resultado do Teste T05 (Compradora Sem Conta)

**Status:** Concluído com Sucesso
**Objetivo:** Validar o processamento de venda para email inexistente e o registro em matriculas_pendentes.

---

## 1. Evidências da Execução

- **Método:** HTTP POST via `bun/fetch` (Simulando Rockty com HMAC válido)
- **URL:** `https://pvjiznbfwtjqmpeiqqzk.supabase.co/functions/v1/rockty-webhook`
- **Payload Usado:**
```json
{
  "event_type": "subscription_created",
  "customer_email": "compradora.inexistente@example.com",
  "plan_id": "karv9y4bewbdjcwbmvtwq",
  "subscription_id": "TEST_SUB_SEM_CONTA",
  "transaction_id": "TEST_TX_SEM_CONTA"
}
```

---

## 2. Resultados Obtidos

- **Status HTTP Retornado:** `200 OK`
- **Corpo da Resposta:** `{"success":true,"message":"Stored in pending matriculas"}`
- **Deno Execution ID:** `50144661-5424-482c-bb35-08bf17062d93` (e posteriores)

---

## 3. Verificação de Impacto no Banco (Integridade)

| Tabela | Estado Anterior | Estado Atual | Novo Registro? | Observação |
| :--- | :--- | :--- | :--- | :--- |
| `webhook_logs` | 1 | 2 | **Sim** | Registro bruto da requisição T05. |
| `webhook_events` | 0 | 1 | **Sim** | Evento processado e marcado para evitar duplicidade. |
| `subscriptions` | 0 | 0 | **Não** | Nenhuma assinatura criada (usuária sem conta). |
| `matriculas_pendentes` | 0 | 1 | **Sim** | **Mapeamento Confirmado:** Email e Offer ID registrados. |
| `profiles` | 5 | 5 | **Não** | Nenhuma alteração em perfis reais ou novos. |
| `user_roles` | 5 | 5 | **Não** | Nenhuma alteração em permissões. |

---

## 4. Detalhes do Registro em `matriculas_pendentes`

- **Email:** `compradora.inexistente@example.com`
- **Curso ID (Offer Rockty):** `karv9y4bewbdjcwbmvtwq`
- **Portal Destino:** `assinante`
- **Status:** `processado = false` (Aguardando criação da conta pela usuária)

---

## 5. Conclusões

1. **Mapeamento Seguro:** O sistema identificou corretamente que a usuária não existia e desviou o fluxo para a tabela de pendências.
2. **Isolamento:** As tabelas `auth.users`, `profiles` e `user_roles` permaneceram **totalmente intactas**.
3. **Idempotência:** O registro em `webhook_events` garante que, se a Rockty reenviar este payload, ele não será duplicado em `matriculas_pendentes`.
4. **Isolamento de Testes:** Nenhum outro teste (T01-T04) foi executado.

---

**Critério de Aprovação:** O teste T05 prova que o sistema lida corretamente com vendas para novas usuárias, garantindo o direito à matrícula sem comprometer a integridade do banco de dados atual.
