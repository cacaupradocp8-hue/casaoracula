# Sprint 04B.1: Resultado da Auditoria Retroativa de Webhooks Rockty

**Status:** Diagnóstico Concluído
**Classificação:** SEM INDÍCIO DE PROBLEMA (Tabelas de Eventos Vazias)

---

## 1. Resumo por offer_id (Últimos 12 meses)
| offer_id | produto_esperado | total_eventos | primeira_data | ultima_data |
| :--- | :--- | :--- | :--- | :--- |
| - | - | 0 | - | - |

## 2. Resumo Estatístico Final
| Métrica | Valor |
| :--- | :--- |
| total_eventos_rockty | 0 |
| total_formacao | 0 |
| total_unknown_offer | 0 |
| formacao_correto | 0 |
| formacao_fallback_clube | 0 |
| total_sem_conta | 0 |

## 3. Lista Nominal da Formação Orácula
| data_webhook | email | offer_id | portal_atual | roles_atuais | plan_id_vinculado | data_assinatura | status_rockty | classificacao |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| - | - | - | - | - | - | - | - | - |

## 4. Possíveis Fallbacks para Formação
| data | email | portal | ultimo_plan_id |
| :--- | :--- | :--- | :--- |
| - | - | - | - |

## 5. Offer_ids Desconhecidos
| unknown_offer_id | nome_na_rockty | total_ocorrencias |
| :--- | :--- | :--- |
| - | - | 0 |

## 6. Compradoras sem Conta
| data | email | offer_id | em_matriculas_pendentes |
| :--- | :--- | :--- | :--- |
| - | - | - | - |

## 7. Comparação Subscriptions vs Profiles
| email | portal_atual | plano_ativo | portal_esperado |
| :--- | :--- | :--- | :--- |
| - | - | - | - |

---

## Notas do Diagnóstico
- As tabelas `webhook_events` e `subscriptions` estão atualmente vazias no banco de dados.
- O mapeamento de `profiles` mostra apenas 5 usuários, sendo 1 admin e 4 visitantes (alunas).
- Não há registros de eventos de compra processados nos últimos 12 meses nas tabelas auditadas.
- **Atenção:** Se as compras são processadas em outro ambiente ou se as tabelas de eventos foram limpas, o diagnóstico não pôde capturar dados históricos.
