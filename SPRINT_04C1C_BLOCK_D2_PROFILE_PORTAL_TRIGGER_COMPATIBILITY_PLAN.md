# SPRINT_04C1C_BLOCK_D2_PROFILE_PORTAL_TRIGGER_COMPATIBILITY_PLAN

## 1. Definição Completa da Trigger
- **Nome da Trigger**: `protect_profile_privileged_fields_trigger`
- **Tabela**: `public.profiles`
- **Timing**: `BEFORE`
- **Evento**: `UPDATE`
- **Função Executada**: `public.protect_profile_privileged_fields()`

## 2. Definição Completa da Função da Trigger
- **Código Atual**:
  ```sql
  BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
      NEW.role := OLD.role;
      NEW.portal := OLD.portal;
      NEW.access_status := OLD.access_status;
      NEW.subscription_status := OLD.subscription_status;
      NEW.access_expires_at := OLD.access_expires_at;
    END IF;
    RETURN NEW;
  END;
  ```
- **Campos Protegidos**: `role`, `portal`, `access_status`, `subscription_status`, `access_expires_at`.
- **Condições Permitidas**: A alteração só é persistida se `public.is_admin(auth.uid())` retornar `TRUE`.
- **Diferenciação de Contexto**: A função utiliza `auth.uid()`. Em chamadas via Edge Function (como o Webhook) que não utilizam o token de um administrador, ou em contextos de sistema onde o `auth.uid()` é nulo ou de um usuário comum, a trigger reverte os campos privilegiados para os valores antigos (`OLD`), impedindo a atualização. Ela não possui exceção explícita para `SECURITY DEFINER` ou processos internos de sistema.

## 3. Diagnóstico do Conflito
- **Ponto de Bloqueio**: O conflito ocorre no Passo 4 da RPC `process_webhook_subscription`:
  ```sql
  UPDATE profiles SET
    portal = _resolved_portal::portal_type,
    subscription_status = _subscription_status_profile,
    ...
  WHERE id = _user_id;
  ```
- **Erro Exato**: Não ocorre um erro de SQL (Exception), mas um **bloqueio silencioso de persistência**. A trigger substitui os novos valores (`NEW.portal`, etc) pelos valores anteriores (`OLD.portal`, etc) antes do `UPDATE` ser finalizado, resultando em dados inalterados no banco após a execução bem-sucedida da RPC.
- **Escopo do Bloqueio**: Bloqueia `portal`, `subscription_status` e `access_expires_at`. O campo `nome` não é protegido e seria atualizado normalmente.

## 4. Estratégias Possíveis

### Opção A — user_roles como fonte de verdade
- **Ação**: `process_webhook_subscription` atualiza apenas `user_roles.portal`.
- **Impacto**: O gating de acesso (Rls/Middleware) via `user_roles` funcionaria. No entanto, o `profiles.portal` ficaria dessincronizado, afetando componentes de UI que lêem o perfil do usuário para exibir o branding ou o contexto do portal atual.

### Opção B — permitir função autorizada (Recomendada)
- **Ação**: Ajustar a trigger `protect_profile_privileged_fields` para permitir atualizações quando o contexto da transação indicar que a origem é uma função de sistema confiável.
- **Mecanismo**: Utilizar `current_setting('app.internal_sync', true)` ou verificar se a alteração está sendo feita por uma função específica através de variáveis de sessão temporárias.

### Opção C — criar função dedicada
- **Ação**: Criar `internal_sync_profile_portal(user_id, portal, status)` como `SECURITY DEFINER`.
- **Mecanismo**: A trigger continuaria bloqueando updates diretos, mas permitiria se detectasse que o update partiu desta função específica (usando a mesma lógica de "contexto" da Opção B).

### Opção D — remover update de profiles.portal da RPC
- **Ação**: A RPC faz apenas o que é permitido.
- **Sincronização**: Um job posterior ou trigger em `subscriptions` (fora do contexto do usuário) faria a sincronização. Aumenta a complexidade e latência na atualização do portal.

## 5. Recomendação Técnica
**Opção B** é a mais equilibrada. 
- **Por que**: Mantém a lógica centralizada na trigger, mas adiciona inteligência para reconhecer processos legítimos do sistema (webhooks).
- **Segurança**: Garante que um usuário comum via API/Console não consiga alterar seu portal, mas permite que o fluxo de pagamento (Webhook -> RPC) complete a entrega do produto.
- **Auditoria**: A alteração continua sendo registrada, mas agora com sucesso funcional.

## 6. Próximo Teste Necessário (D.TEST-1-RETRY)
- **Cenário**: Executar a chamada RPC com a trigger ativa e as permissões de contexto ajustadas.
- **Critérios de Sucesso**: 
  1. `subscriptions` criada/atualizada.
  2. `profiles.portal` atualizado para o valor do mapeamento.
  3. `user_roles.portal` atualizado.
  4. Nenhuma desabilitação manual de trigger (`DISABLE TRIGGER`) durante o teste.

## 7. Proibições
- Não será permitido o uso de `ALTER TABLE profiles DISABLE TRIGGER ...`.
- Não será permitido o uso de `bypass` manual em produção ou teste.
- O plano proíbe a remoção das travas de segurança para usuários finais.
