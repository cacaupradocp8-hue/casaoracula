# SPRINT_04C1C_BLOCK_D_PROCESS_WEBHOOK_SUBSCRIPTION_PLAN

**Versão:** 1.0  
**Status:** Planejamento  
**Objetivo:** Planejar a atualização segura da função `public.process_webhook_subscription` para usar o novo mapeamento Rockty (Bloco A) e preparar a transição para múltiplos planos por usuário sem sobrescrever assinaturas.

---

## 1. Backup da Função Atual

A função atual utiliza `ON CONFLICT (user_id, provider)`, o que impede múltiplos planos por provider e não valida mapeamentos de oferta.

### Assinatura Exata
`process_webhook_subscription(_user_id uuid, _provider text, _plan_id text, _status text, _portal text, _subscription_status_profile text, _current_period_start timestamptz, _current_period_end timestamptz, _next_billing_date timestamptz, _external_subscription_id text, _customer_name text DEFAULT NULL)`

### Definição Simplificada
- Faz um `UPSERT` em `subscriptions` baseado em `(user_id, provider)`.
- Atualiza `profiles` (portal e status).
- Atualiza `user_roles` (portal).

---

## 2. Diagnóstico da Chamada Atual (Rockty Webhook)

Baseado na definição da função e na arquitetura atual:
- **Parâmetros:** Recebe `_plan_id` (enviado pela Edge Function como o ID da oferta Rockty).
- **IDs Externos:** Recebe `_external_subscription_id` e `_user_id`.
- **Portal:** Atualmente o portal é passado como argumento (`_portal`), vindo pré-calculado pela Edge Function ou lógica anterior.
- **Risco:** Se o `_plan_id` for gravado direto na tabela `subscriptions` sem tradução, perdemos o ID interno do plano.

---

## 3. Problema Atual (Riscos)

1.  **Sobrescrita:** Ter um "Clube" e depois comprar "Formação" sobrescreve o registro do Clube devido ao `ON CONFLICT (user_id, provider)`.
2.  **Mapeamento Frágil:** Dependemos de quem chama a função passar o `_portal` correto. Se passar um `_plan_id` desconhecido, a função executa cegamente.
3.  **Invasão de Assinatura:** Não há checagem se o `_external_subscription_id` já pertence a outro usuário antes de associar.

---

## 4. Nova Lógica Proposta (Mapping-First)

A nova versão da função deve:
1.  **Resolver Mapping:** Usar `_plan_id` para buscar em `public.rockty_offer_mapping`.
2.  **Identificar Plano Interno:** Se mapeado, usar o `internal_plan_id` e `portal_destino` do mapeamento.
3.  **Filtro de Acesso:** Se não for mapeado e não for um "admin override", retornar erro e não liberar acesso.
4.  **Prioridade de Dados:** O portal vindo do mapeamento Rockty tem precedência sobre o parâmetro `_portal`.

---

## 5. Estratégia de Idempotência e Transição

**Recomendação: Opção D (Fase 1 - Segurança)**
- Manter `ON CONFLICT (user_id, provider)` temporariamente para garantir compatibilidade com a constraint antiga (Bloco C).
- A função passará a traduzir o `_plan_id` (Rockty Offer) para o `internal_plan_id` (Plans).
- **Importante:** Se o usuário já tiver um plano e comprar outro, nesta fase (D), o sistema ainda sobrescreverá o antigo devido à constraint do Bloco C. A liberação total (multi-plan) ocorrerá no Bloco D.1.

---

## 6. Proteção de ID Externo

- Adicionar verificação: Se `_external_subscription_id` já existir em `subscriptions` associado a um `user_id` diferente, a função deve retornar erro para evitar "sequestro" de assinaturas.

---

## 7. SQL Proposto (Para Revisão - Não Executar)

