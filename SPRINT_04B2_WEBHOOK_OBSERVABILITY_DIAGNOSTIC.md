# Sprint 04B.2: Diagnóstico de Observabilidade de Webhooks Rockty

**Status:** Diagnóstico Concluído (Somente Leitura)
**Objetivo:** Avaliar a prontidão do sistema para processar e rastrear eventos da Rockty.

---

## 1. Edge Function: `rockty-webhook`

- **Existência:** Sim, localizada em `supabase/functions/rockty-webhook/index.ts`.
- **URL Pública:** `https://pvjiznbfwtjqmpeiqqzk.supabase.co/functions/v1/rockty-webhook`
- **Eventos Tratados:**
    - `subscription_created`
    - `subscription_renewed`
    - `payment_confirmed`
    - `payment_failed`
    - `subscription_canceled`
    - `subscription_expired`
- **Escrita em Tabelas:**
    - `webhook_logs`: Registro bruto inicial (antes do processamento).
    - `webhook_events`: Registro de evento processado com sucesso (idempotência).
    - `matriculas_pendentes`: Armazenamento de usuários não encontrados no Auth/Profiles.
    - `subscriptions`: Atualizada via RPC `process_webhook_subscription`.
- **Logs:** Utiliza `console.log` para fluxo e grava erros detalhados em `webhook_logs`.

## 2. Status das Tabelas de Infraestrutura

| Tabela | Status | Registros | Colunas Principais |
| :--- | :--- | :--- | :--- |
| `webhook_events` | Existe | 0 | `id`, `event_id`, `event_type`, `customer_email`, `payload` |
| `webhook_logs` | Existe | 1 | `id`, `event_type`, `payload`, `processed`, `error` |
| `subscriptions` | Existe | 0 | `user_id`, `plan_id`, `status`, `external_subscription_id` |
| `matriculas_pendentes` | Existe | 0 | `email`, `curso_id`, `portal_destino`, `processado` |

*Nota: O baixo número de registros confirma que não houve tráfego real ou histórico processado recentemente nesta versão da infraestrutura.*

## 3. Configuração de Segurança (Secrets)

- **ROCKTY_WEBHOOK_SECRET:** Presente no Lovable Cloud.
- **Validação de Assinatura:** O código implementa verificação HMAC SHA-256 usando os headers `X-Rockty-Signature` ou `x-webhook-signature`.

## 4. Análise da Lógica de Integração

- **Idempotência:** Implementada via `computeEventId` (hash determinístico do payload), garantindo que o mesmo evento não seja processado duas vezes.
- **Rastreabilidade:** O sistema registra o payload bruto em `webhook_logs` **antes** de tentar qualquer lógica de negócio, o que é uma excelente prática de observabilidade.
- **Atomicidade:** Utiliza a função de banco de dados `process_webhook_subscription` (RPC) para garantir que as atualizações em `subscriptions`, `profiles` e `user_roles` ocorram em uma única transação SQL.
- **Tratamento de Novos Usuários:** Se o e-mail não existe no sistema, os dados são preservados em `matriculas_pendentes` para ativação automática assim que o usuário realizar o primeiro login.

## 5. Falhas de Observabilidade Detectadas

1. **Vácuo Histórico:** As tabelas estão praticamente vazias, o que impede auditorias de eventos passados ocorridos antes da criação desta infraestrutura.
2. **Ausência de Alerta Ativo:** Não há mecanismo de notificação (ex: Slack/Discord) para falhas críticas de processamento, dependendo de consulta manual aos logs.
3. **Fallback Genérico:** Eventos desconhecidos são mapeados para `portal = visitante` por padrão, o que é seguro, mas pode mascarar novos tipos de eventos da Rockty.

## 6. Recomendações para Próximas Vendas

- **Validar em Sandbox:** Realizar um teste de disparo manual para a URL da Edge Function usando uma assinatura simulada para garantir que o fluxo `webhook_logs` -> `RPC` está íntegro.
- **Monitoramento de Logs:** Recomenda-se configurar um monitor de logs para a tabela `webhook_logs` onde `processed = false`.
- **Tabela de Planos:** Garantir que todos os `plan_id` vindos da Rockty estejam devidamente mapeados na tabela `plans` para evitar falhas de chave estrangeira (embora o código use fallbacks).
- **Endpoint de Saúde:** Considerar um endpoint `/health` ou similar para verificar se a função consegue se comunicar com o banco de dados sem processar um payload.

---
**Conclusão:** O sistema possui uma arquitetura robusta de observabilidade (Logs -> Eventos -> Subscriptions) e está pronto para receber eventos, desde que o `ROCKTY_WEBHOOK_SECRET` esteja sincronizado com a plataforma Rockty.
