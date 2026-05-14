# CHECKLIST_PRODUCAO_CONTROLADA

## 1. Verificação Técnica Semanal
- [ ] Auditoria de `webhook_logs` (buscar por falhas de processamento).
- [ ] Verificação de integridade entre `profiles` e `subscriptions`.
- [ ] Teste de sanidade do endpoint de webhook (simulação de ping).
- [ ] Revisão de logs de erro do Supabase Edge Functions.

## 2. Verificação Operacional Diária
- [ ] Conferir o painel Guardiã Rockty.
- [ ] Validar se há mais de 3 pendências paradas por mais de 24h.
- [ ] Checar se novas ofertas foram criadas na Rockty sem mapeamento.

## 3. Manutenção de Mappings
- [ ] Validar se novos `offer_id` foram adicionados na plataforma.
- [ ] Garantir que o `de/para` de portais continua válido.
