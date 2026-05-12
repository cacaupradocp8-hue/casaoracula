# SPRINT_04C1A_ROCKTY_MAPPING_SQL_PLAN.md

**Status:** Planejamento Técnico (Aguardando Revisão)
**Data:** 2026-05-12
**Objetivo:** Desenhar a implementação da tabela `rockty_offer_mapping` e a correção do fluxo de ativação de pendências.

## 1. Estrutura Atual Exata

### Tabelas Envolvidas
*   **`matriculas_pendentes`**:
    *   `email` (text), `curso_id` (text - recebe offer_id), `portal_destino` (portal_type), `processado` (bool).
*   **`matriculas`**:
    *   `user_id` (uuid), `curso_id` (text - recebe plan_id interno), `ativa` (bool).
*   **`subscriptions`**:
    *   `user_id` (uuid), `plan_id` (text), `status` (text), `provider` (text), `external_subscription_id` (text).
*   **`plans`**:
    *   `id` (text - PK), `nome` (text), `portal_resultante` (portal_type).
    *   *Nota: Atualmente os IDs em `plans` são `fundadora`, `mentoria`, `assinatura`.*

### Trigger e Função Atual
*   **Trigger**: `on_auth_user_created_apply_matricula` (AFTER INSERT ON `auth.users`).
*   **Função**: `apply_pending_matricula()`.
*   **Lógica Atual**: Copia `curso_id` de `matriculas_pendentes` para `matriculas` sem tradução.

## 2. Nova Tabela Proposta: `rockty_offer_mapping`

```sql
CREATE TABLE public.rockty_offer_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rockty_offer_id text UNIQUE NOT NULL, -- ID que vem no payload da Rockty
  internal_plan_id text NOT NULL,        -- ID correspondente em public.plans
  portal_destino portal_type NOT NULL,   -- Portal a ser liberado
  produto_nome text NOT NULL,            -- Nome legível para auditoria
  duracao_dias integer,                  -- Opcional: para cálculo de expiração
  ativo boolean DEFAULT true,
  is_test boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_plan_id FOREIGN KEY (internal_plan_id) REFERENCES public.plans(id) ON UPDATE CASCADE
);
```

## 3. Dados Iniciais (Seed)

| Rockty Offer ID | Plan ID Interno | Portal Destino | Produto Nome |
| :--- | :--- | :--- | :--- |
| `karv9y4bewbdjcwbmvtwq` | `assinatura` | `assinante` | Clube Oracular Mensal |
| `mayikrzz0kc58ijeqs9a` | `assinatura` | `assinante` | Clube Oracular Mensal (Legado) |
| `2tgmh6vsiki7fg0buxdfxq` | `assinatura` | `assinante` | Clube Oracular Anual |
| `qqqmfhyjku7ou9kc70gg` | `fundadora` | `aluna` | Formação Orácula |

## 4. Alteração em `matriculas_pendentes`

Propomos a adição de campos para clareza, mantendo `curso_id` por compatibilidade:
*   `rockty_offer_id`: Armazena o ID bruto recebido.
*   `plan_id`: Armazena o ID interno mapeado no momento do webhook (opcional, mas recomendado para performance).

## 5. Correção da Função `apply_pending_matricula`

A nova lógica da função deverá:
1.  Buscar em `rockty_offer_mapping` usando o `curso_id` (ou `rockty_offer_id`) da pendência.
2.  Se encontrar mapeamento ativo:
    *   Inserir em `matriculas` usando `mapping.internal_plan_id`.
    *   Atualizar `user_roles.portal` para `mapping.portal_destino`.
    *   **NOVIDADE**: Inserir/Upsert em `subscriptions` com `status = 'active'`, `provider = 'rockty'`, calculando `current_period_end` se houver `duracao_dias`.
3.  Se não encontrar:
    *   Não insere matrícula nem altera portal.
    *   Loga erro em `webhook_logs` (ou campo de observação na pendência).

## 6. Estratégia para `subscriptions`

Ao ativar uma pendência:
*   **`user_id`**: O ID do novo usuário criado.
*   **`plan_id`**: O `internal_plan_id` do mapeamento.
*   **`status`**: 'active'.
*   **`current_period_start`**: `now()`.
*   **`current_period_end`**: `now() + interval '30 days'` (mensal) ou `interval '365 days'` (anual).

## 7. Migration UP (Esboço SQL)

```sql
-- 1. Criar tabela de mapeamento
CREATE TABLE IF NOT EXISTS public.rockty_offer_mapping (...);

-- 2. Popular mapeamentos reais
INSERT INTO public.rockty_offer_mapping (rockty_offer_id, internal_plan_id, portal_destino, produto_nome)
VALUES 
('karv9y4bewbdjcwbmvtwq', 'assinatura', 'assinante', 'Clube Oracular Mensal'),
('2tgmh6vsiki7fg0buxdfxq', 'assinatura', 'assinante', 'Clube Oracular Anual'),
('qqqmfhyjku7ou9kc70gg', 'fundadora', 'aluna', 'Formação Orácula')
ON CONFLICT (rockty_offer_id) DO NOTHING;

-- 3. Atualizar Função de Ativação
CREATE OR REPLACE FUNCTION public.apply_pending_matricula() ...
-- (Lógica detalhada com JOIN em rockty_offer_mapping)
```

## 8. Dry-Run (Simulação)

```sql
-- Query para verificar o que aconteceria com os registros TEST_ atuais
SELECT 
  mp.email, 
  mp.curso_id as raw_offer_id,
  m.internal_plan_id,
  m.portal_destino as target_portal
FROM public.matriculas_pendentes mp
LEFT JOIN public.rockty_offer_mapping m ON mp.curso_id = m.rockty_offer_id
WHERE mp.email LIKE '%test%' OR mp.curso_id LIKE 'TEST_%';
```

## 9. Riscos e Mitigação

*   **Risco**: Trigger falhar e impedir o Sign Up (Erro 500 no cadastro).
*   **Mitigação**: Usar blocos `BEGIN...EXCEPTION` na função PL/pgSQL para que falhas de mapeamento não travem a criação do usuário (apenas não liberem o acesso).
*   **Risco**: Duplicidade.
*   **Mitigação**: Garantir que `subscriptions` e `matriculas` usem `ON CONFLICT` corretamente.

## 10. Próximos Passos

Após sua revisão e aprovação deste plano:
1.  Geraremos o script SQL final (Migration UP).
2.  Executaremos a criação da infraestrutura.
3.  Ajustaremos o código da Edge Function `rockty-webhook`.
4.  Reiniciaremos os testes T01-T05 com a nova arquitetura.
