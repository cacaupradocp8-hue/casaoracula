# SPRINT_04C2_ROCKTY_PRODUCTION_MONITORING_GUIDE

## 1. Checklist Diário (Primeiros 7 Dias)
Monitorar os seguintes indicadores para garantir a estabilidade da integração:

- [ ] **Webhooks Recebidos:** Verificar `webhook_logs` para confirmar volume esperado.
- [ ] **Processamento:** Garantir que `webhook_events` estão sendo gerados sem erros de processamento.
- [ ] **Subscriptions:** Validar se as assinaturas estão sendo criadas/atualizadas com `external_provider = 'rockty'`.
- [ ] **Pendências:** Checar `matriculas_pendentes` para vendas de novos usuários.
- [ ] **Unmapped:** Verificar se há registros em `webhook_logs` com `processing_error` contendo "Unknown offer".
- [ ] **Divergências de Portal:** Comparar `profiles.portal` com `user_roles.portal` para garantir sincronia.

## 2. Alertas Críticos (Ação Imediata)
- **Unknown Offer:** Venda de produto não mapeado na `config`.
- **HMAC Inválido:** Falha sistemática na validação de segurança (pode indicar chave incorreta ou ataque).
- **Webhook Duplicado:** Múltiplos eventos para o mesmo `external_subscription_id` e status no mesmo segundo.
- **Subscription sem Profile:** Assinatura vinculada a um e-mail que não possui profile após o período de carência do signup.
- **Erro em Edge Function:** Logs da função `rockty-webhook` apresentando status 500 ou 400.
- **Matrícula Pendente Travada:** Registro em `matriculas_pendentes` não removido após o usuário realizar o primeiro login/signup.

## 3. Queries de Auditoria (Somente Leitura)

### Listar Vendas Processadas (Últimas 24h)
```sql
SELECT created_at, payload->>'email' as email, payload->>'status' as status, payload->>'offer_id' as offer
FROM public.webhook_logs
WHERE provider = 'rockty' AND created_at > now() - interval '24 hours'
ORDER BY created_at DESC;
```

### Listar Pendências Ativas
```sql
SELECT * FROM public.matriculas_pendentes ORDER BY created_at DESC;
```

### Listar Ofertas Não Mapeadas (Erros)
```sql
SELECT created_at, payload->>'offer_id' as offer_id, payload->>'product_name' as product, processing_error
FROM public.webhook_logs
WHERE processing_error LIKE '%Unknown offer%'
ORDER BY created_at DESC;
```

### Listar Divergências de Portal
```sql
SELECT p.id, p.email, p.portal as profile_portal, r.portal as roles_portal
FROM public.profiles p
JOIN public.user_roles r ON p.id = r.user_id
WHERE p.portal IS DISTINCT FROM r.portal;
```

### Listar Subscriptions Rockty
```sql
SELECT s.id, p.email, s.status, s.portal, s.external_subscription_id
FROM public.subscriptions s
JOIN public.profiles p ON s.user_id = p.id
WHERE s.external_provider = 'rockty'
ORDER BY s.updated_at DESC;
```

## 4. Procedimento de Resposta

| Incidente | Ação Recomendada |
| :--- | :--- |
| **Unknown Offer** | Identificar o `offer_id` no log e atualizar a função `get_portal_from_offer` com o novo de/para. |
| **Acesso Não Recebido** | Verificar se há `matricula_pendente`. Se sim, aguardar signup. Se não, checar `webhook_logs` por erros. |
| **Portal Incorreto** | Não alterar `profiles.portal` manualmente. Re-processar o webhook ou verificar mapeamento da oferta. |
| **Webhook Duplicado** | A trigger `process_webhook_subscription` já trata idempotência via `external_subscription_id`, mas deve-se monitorar logs. |
| **HMAC Falhou** | Validar se a `ROCKTY_WEBHOOK_SECRET` no Supabase Edge Function coincide com a chave na plataforma Rockty. |

## 5. Regras de Ouro
1. **NÃO** corrigir `profiles.portal` via SQL manual; use a lógica de sincronia.
2. **NÃO** desabilitar triggers de produção (`on_webhook_event_processed`, etc).
3. **NÃO** apagar registros de `webhook_logs` reais; eles são sua trilha de auditoria.
4. **NÃO** alterar mapeamentos de oferta sem validar o impacto em usuários ativos.
5. **NÃO** realizar deploys de Edge Functions sem testar o HMAC localmente ou em staging.
