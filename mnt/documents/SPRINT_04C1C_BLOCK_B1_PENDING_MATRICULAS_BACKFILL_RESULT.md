# SPRINT_04C1C_BLOCK_B1_PENDING_MATRICULAS_BACKFILL_RESULT

**Data da Execução:** 2026-05-13  
**Status Final:** SUCESSO

---

## 1. Resultado do Dry-Run (Antes da Execução)
O dry-run confirmou a classificação correta das 3 pendências:
- 2 registros mapeáveis para `clube_mensal`.
- 1 registro identificado como `TEST_UNKNOWN_OFFER`.

---

## 2. Impacto dos UPDATEs
- **Mapeadas (OFICIAL_MAPEAVEL):** 2 linhas afetadas.
- **TEST_UNKNOWN_OFFER:** 1 linha afetada.
- **Desconhecidas (Fallback):** 0 linhas afetadas (todas caíram nos critérios acima).

---

## 3. Resultado Final das 3 Pendências
| ID | Email | curso_id | rockty_offer_id | plan_id | Status | Erro | Processado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `e006e86c` | compradora.inexistente@... | `karv9y...` | `karv9y...` | `clube_mensal` | `pending` | `null` | `false` |
| `ca47f076` | teste.desconhecido+01@... | `TEST_UNKNOWN...` | `TEST_UNKNOWN_OFFER` | `null` | `unmapped` | `Oferta não mapeada` | `false` |
| `1f7bdcfc` | teste.mensal+01@... | `karv9y...` | `karv9y...` | `clube_mensal` | `pending` | `null` | `false` |

---

## 4. Validações Pós-Backfill
- **Total de pendências:** 3 (Conforme esperado)
- **Total com rockty_offer_id preenchido:** 3 (Conforme esperado)
- **Total com plan_id preenchido:** 2 (Conforme esperado)
- **Total Pending:** 2 (Conforme esperado)
- **Total Unmapped:** 1 (Conforme esperado)
- **Total Processado = false:** 3 (Conforme esperado)
- **Subscriptions:** Inalterada (0)
- **Profiles:** Inalterada (5)
- **User Roles:** Inalterada (5)

---

## 5. Confirmação de Segurança
Certifico que **NÃO** foram alterados:
- [x] Funções (`apply_pending_matricula`, etc)
- [x] Triggers
- [x] Webhooks
- [x] Portais de destino
- [x] Tabelas de acesso (`profiles`, `user_roles`)

---
**Bloco B.1 finalizado.** Aguardando nova autorização para os próximos passos.
