# POLITICA_WEBHOOKS

## 1. Segurança e Integridade
- **HMAC Obrigatório:** Todos os webhooks devem ser validados via assinatura HMAC usando a `ROCKTY_WEBHOOK_SECRET`.
- **Idempotência:** O sistema deve garantir que o mesmo webhook não seja processado duas vezes (chave: `external_subscription_id` + `status`).
- **Retentativas:** O endpoint deve ser resiliente a retentativas automáticas do provedor.

## 2. Tratamento de Payload
- Apenas campos necessários devem ser persistidos em `webhook_logs`.
- Informações sensíveis (cartão, etc.) nunca devem ser armazenadas.

## 3. Erros e Alertas
- Falhas de processamento devem gerar registros na tabela de logs com o erro detalhado.
- Webhooks sem oferta mapeada devem ser registrados como `unmapped`.
