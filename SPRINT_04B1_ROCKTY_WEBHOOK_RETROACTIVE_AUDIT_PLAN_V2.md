# Sprint 04B.1: Auditoria Retroativa de Webhooks Rockty - V2 (Revisado)

**Status:** Planejamento / Diagnóstico (Somente Leitura)
**Objetivo:** Diagnóstico profundo e nominal de acessos Rockty nos últimos 12 meses, focando em fallbacks e na Formação Orácula.

---

## 1. Matriz de Referência (CTE de Mapeamento)

```sql
WITH expected_offers AS (
  SELECT 'karv9y4bewbdjcwbmvtwq' AS offer_id, 'clube_mensal' AS expected_plan_id, 'assinante' AS expected_portal, 'Clube Mensal' AS produto
  UNION ALL
  SELECT 'mayikrzz0kc58ijeqs9a', 'clube_mensal', 'assinante', 'Clube Mensal Legado/Duplicado'
  UNION ALL
  SELECT '2tgmh6vsiki7fg0buxdfxq', 'clube_anual', 'assinante', 'Clube Anual'
  UNION ALL
  SELECT 'qqqmfhyjku7ou9kc70gg', 'formacao_oracula', 'aluna', 'Formação Orácula'
)
```

---

## 2. Queries de Diagnóstico (Apenas SELECT)

### 2.1 Resumo por offer_id (12 meses)
```sql
WITH expected_offers AS (
  -- ... (CTE acima)
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

### 2.2 Auditoria Nominal: Formação Orácula (Sem Duplicidade)
Utiliza agregação para evitar duplicidade de `user_roles` e subquery lateral para pegar a `subscription` mais próxima/recente.

```sql
WITH expected_offers AS (
  SELECT 'qqqmfhyjku7ou9kc70gg' AS offer_id, 'formacao_oracula' AS expected_plan_id, 'aluna' AS expected_portal, 'Formação Orácula' AS produto
)
SELECT 
  w.created_at as data_webhook,
  w.payload->>'email' as email,
  w.payload->>'offer_id' as offer_id,
  p.portal as portal_atual,
  (SELECT string_agg(role, ', ') FROM user_roles ur WHERE ur.user_id = p.id) as roles_atuais,
  s.plan_id as plan_id_vinculado,
  s.created_at as data_assinatura,
  w.payload->>'status' as status_rockty,
  CASE 
    WHEN p.portal = 'aluna' THEN 'CORRETO'
    WHEN p.id IS NULL AND mp.id IS NOT NULL THEN 'PENDENTE_SEM_CONTA'
    WHEN p.portal IN ('assinante', 'clube_mensal', 'clube_oracular', 'assinatura') THEN 'INCORRETO_FALLBACK_CLUBE'
    WHEN p.portal = 'visitante' THEN 'INCORRETO_PORTAL_VISITANTE'
    WHEN p.id IS NOT NULL AND s.id IS NULL THEN 'SUSPEITO_SEM_SUBSCRIPTION'
    WHEN (SELECT count(*) FROM subscriptions s2 WHERE s2.user_id = p.id AND s2.status = 'active') > 1 THEN 'SUSPEITO_MULTIPLAS_SUBSCRIPTIONS'
    ELSE 'OUTRO_STATUS'
  END as classificacao
FROM webhook_events w
LEFT JOIN profiles p ON LOWER(w.payload->>'email') = LOWER(p.email)
LEFT JOIN LATERAL (
  SELECT id, plan_id, created_at 
  FROM subscriptions 
  WHERE user_id = p.id 
  ORDER BY ABS(EXTRACT(EPOCH FROM (created_at - w.created_at))) ASC 
  LIMIT 1
) s ON true
LEFT JOIN matriculas_pendentes mp ON LOWER(w.payload->>'email') = LOWER(mp.email)
WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg'
AND w.created_at > now() - interval '12 months'
ORDER BY w.created_at DESC;
```

### 2.3 Detecção de Fallbacks Indesejados (Formação -> Clube/Visitante)
```sql
SELECT 
  w.created_at,
  w.payload->>'email' as email,
  p.portal,
  (SELECT plan_id FROM subscriptions s WHERE s.user_id = p.id ORDER BY created_at DESC LIMIT 1) as ultimo_plan_id
