# Plano de Lançamento em Produção Controlada: Sprint 04D
**Documento:** SPRINT_04D_CONTROLLED_PRODUCTION_LAUNCH_PLAN.md
**Status:** PLANEJAMENTO OPERACIONAL
**Data:** 14 de Maio de 2026

## 1. Checklist Antes de Abrir Vendas
- [ ] **Mapping Rockty:** Conferir se todos os IDs de oferta (Offer ID) estão mapeados corretamente para os portais correspondentes.
- [ ] **Webhook Ativo:** Verificar no dashboard da Rockty se o endpoint da Edge Function está configurado e com status "Ativo".
- [ ] **HMAC Configurado:** Garantir que a `ROCKTY_WEBHOOK_SECRET` está configurada no Supabase Vault e coincide com a chave na Rockty.
- [ ] **Guardiã Rockty Acessível:** Confirmar que o painel administrativo da Guardiã está carregando dados e acessível por administradores.
- [ ] **Aba Documentos Acessível:** Validar que todos os guias operacionais e protocolos estão visíveis no Admin.
- [ ] **Planos Ativos:** Verificar se os produtos na Rockty estão com checkout aberto e preços corretos.
- [ ] **Links de Checkout:** Testar os links de venda final para garantir que não levam a páginas de erro ou ofertas expiradas.

## 2. Monitoramento da Primeira Venda
Durante a primeira transação, os seguintes pontos devem ser monitorados em tempo real na Guardiã Rockty:
- **webhook_logs:** Verificar se a requisição chegou e qual o status HTTP retornado (200 OK esperado).
- **webhook_events:** Confirmar o processamento do evento (ex: `order.approved`).
- **subscriptions:** Validar se a assinatura foi criada/atualizada com o portal correto.
- **profiles.portal & user_roles.portal:** Confirmar se o "espelho" visual e a permissão técnica de acesso foram sincronizados.
- **matriculas_pendentes:** Garantir que a tabela está vazia após o processamento (ou monitorar o motivo da retenção).
- **Alertas da Guardiã:** Verificar se o card de alertas disparou algum aviso de "Unknown Offer" ou "HMAC Error".

## 3. Procedimento por Cenário
- **Compradora com conta (E-mail existente):** O sistema deve localizar o `user_id` e apenas adicionar a nova `user_role` e atualizar o `profile`.
- **Compradora sem conta (Novo e-mail):** O sistema deve criar uma entrada em `matriculas_pendentes`. A compradora deve realizar o Sign-up com o mesmo e-mail para que a trigger processe a liberação automática.
- **Oferta Desconhecida (Unknown Offer):** O webhook será registrado como erro. O administrador deve atualizar o mapping no código e reprocessar o evento (se disponível) ou aguardar nova tentativa da Rockty.
- **HMAC Inválido:** Indica falha de segurança ou chave incorreta. Nenhuma ação de liberação ocorrerá. Verificar `ROCKTY_WEBHOOK_SECRET`.
- **Webhook Duplicado:** O sistema deve ignorar eventos com o mesmo ID de transação já processado (idempotência).
- **Pagamento Aprovado sem Acesso:** Verificar se o e-mail na Rockty é diferente do e-mail usado no portal. Orientar a usuária ou usar o painel administrativo para conciliação.

## 4. Protocolo de Evidência
Em caso de qualquer comportamento inesperado, registrar:
- **Print do Painel Guardiã:** Capturar o estado dos cards de métricas e alertas.
- **ID da Transação Rockty:** Copiar o ID da venda no dashboard da Rockty.
- **Log do Webhook:** Copiar o JSON recebido (disponível no `webhook_logs` do Admin ou Logs da Edge Function).
- **ID do Usuário/E-mail:** Identificar quem foi afetado.
- **Suporte Técnico:** Acionar apenas se houver falha de infraestrutura (Edge Function fora do ar) ou erro de banco persistente.

## 5. Regras de Segurança
- **Não corrigir profiles.portal manualmente:** Use sempre o fluxo automatizado ou a interface da Guardiã para evitar desincronização com `user_roles`.
- **Não desabilitar trigger:** A trigger de processamento de matrículas pendentes é vital para o fluxo de novos usuários.
- **Não apagar logs:** Os logs de webhook são a única fonte de auditoria em caso de disputa de pagamento ou erro de acesso.
- **Não alterar mapping sem revisão:** Mudanças nos IDs de oferta devem passar por validação de staging.
- **Não reprocessar sem autorização:** Reprocessar eventos aprovados pode gerar duplicidade de notificações se não houver cautela.

## 6. Critérios de Sucesso
O lançamento será considerado bem-sucedido após:
- **3 vendas reais** processadas ponta-a-ponta sem intervenção manual.
- **OU 1 venda de cada tipo principal validada:**
  - 1 Clube Orácula (Mensal/Anual) - Fluxo de Subscription.
  - 1 Formação Orácula (Vitalício/Portal Específico) - Fluxo de Acesso Direto.
- **Feedback Positivo:** Usuária recebe e-mail da Rockty, faz login no portal e encontra o conteúdo liberado imediatamente.
