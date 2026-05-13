# SPRINT_04C1C_MAPPING_VERIFICATION_BEFORE_D_TEST1.md

## 1. Objetivo
Verificar o estado atual da tabela `public.rockty_offer_mapping` antes da execução do plano `D.TEST-1`.

## 2. Diagnóstico (Executado via SELECT)
A consulta foi realizada para identificar a divergência entre o estado atual do banco e os requisitos do Bloco A.

| rockty_offer_id | internal_plan_id | portal_destino | Status |
| :--- | :--- | :--- | :--- |
| karv9y4bewbdjcwbmvtwq | clube_mensal | **aluna** | ❌ DIVERGENTE (Esperado: assinante) |
| qqqmfhyjku7ou9kc70gg | formacao_oracula | aluna | ✅ CORRETO |
| mayikrzz0kc58ijeqs9a | (não encontrado) | (não encontrado) | ❌ AUSENTE |
| 2tgmh6vsiki7fg0buxdfxq | (não encontrado) | (não encontrado) | ❌ AUSENTE |

## 3. Conclusão do Diagnóstico
- **Divergência Crítica:** O mapeamento para a oferta `karv9y4bewbdjcwbmvtwq` (Clube Mensal) está apontando para o portal `aluna` em vez de `assinante`.
- **Mapeamentos Faltantes:** As ofertas `mayikrzz0kc58ijeqs9a` e `2tgmh6vsiki7fg0buxdfxq` não constam na tabela atual.

---
**Apenas diagnóstico.** Nenhuma alteração (UPDATE/INSERT) foi realizada.
