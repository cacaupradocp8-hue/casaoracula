# SPRINT_04C1C_BLOCK_B1_PENDING_MATRICULAS_BACKFILL_PLAN

**Versão:** 1.0  
**Status:** Planejamento (Aguardando Autorização)  
**Objetivo:** Realizar o backfill controlado das pendências existentes na tabela `public.matriculas_pendentes`, preenchendo as colunas de auditoria (Bloco B) com base no mapeamento da Rockty (Bloco A).

---

## 1. Diagnóstico das 3 Pendências Atuais

Extraído em: 2026-05-13

| ID (short) | Email | curso_id | produto_rockty | rockty_offer_id | plan_id | Status | Processado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `e006e86c` | compradora.inexistente@... | `karv9y...` | `karv9y...` | `null` | `null` | `pending` | `false` |
| `ca47f076` | teste.desconhecido+01@... | `TEST_UNKNOWN...` | `TEST_UNKNOWN...` | `null` | `null` | `pending` | `false` |
| `1f7bdcfc` | teste.mensal+01@... | `karv9y...` | `karv9y...` | `null` | `null` | `pending` | `false` |

---

## 2. Classificação das Pendências

1.  **ID `e006e86c`**: **OFICIAL_MAPEAVEL**. O `curso_id` (`karv9y4bewbdjcwbmvtwq`) existe no mapeamento como Clube Mensal.
2.  **ID `ca47f076`**: **TEST_UNKNOWN_OFFER**. Oferta de teste intencional não mapeada.
3.  **ID `1f7bdcfc`**: **OFICIAL_MAPEAVEL**. O `curso_id` (`karv9y4bewbdjcwbmvtwq`) existe no mapeamento como Clube Mensal.

---

## 3. Dry-run do Backfill (Simulação de Valores Futuros)

| ID | Valor Futuro: `rockty_offer_id` | Valor Futuro: `plan_id` | Valor Futuro: `processing_status` | Valor Futuro: `processing_error` |
| :--- | :--- | :--- | :--- | :--- |
| `e006e86c` | `karv9y4bewbdjcwbmvtwq` | `clube_mensal` | `pending` | `null` |
| `ca47f076` | `TEST_UNKNOWN_OFFER` | `null` | `unmapped` | `'Oferta não mapeada'` |
| `1f7bdcfc` | `karv9y4bewbdjcwbmvtwq` | `clube_mensal` | `pending` | `null` |

---

## 4. Regras de Backfill Propostas

1.  **Prioridade 1 (Mapeado):** Se `curso_id` ou `produto_rockty` existir em `public.rockty_offer_mapping`, preenchemos as colunas de auditoria mantendo o status `pending`.
2.  **Prioridade 2 (Teste Conhecido):** Se for `TEST_UNKNOWN_OFFER`, preenchemos o `rockty_offer_id`, mas marcamos como `unmapped` com erro descritivo.
3.  **Prioridade 3 (Default/Desconhecido):** Qualquer registro que não caia nas regras acima será marcado como `unmapped` com erro `'Oferta desconhecida para revisão manual'`.

---

## 5. SQL Proposto (Não Executar Ainda)

### Parte A: Dry-run Query
```sql
SELECT 
    m.id,
    m.curso_id,
    rom.rockty_offer_id as matched_offer,
    rom.plan_id as matched_plan,
    CASE 
        WHEN rom.rockty_offer_id IS NOT NULL THEN 'pending'
        WHEN m.curso_id = 'TEST_UNKNOWN_OFFER' THEN 'unmapped'
        ELSE 'unmapped'
    END as future_status
FROM public.matriculas_pendentes m
LEFT JOIN public.rockty_offer_mapping rom ON (m.curso_id = rom.rockty_offer_id OR m.produto_rockty = rom.rockty_offer_id);
```

### Parte B: UPDATE Idempotente
```sql
BEGIN;

-- 1. Backfill para Mapeados
UPDATE public.matriculas_pendentes m
SET 
    rockty_offer_id = rom.rockty_offer_id,
    plan_id = rom.plan_id,
    processing_status = 'pending',
    processing_error = NULL
FROM public.rockty_offer_mapping rom
WHERE (m.curso_id = rom.rockty_offer_id OR m.produto_rockty = rom.rockty_offer_id)
AND m.processado = false;

-- 2. Backfill para TEST_UNKNOWN_OFFER
UPDATE public.matriculas_pendentes
SET 
    rockty_offer_id = 'TEST_UNKNOWN_OFFER',
    processing_status = 'unmapped',
    processing_error = 'Oferta não mapeada'
WHERE (curso_id = 'TEST_UNKNOWN_OFFER' OR produto_rockty = 'TEST_UNKNOWN_OFFER')
AND processado = false;

-- 3. Backfill para Desconhecidos (Fallback)
UPDATE public.matriculas_pendentes
SET 
    processing_status = 'unmapped',
    processing_error = 'Oferta desconhecida para revisão manual'
WHERE processing_status = 'pending' 
AND rockty_offer_id IS NULL
AND processado = false;

COMMIT;
```

---

## 6. Validações Pós-Backfill

- Total de pendências (`processado = false`): Deve permanecer 3.
- `rockty_offer_id` preenchido: Deve ser 3.
- `plan_id` preenchido: Deve ser 2 (os mapeados).
- `processing_status = 'pending'`: Deve ser 2.
- `processing_status = 'unmapped'`: Deve ser 1.
- Nenhuma alteração em `profiles`, `user_roles` ou `subscriptions`.

---

## 7. Riscos e Mitigações

- **Preencher offer_id errado**: Mitigado pelo join direto com `rockty_offer_mapping`.
- **Marcar como processado por engano**: Proibido explicitamente no script (não há `processado = true`).
- **Alteração colateral**: O uso de `BEGIN/COMMIT` e filtros rigorosos (`processado = false`) garante o escopo.

---
**Regras Mantidas:** Nenhuma função ou trigger será alterada. Nenhuma matrícula será gerada.