```sql
CREATE OR REPLACE FUNCTION public.process_webhook_subscription(
    _user_id uuid,
    _provider text,
    _plan_id text, -- Agora tratado como Rockty Offer ID
    _status text,
    _portal text,
    _subscription_status_profile text,
    _current_period_start timestamp with time zone,
    _current_period_end timestamp with time zone,
    _next_billing_date timestamp with time zone,
    _external_subscription_id text,
    _customer_name text DEFAULT NULL::text
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _sub_id uuid;
  _mapping record;
  _resolved_plan_id text;
  _resolved_portal text;
  _result jsonb;
BEGIN
  -- 1. Resolver Mapeamento Rockty
  SELECT * INTO _mapping 
  FROM public.rockty_offer_mapping 
  WHERE rockty_offer_id = _plan_id AND ativo = true;

  IF FOUND THEN
    _resolved_plan_id := _mapping.plan_id; -- internal_plan_id
    _resolved_portal := _mapping.portal_destino;
  ELSE
    -- Se não mapeado, mantém os originais mas marca para auditoria (ou falha)
    _resolved_plan_id := _plan_id;
    _resolved_portal := _portal;
    
    -- Se o provider for rockty e não houver mapeamento, podemos optar por bloquear
    IF _provider = 'rockty' THEN
       RETURN jsonb_build_object('error', 'Oferta Rockty não mapeada', 'offer_id', _plan_id);
    END IF;
  END IF;

  -- 2. Proteção contra duplicidade de external_subscription_id em usuários diferentes
  IF _external_subscription_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE external_subscription_id = _external_subscription_id 
      AND user_id != _user_id
    ) THEN
      RETURN jsonb_build_object('error', 'Assinatura externa já pertence a outro usuário', 'ext_id', _external_subscription_id);
    END IF;
  END IF;

  -- 3. Upsert Subscription (Ainda usando a constraint antiga para compatibilidade)
  INSERT INTO subscriptions (
    user_id, provider, plan_id, status, 
    current_period_start, current_period_end, next_billing_date, 
    external_subscription_id, last_event_at
  )
  VALUES (
    _user_id, _provider, _resolved_plan_id, _status, 
    _current_period_start, _current_period_end, _next_billing_date, 
    _external_subscription_id, now()
  )
  ON CONFLICT (user_id, provider) DO UPDATE SET
    plan_id = EXCLUDED.plan_id,
    status = EXCLUDED.status,
    current_period_start = COALESCE(EXCLUDED.current_period_start, subscriptions.current_period_start),
    current_period_end = COALESCE(EXCLUDED.current_period_end, subscriptions.current_period_end),
    next_billing_date = EXCLUDED.next_billing_date,
    external_subscription_id = COALESCE(EXCLUDED.external_subscription_id, subscriptions.external_subscription_id),
    last_event_at = now(),
    updated_at = now()
  RETURNING id INTO _sub_id;

  -- 4. Sync profiles
  UPDATE profiles SET
    portal = _resolved_portal::portal_type,
    subscription_status = _subscription_status_profile,
    nome = COALESCE(_customer_name, nome),
    updated_at = now()
  WHERE id = _user_id;

  -- 5. Sync user_roles
  UPDATE user_roles SET portal = _resolved_portal::portal_type
  WHERE user_id = _user_id;

  _result := jsonb_build_object(
    'subscription_id', _sub_id,
    'user_id', _user_id,
    'plan_id', _resolved_plan_id,
    'portal', _resolved_portal,
    'status', _status
  );

  RETURN _result;
END;
$function$;
```

---

## 8. Validações Futuras

1.  **Cenário Mapeado:** Chamar com `_plan_id = 'karv9y4bewbdjcwbmvtwq'` (Offer Rockty). Deve resultar em `plan_id = 'clube_mensal'` e `portal = 'assinante'`.
2.  **Cenário Desconhecido:** Chamar com `_plan_id = 'OFFER_INEXISTENTE'`. Deve retornar erro JSON e não alterar nada.
3.  **Cenário Conflito User:** Tentar usar um `external_subscription_id` que já existe para outro UUID. Deve retornar erro de segurança.

---
**Observação:** O Bloco D foca na inteligência de mapeamento. O Bloco D.1 removerá a trava de unicidade para permitir a coexistência real.
