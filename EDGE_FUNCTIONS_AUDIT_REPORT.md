# EDGE FUNCTIONS AUDIT REPORT - Casa Orácula

## Lista de Functions (26 verificadas)

| Nome da Function | Secrets Principais | Acesso a Tabelas | Criticidade |
|:---|:---|:---|:---|
| `syntheia-chat` | OPENAI_API_KEY | `agentes`, `ai_interaction_logs` | CRÍTICA |
| `auth-email-hook` | LOVABLE_API_KEY | `email_send_log` | ALTA |
| `process-email-queue`| LOVABLE_API_KEY | `pgmq` | ALTA |
| `ai-chat` | OPENAI_API_KEY | `ai_global_settings` | CRÍTICA |
| `bussola-cartografa` | OPENAI_API_KEY | `client_city_state`, `tools` | ALTA |
| `generate-journey-narrative` | OPENAI_API_KEY | `clientes`, `sessions` | MÉDIA |

## Observações Técnicas
- **Secrets:** Uso consistente de `Deno.env.get` para chaves Supabase e OpenAI.
- **Redeploy:** Não há sinais de funções quebradas, mas as funções que usam IA (`syntheia-chat`) devem ser monitoradas quanto ao consumo de tokens.
- **Uso:** `syntheia-chat` parece ser o núcleo orquestrador v3, sendo a mais importante para a experiência da usuária.

---
*Apenas diagnóstico. Nenhuma alteração foi realizada.*
