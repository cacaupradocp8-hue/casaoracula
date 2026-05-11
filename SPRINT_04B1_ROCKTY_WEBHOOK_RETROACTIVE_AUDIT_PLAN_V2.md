# Sprint 04B.1: Auditoria Retroativa de Webhooks Rockty - V2

**Status:** Planejamento / Diagnóstico Revisado (Somente Leitura)
**Objetivo:** Mapeamento nominal profundo para identificar fallbacks incorretos e falhas de acesso na Formação Orácula e Clube nos últimos 12 meses.

---

## 1. Matriz de Referência (CTE de Mapeamento)
As consultas abaixo utilizam esta definição de "Verdade Esperada":

```sql
WITH expected_offers AS (
  SELECT 'karv9y4bewbdjcwbmvtwq' AS offer_id, 'clube_mensal' AS expected_plan_id, 'assinante' AS expected_portal, 'Clube Mensal' AS produto
  UNION ALL
  SELECT 'mayikrzz0kc58ijeqs9a', 'clube_mensal', 'assinante', 'Clube Mensal Legado/Possível Duplicado'
  UNION ALL
  SELECT '2tgmh6vsiki7fg0buxdfxq', 'clube_anual', 'assinante', 'Clube Anual'
  UNION ALL
  SELECT 'qqqmfhyjku7ou9kc70gg', 'formacao_oracula', 'aluna', 'Formação Orácula'
)
```

---

## 2. Estratégia de Diagnóstico (Queries SQL)

### 2.1 Resumo por offer_id (12 meses)
```sql
WITH expected_offers AS (
  SELECT 'karv9y4bewbdjcwbmvtwq' AS offer_id, 'clube_mensal' AS expected_plan_id, 'assinante' AS expected_portal, 'Clube Mensal' AS produto
  UNION ALL
  SELECT 'mayikrzz0kc58ijeqs9a', 'clube_mensal', 'assinante', 'Clube Mensal Legado/Possível Duplicado'
  UNION ALL
  SELECT '2tgmh6vsiki7fg0buxdfxq', 'clube_anual', 'assinante', 'Clube Anual'
  UNION ALL
  SELECT 'qqqmfhyjku7ou9kc70gg', 'formacao_oracula', 'aluna', 'Formação Orácula'
)
SELECT 
  w.payload->>'offer_id' as offer_id,
  e.produto as produto_esperado,
  COUNT(*) as total_eventos,
  MIN(w.created_at) as primeira_data,
  MAX(w.created_at) as ultima_data
FROM webhook_events w
LEFT JOIN expected_offers e ON (w.payload->>'offer_id') = e.offer_id
WHERE w.created_at > now() - interval '12 months'
GROUP BY 1, 2
ORDER BY 3 DESC;
```

### 2.2 Auditoria Nominal: Compras da Formação Orácula
```sql
WITH expected_offers AS (
  SELECT 'qqqmfhyjku7ou9kc70gg' AS offer_id, 'formacao_oracula' AS expected_plan_id, 'aluna' AS expected_portal, 'Formação Orácula' AS produto
)
SELECT 
  w.created_at as data,
  w.payload->>'email' as email,
  w.payload->>'offer_id' as offer_id,
  'Formação Orácula' as produto_esperado,
  s.plan_id as sub_plan_id,
  p.portal as current_portal,
  ur.role as current_role,
  w.payload->>'status' as status_pagamento,
  CASE 
    WHEN p.portal = 'aluna' THEN 'CORRETO'
    WHEN p.id IS NULL AND mp.id IS NOT NULL THEN 'PENDENTE (SEM CONTA)'
    WHEN p.portal IN ('assinante', 'clube_mensal', 'assinatura', 'clube_oracular', 'iniciada', 'visitante') THEN 'INCORRETO (FALLBACK)'
    WHEN p.id IS NULL AND mp.id IS NULL THEN 'ERRO (NÃO REGISTRADO)'
    ELSE 'SUSPEITO'
  END as classificacao
FROM webhook_events w
LEFT JOIN profiles p ON LOWER(w.payload->>'email') = LOWER(p.email)
LEFT JOIN subscriptions s ON p.id = s.user_id
LEFT JOIN user_roles ur ON p.id = ur.user_id
LEFT JOIN matriculas_pendentes mp ON LOWER(w.payload->>'email') = LOWER(mp.email)
WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg'
AND w.created_at > now() - interval '12 months'
ORDER BY w.created_at DESC;
```

