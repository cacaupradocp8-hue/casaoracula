# SPRINT_04C1C_BLOCK_E_PENDING_MATRICULA_SIGNUP_FLOW_RESULT.md

## 1. Diagnóstico de apply_pending_matricula
A função `apply_pending_matricula()` foi auditada e apresenta as seguintes características:
- **Pontos Positivos**:
  - Utiliza `SECURITY DEFINER` e `search_path` seguro.
  - Verifica corretamente `processado = false` e filtra por `email`.
  - Vincula `curso_id` à tabela `matriculas`.
  - Atualiza `user_roles.portal` para o `portal_destino`.
- **Pontos de Incompatibilidade (Bloqueio)**:
  - **Falta mapping**: A função usa `pending.curso_id` diretamente em `matriculas`, ignorando o mapeamento via `rockty_offer_mapping` que foi padronizado na Sprint anterior.
  - **Falta Subscriptions**: Não há criação/atualização de registros na tabela `subscriptions` para refletir o acesso recorrente do Rockty.
  - **Falta Profiles Sync**: Atualiza apenas `user_roles.portal`, sem garantir a sincronização com `profiles.portal` via `system_sync_profile_access` (embora triggers de sistema possam existir, a função deveria seguir o caminho seguro explicitado).
  - **Segurança**: Não valida se o `portal_destino` em `matriculas_pendentes` é válido para o mapping da oferta, permitindo potencialmente acesso indevido se o dado pendente estiver corrompido ou for malicioso.

## 2. Compatível ou Não Compatível
**NÃO COMPATÍVEL**.

## 3. Teste Executado
Nenhum teste de signup foi executado para evitar estado inconsistente (matrícula sem subscription e mapping legado).

## 4. Resultado do Acesso
N/A (Bloqueado preventivamente).

## 5. Confirmação de Trigger Ativa
Confirmada: `on_auth_user_created_apply_matricula` ativa na tabela `users`.

## 6. Confirmação de nenhum bypass manual
Confirmado. Nenhuma alteração manual realizada.

## 7. Classificação Final
**BLOQUEADO**

---

### Patch Mínimo Sugerido (Conceitual)
```sql
-- Ajustar apply_pending_matricula para:
-- 1. Buscar portal e curso via rockty_offer_mapping usando pending.rockty_offer_id
-- 2. Criar registro em public.subscriptions
-- 3. Chamar system_sync_profile_access(NEW.id)
```