FROM webhook_events w
JOIN profiles p ON LOWER(w.payload->>'email') = LOWER(p.email)
WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg'
AND p.portal IN ('assinante', 'clube_mensal', 'assinatura', 'clube_oracular', 'iniciada', 'visitante');
```

### 2.4 Offer IDs Desconhecidos (Unknown Offer)
```sql
WITH expected_offers AS (
  SELECT 'karv9y4bewbdjcwbmvtwq' AS id UNION ALL
  SELECT 'mayikrzz0kc58ijeqs9a' UNION ALL
  SELECT '2tgmh6vsiki7fg0buxdfxq' UNION ALL
  SELECT 'qqqmfhyjku7ou9kc70gg'
)
SELECT 
  w.payload->>'offer_id' as unknown_offer_id,
  w.payload->>'product_name' as nome_na_rockty,
  COUNT(*) as total_ocorrencias
FROM webhook_events w
LEFT JOIN expected_offers e ON (w.payload->>'offer_id') = e.id
WHERE e.id IS NULL 
AND w.created_at > now() - interval '12 months'
GROUP BY 1, 2
ORDER BY 3 DESC;
```

### 2.5 Compradoras sem Conta (Verificação de Matrículas Pendentes)
```sql
SELECT 
  w.created_at,
  w.payload->>'email' as email,
  w.payload->>'offer_id' as offer_id,
  CASE WHEN mp.id IS NOT NULL THEN 'SIM' ELSE 'NAO' END as em_matriculas_pendentes
FROM webhook_events w
LEFT JOIN profiles p ON LOWER(w.payload->>'email') = LOWER(p.email)
LEFT JOIN matriculas_pendentes mp ON LOWER(w.payload->>'email') = LOWER(mp.email)
WHERE p.id IS NULL
AND w.created_at > now() - interval '12 months'
ORDER BY 1 DESC;
```

### 2.6 Comparação Subscriptions vs Profiles Expected
Listar casos onde a assinatura ativa não condiz com o portal configurado.
```sql
WITH expected_offers AS (
  -- ... (CTE de mapeamento)
)
SELECT 
  p.email,
  p.portal as portal_atual,
  s.plan_id as plano_ativo,
  e.expected_portal as portal_esperado
FROM profiles p
JOIN subscriptions s ON p.id = s.user_id AND s.status = 'active'
JOIN expected_offers e ON s.plan_id = e.expected_plan_id
WHERE p.portal != e.expected_portal;
```

### 2.7 Resumo Estatístico Final (Consolidação)
```sql
WITH expected_offers AS (
  -- ... (CTE de mapeamento)
)
SELECT 
  COUNT(*) as total_eventos_rockty,
  COUNT(*) FILTER (WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg') as total_formacao,
  COUNT(*) FILTER (WHERE e.offer_id IS NULL) as total_unknown_offer,
  COUNT(*) FILTER (WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg' AND p.portal = 'aluna') as formacao_correto,
  COUNT(*) FILTER (WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg' AND p.portal IN ('assinante', 'clube_mensal', 'assinatura', 'clube_oracular')) as formacao_fallback_clube,
  COUNT(*) FILTER (WHERE p.id IS NULL) as total_sem_conta
FROM webhook_events w
LEFT JOIN expected_offers e ON (w.payload->>'offer_id') = e.offer_id
LEFT JOIN profiles p ON LOWER(w.payload->>'email') = LOWER(p.email)
WHERE w.created_at > now() - interval '12 months';
```

---

## 3. Regras de Segurança
- **SOMENTE SELECT.**
- **PROIBIDO:** UPDATE, DELETE, INSERT, DROP, ALTER, TRUNCATE.
- **NÃO** alterar dados, códigos, webhooks ou funções.
- **APENAS DIAGNÓSTICO.**
