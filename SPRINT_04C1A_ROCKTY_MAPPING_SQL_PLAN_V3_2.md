# SPRINT_04C1A_ROCKTY_MAPPING_SQL_PLAN_V3_2.md

## 1. Diagnóstico de Estrutura — aguardando aprovação final

### Status dos Plans Necessários
- `clube_mensal`: **NÃO EXISTE**. Será inserido via migration.
- `clube_anual`: **NÃO EXISTE**. Será inserido via migration.
- `formacao_oracula`: **NÃO EXISTE**. Será inserido via migration.

### Enums e Tipos
- `portal_type` detectados: `visitante`, `mentorada`, `aluna_formacao`, `assinante`, `oracula`, `pre_iniciada`, `iniciada`, `admin`, `aluna`.
- A proposta usará `portal_type` explicitamente na tabela de mapeamento.

### Divergências de Portal (Dry-run Preventivo)
- Encontrada divergência em 1 usuário: `afe12d58...` (Profile: `visitante` | Role: `assinante`).
- **Ação**: A migration garantirá a sincronização para `user_roles.portal` como fonte da verdade.

---

## 2. Matriz de Mapeamento Rockty (IDs Reais)

Tabela: `rockty_offer_mapping`

| rockty_offer_id (PK) | internal_plan_id (FK) | target_portal (portal_type) |
| :--- | :--- | :--- |
| `karv9y4bewbdjcwbmvtwq` | `clube_mensal` | `assinante` |
| `mayikrzz0kc58ijeqs9a` | `clube_mensal` | `assinante` |
| `2tgmh6vsiki7fg0buxdfxq` | `clube_anual` | `assinante` |
| `qqqmfhyjku7ou9kc70gg` | `formacao_oracula` | `aluna` |

*Nota: Conforme orientação estratégica, `formacao_oracula` libera portal `aluna`. O tipo `aluna_formacao` permanece no enum apenas para compatibilidade legada se necessário.*

---

## 3. Estrutura de Dados (DDL Conceitual)

### 3.1 Tabela de Mapeamento
```sql
CREATE TABLE public.rockty_offer_mapping (
    offer_id TEXT PRIMARY KEY,
    internal_plan_id TEXT NOT NULL REFERENCES public.plans(id),
    target_portal portal_type NOT NULL, -- Uso de enum conforme solicitado
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.2 Constraints em Subscriptions
- **Unique Composto**: `(user_id, provider, plan_id)` para evitar planos duplicados do mesmo provedor para o mesmo usuário.
- **Unique Parcial (External ID)**: `CREATE UNIQUE INDEX idx_subscriptions_external_id_provider ON public.subscriptions (provider, external_subscription_id) WHERE external_subscription_id IS NOT NULL;`
- **Impacto**: O dry-run (seção 6) verificará duplicatas existentes. Se houver, a migration falhará, exigindo limpeza manual.

---

## 4. Lógica de Negócio (Apply Pending)

A função `apply_pending_matricula` será atualizada para:
1. Buscar `offer_id` na `rockty_offer_mapping`.
2. Se **não encontrar** (ex: `TEST_UNKNOWN_OFFER`):
   - Registrar `processing_error` informando "Oferta não mapeada".
   - Manter status `pending`.
   - **NÃO** aplicar FK para plano inexistente.
3. Se **encontrar**:
   - Usar `target_portal` mapeado para atualizar `user_roles.portal` e `profiles.portal`.

---

## 5. Migration UP / DOWN (Conceitual)

### Ordem de Execução (UP)
1. Inserir `plans` faltantes (`clube_mensal`, `clube_anual`, `formacao_oracula`).
2. Criar tabela `rockty_offer_mapping`.
3. Popular `rockty_offer_mapping` com IDs reais.
4. Criar as `UNIQUE` constraints em `subscriptions`.
5. Substituir a trigger/função `apply_pending_matricula` pela versão com mapeamento.
6. Rodar script de sincronização `profiles.portal = user_roles.portal`.

### Rollback (DOWN)
1. Dropar tabela `rockty_offer_mapping`.
2. Remover índices `UNIQUE` criados em `subscriptions`.
3. Restaurar a função `apply_pending_matricula` anterior (o SQL da versão anterior será preservado no comentário da migration).
4. *Opcional*: Remover planos inseridos (apenas se não houver registros vinculados).

---

## 6. Plano de Dry-run Detalhado

Antes da execução real, este script será validado contra os seguintes cenários:

1.  **Registros TEST_ existentes**:
    - `T01, T04, T05`: Devem ser processados com sucesso pois usam ofertas da matriz.
    - `TEST_UNKNOWN_OFFER`: Deve gerar erro de mapeamento e permanecer pendente.
2.  **Duplicatas em Subscriptions**:
    - Query de validação: `SELECT provider, external_subscription_id FROM subscriptions WHERE external_subscription_id IS NOT NULL GROUP BY 1, 2 HAVING COUNT(*) > 1`.
    - Se retornar algo, a criação do índice falhará.
3.  **Divergência de Portais**:
    - Usuário `afe12d58...` será corrigido para `assinante` no profile.

---

## 7. Riscos e Mitigações

- **Risco**: `external_subscription_id` nulo em assinaturas legadas. 
  - **Mitigação**: O índice parcial ignora nulos, permitindo coexistência de registros antigos sem ID externo.
- **Risco**: Cadastro de nova oferta na Rockty sem atualização no mapping.
  - **Mitigação**: A lógica `UNKNOWN_OFFER` captura o erro no log e mantém a pendência visível para ação manual.
- **Risco**: Conflito de FK se o plano for deletado.
  - **Mitigação**: `REFERENCES public.plans(id)` impede a deleção do plano se houver mapeamento.

---

## 8. Critérios de Aprovação

1. Nenhuma linha de SQL será executada sem aprovação deste documento.
2. O SQL final conterá os comandos `INSERT` para os planos `clube_...`.
3. A sincronia entre tabelas de portal será garantida.
4. O tratamento de erro para ofertas desconhecidas será explícito.