### 2.3 Identificação de Fallbacks Indesejados
Busca compras da Formação que resultaram em acessos genéricos de Clube/Assinatura.
```sql
SELECT 
  w.created_at,
  w.payload->>'email' as email,
  p.portal,
  s.plan_id
FROM webhook_events w
JOIN profiles p ON LOWER(w.payload->>'email') = LOWER(p.email)
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg'
AND p.portal IN ('assinante', 'clube_mensal', 'assinatura', 'clube_oracular', 'iniciada', 'visitante');
```

### 2.4 Offer IDs Desconhecidos (Não mapeados na CTE)
```sql
WITH expected_offers AS (
  SELECT 'karv9y4bewbdjcwbmvtwq' AS offer_id UNION ALL
  SELECT 'mayikrzz0kc58ijeqs9a' UNION ALL
  SELECT '2tgmh6vsiki7fg0buxdfxq' UNION ALL
  SELECT 'qqqmfhyjku7ou9kc70gg'
)
SELECT 
  w.payload->>'offer_id' as unknown_offer_id,
  w.payload->>'product_name' as nome_rockty,
  COUNT(*) as total
FROM webhook_events w
LEFT JOIN expected_offers e ON (w.payload->>'offer_id') = e.offer_id
WHERE e.offer_id IS NULL 
AND w.created_at > now() - interval '12 months'
GROUP BY 1, 2;
```

### 2.5 Verificação de Compradoras sem Conta (Matrículas Pendentes)
```sql
SELECT 
  w.created_at,
  w.payload->>'email' as email,
  w.payload->>'offer_id' as offer_id,
  mp.id IS NOT NULL as em_matriculas_pendentes
FROM webhook_events w
LEFT JOIN profiles p ON LOWER(w.payload->>'email') = LOWER(p.email)
LEFT JOIN matriculas_pendentes mp ON LOWER(w.payload->>'email') = LOWER(mp.email)
WHERE p.id IS NULL
AND w.created_at > now() - interval '12 months';
```

---

## 3. Resumo Estatístico Final (Query de Consolidação)
```sql
WITH expected_offers AS (
  SELECT 'karv9y4bewbdjcwbmvtwq' AS offer_id, 'clube_mensal' AS expected_plan_id, 'assinante' AS expected_portal, 'Clube Mensal' AS produto
  UNION ALL
  SELECT 'mayikrzz0kc58ijeqs9a', 'clube_mensal', 'assinante', 'Clube Mensal Legado'
  UNION ALL
  SELECT '2tgmh6vsiki7fg0buxdfxq', 'clube_anual', 'assinante', 'Clube Anual'
  UNION ALL
  SELECT 'qqqmfhyjku7ou9kc70gg', 'formacao_oracula', 'aluna', 'Formação Orácula'
)
SELECT 
  COUNT(*) as total_eventos_rockty,
  COUNT(*) FILTER (WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg') as total_formacao,
  COUNT(*) FILTER (WHERE w.payload->>'offer_id' IN ('karv9y4bewbdjcwbmvtwq', 'mayikrzz0kc58ijeqs9a')) as total_clube_mensal,
  COUNT(*) FILTER (WHERE w.payload->>'offer_id' = '2tgmh6vsiki7fg0buxdfxq') as total_clube_anual,
  COUNT(*) FILTER (WHERE e.offer_id IS NULL) as total_desconhecido,
  COUNT(*) FILTER (WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg' AND p.portal = 'aluna') as formacao_correto,
  COUNT(*) FILTER (WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg' AND p.portal IN ('assinante', 'clube_mensal', 'assinatura', 'clube_oracular')) as formacao_fallback,
  COUNT(*) FILTER (WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg' AND p.id IS NULL) as formacao_sem_conta
FROM webhook_events w
LEFT JOIN expected_offers e ON (w.payload->>'offer_id') = e.offer_id
LEFT JOIN profiles p ON LOWER(w.payload->>'email') = LOWER(p.email)
WHERE w.created_at > now() - interval '12 months';
```

---

## 4. Regras de Não-Intervenção
- **NÃO** realizar UPDATE/DELETE.
- **NÃO** alterar o código das Edge Functions ou Auth.
- **NÃO** realizar alterações na Rockty.
- **APENAS DIAGNÓSTICO.**
