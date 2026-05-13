# SPRINT_04C1C_BLOCK_D2A_SECURE_PROFILE_SYNC_FUNCTION_PLAN

Este plano detalha a implementação de uma camada de segurança robusta para a sincronização de perfis durante o processamento de webhooks de assinatura, resolvendo o conflito com a trigger de proteção sem comprometer a integridade do sistema.

## 1. Código Atual (Referência)

### Trigger Function: `protect_profile_privileged_fields`
```sql
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;
```

### Trigger: `protect_profile_privileged_fields_trigger`
```sql
CREATE TRIGGER protect_profile_privileged_fields_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_privileged_fields();
```

## 2. SQL Proposto

### A. Atualizar Trigger de Proteção
Permite a atualização se for admin OU se a variável de sessão `app.system_process` estiver definida como 'true'.

```sql
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Permite se for admin OU se for um processo de sistema verificado
  IF public.is_admin(auth.uid()) OR current_setting('app.system_process', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- Bloqueio para usuários comuns
  NEW.role := OLD.role;
  NEW.portal := OLD.portal;
  NEW.access_status := OLD.access_status;
  NEW.subscription_status := OLD.subscription_status;
  NEW.access_expires_at := OLD.access_expires_at;
  
  RETURN NEW;
END;
$function$;
```

### B. Criar Função de Sincronização Segura
Função interna para realizar o update com contexto de sistema.

```sql
CREATE OR REPLACE FUNCTION public.system_sync_profile_access(
    _user_id uuid,
    _portal portal_type,
    _sub_status text,
    _expires_at timestamp with time zone,
    _customer_name text
)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Define o contexto de sistema apenas para esta transação local
  PERFORM set_config('app.system_process', 'true', true);

  UPDATE public.profiles SET
    portal = _portal,
    subscription_status = _sub_status,
    access_expires_at = _expires_at,
    nome = COALESCE(_customer_name, nome),
    updated_at = now()
  WHERE id = _user_id;

  -- O contexto 'app.system_process' será resetado automaticamente ao fim da transação
END;
$function$;

-- Revogar permissões para garantir que apenas funções internas possam chamar
REVOKE EXECUTE ON FUNCTION public.system_sync_profile_access FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.system_sync_profile_access FROM anon;
REVOKE EXECUTE ON FUNCTION public.system_sync_profile_access FROM authenticated;
```

### C. Atualizar `process_webhook_subscription`
Modificar para chamar a nova função segura.

```sql
-- No passo 4 da função process_webhook_subscription:
-- Em vez do UPDATE direto em profiles, usar:
PERFORM public.system_sync_profile_access(
    _user_id,
    _resolved_portal::portal_type,
    _subscription_status_profile,
    CASE WHEN _status = 'active' THEN NULL ELSE access_expires_at END,
    _customer_name
);
```

## 3. Garantias de Segurança
- **Isolamento**: `current_setting('app.system_process', true)` só retorna 'true' se for explicitamente definido via `set_config`.
- **Transacional**: O terceiro parâmetro `true` em `set_config` garante que a configuração vale apenas para a transação atual.
- **Controle de Acesso**: O `REVOKE EXECUTE` impede que qualquer usuário (logado ou não) chame a função de sincronização via API/RPC. Apenas funções `SECURITY DEFINER` do próprio banco (como o webhook) podem executá-la.
- **Proteção Ativa**: A trigger continua bloqueando qualquer tentativa manual de `UPDATE profiles SET portal = ...` vinda de clientes Supabase.

## 4. Validações
1. **Bloqueio Manual**: Tentar `UPDATE profiles SET portal = 'assinante' WHERE id = 'meu-id'` via console/SQL com usuário não-admin. Deve ser ignorado pela trigger.
2. **Sucesso via Webhook**: Chamar `process_webhook_subscription` (RPC). Deve atualizar o portal com sucesso devido ao contexto de sistema.
3. **Integridade User Roles**: Confirmar que `user_roles` continua sendo atualizado normalmente.
4. **Trigger Enabled**: Verificar que em nenhum momento a trigger foi desabilitada.

## 5. Plano de Teste (Repetição D.TEST-1)
Repetir o teste Rockty de criação de assinatura:
- **Input**: Payload de pagamento aprovado.
- **Resultado Esperado**:
  - `subscriptions` criada com `plan_id = clube_mensal`.
  - `user_roles.portal` = `assinante`.
  - `profiles.portal` = `assinante`.
  - `profiles.subscription_status` = `active`.
  - **Zero bypass manual** e **Trigger sempre ativa**.

## 6. Proibições
- **Não** executar as alterações SQL ainda.
- **Não** alterar funções ou triggers sem autorização explícita pós-revisão deste plano.
- **Não** rodar testes de escrita.
- **Não** remover `subscriptions_user_provider_unique`.
- **Não** publicar.
