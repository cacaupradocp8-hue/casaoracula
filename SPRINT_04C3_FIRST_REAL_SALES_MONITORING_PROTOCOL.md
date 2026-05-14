# SPRINT_04C3_FIRST_REAL_SALES_MONITORING_PROTOCOL

## 1. Checklist Antes da Primeira Venda
Certificar que o ambiente está 100% preparado para receber o primeiro fluxo real:

- [ ] **Painel Guardiã Rockty:** Acessível no Admin e carregando dados sem erros.
- [ ] **Webhook Ativo:** Endpoint configurado e habilitado na plataforma Rockty.
- [ ] **HMAC Configurado:** `ROCKTY_WEBHOOK_SECRET` verificada nas Edge Functions.
- [ ] **Mappings Oficiais:** Conferência final do de/para de `offer_id` para `portal`.
- [ ] **Planos Ativos:** Planos correspondentes às ofertas existentes no banco de dados.
- [ ] **Trigger de Proteção:** Triggers de idempotência e sincronia de portal (`handle_subscription_sync`, etc.) habilitadas.
- [ ] **Painel de Pendências:** Visível no Guardiã Rockty para capturar vendas de novos usuários.

## 2. O Que Monitorar na Primeira Venda
Acompanhamento em tempo real via Admin (Guardiã Rockty) ou SQL:

- [ ] **webhook_logs:** Verificar se o log foi criado com status 200.
- [ ] **webhook_events:** Confirmar a criação do evento de processamento.
- [ ] **subscriptions:** Validar se a assinatura foi criada/atualizada corretamente.
- [ ] **profiles.portal:** Confirmar se o campo `portal` foi atualizado para o valor da oferta.
- [ ] **user_roles.portal:** Confirmar se a role de portal está em sincronia com o profile.
- [ ] **matriculas_pendentes:** Se a compradora não tiver conta, verificar se o registro de pendência foi criado.
- [ ] **Erros/Unmapped:** Monitorar alertas de "Unknown offer" ou falhas de processamento.

## 3. Procedimento: Venda de Usuária Existente
1. Localizar o e-mail da usuária no Guardiã Rockty.
2. Confirmar se a `subscription` vinculada tem `external_provider = 'rockty'`.
3. Validar se o `portal` no profile reflete a nova compra.
4. Solicitar que a usuária faça login e confirme o acesso ao portal correto.

## 4. Procedimento: Compradora Sem Conta (Lead Novo)
1. Verificar se o registro surgiu na tabela de **Matrículas Pendentes**.
2. Confirmar que o e-mail e o portal alvo estão corretos na pendência.
3. Orientar a cliente a realizar o Signup com o **mesmo e-mail** da compra.
4. Após o Signup, confirmar no Admin que a pendência sumiu e a assinatura foi vinculada ao novo `user_id`.

## 5. Procedimento em Caso de Erro

| Erro Detectado | Ação de Resposta |
| :--- | :--- |
| **HMAC Inválido** | Bloquear novas tentativas e validar a chave secreta entre Rockty e Supabase. |
| **Unknown Offer** | Registrar o `offer_id` não mapeado e atualizar a função de mapeamento (requer autorização). |
| **Divergência Profile/Role** | Verificar se a trigger de sincronia disparou; se não, investigar logs de erro de DB. |
| **Subscription sem Portal** | Validar se o payload do webhook continha a informação da oferta/produto. |
| **Pendência Não Processada** | Verificar se o e-mail do Signup coincide exatamente com o e-mail do webhook. |

## 6. Regras de Ouro (Protocolo de Produção)
1. **PROIBIDO** corrigir manualmente `profiles.portal` via SQL; a correção deve vir via re-processamento ou ajuste de lógica.
2. **PROIBIDO** desabilitar triggers de sincronia de dados em produção.
3. **PROIBIDO** apagar logs de webhook; eles são a única evidência legal da transação.
4. **PROIBIDO** alterar mapeamentos (`offer_id`) sem revisão técnica e registro de mudança.
5. **OBRIGATÓRIO** registrar evidência (screenshot ou log) antes de qualquer intervenção técnica.
