# SPRINT_04C1C_MAPPING_DRIFT_AUDIT.md

## 1. Schema Real da Tabela `rockty_offer_mapping`
| column_name | data_type | is_nullable |
| :--- | :--- | :--- |
| rockty_offer_id | text | NO |
| plan_id | text | NO |
| portal_destino | USER-DEFINED | NO |
| produto_nome | text | YES |
| duracao_dias | integer | NO |
| ativo | boolean | YES |
| created_at | timestamp with time zone | YES |
| updated_at | timestamp with time zone | YES |

## 2. Conteúdo Completo da Tabela
| rockty_offer_id | plan_id | portal_destino | produto_nome | duracao_dias | ativo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 868p01mow95v31b8162 | clube_anual | aluna | Clube Orácula - Anual | 365 | true |
| karv9y4bewbdjcwbmvtwq | clube_mensal | aluna | Clube Orácula - Mensal | 30 | true |
| qqqmfhyjku7ou9kc70gg | formacao_oracula | aluna | Formação Orácula | 365 | true |
| uivtq6x6v718hymvlyyvfw | clube_anual | aluna | Clube Orácula - Anual | 365 | true |

## 3. Verificação da Matriz Oficial (Drift)
| rockty_offer_id | Plan ID (Real) | Portal (Real) | Status |
| :--- | :--- | :--- | :--- |
| karv9y4bewbdjcwbmvtwq | clube_mensal | **aluna** | ❌ DIVERGENTE (Esperado: assinante) |
| mayikrzz0kc58ijeqs9a | (ausente) | (ausente) | ❌ AUSENTE |
| 2tgmh6vsiki7fg0buxdfxq | (ausente) | (ausente) | ❌ AUSENTE |
| qqqmfhyjku7ou9kc70gg | formacao_oracula | aluna | ✅ CORRETO |

## 4. Contagem Total
- Total de registros em `rockty_offer_mapping`: 4

## 5. Colunas Alternativas
- Colunas identificadas: `portal_destino`, `plan_id`, `produto_nome`.

## 6. Tabelas Semelhantes/Relacionadas
- `public.rockty_offer_mapping`
- `public.plan_mappings` (Relation does not exist - verificado em erro anterior)

## 7. Planos (Tabela `public.plans`)
| id | nome | portal_resultante | ativo |
| :--- | :--- | :--- | :--- |
| clube_anual | Clube Orácula - Anual | **aluna** | true |
| clube_mensal | Clube Orácula - Mensal | **aluna** | true |
| formacao_oracula | Formação Orácula | aluna | true |

**Nota:** Os próprios planos na tabela `plans` estão configurados com `portal_resultante = aluna`.

## 8. Classificação Final
**BLOCO A APLICADO PARCIALMENTE / COM DIVERGÊNCIA DE PORTAL**

**Conclusão:** O Bloco A foi executado, mas há um drift nos dados:
1. O portal configurado tanto em `rockty_offer_mapping` quanto na tabela base `plans` para o Clube (Mensal/Anual) é `aluna`, contrariando a matriz que exige `assinante`.
2. Duas ofertas aprovadas (`mayikrzz0kc58ijeqs9a` e `2tgmh6vsiki7fg0buxdfxq`) não estão presentes.

---
**Apenas diagnóstico. Nenhuma alteração realizada.**
