# Auditoria Retroativa de Webhooks Rockty

Este documento apresenta o plano para auditar os eventos do Rockty nos ultimos 12 meses.

## 1. Escopo
Mapeamento dos eventos recebidos via webhook para garantir que cada compra resultou no acesso correto.

## 2. Queries de Diagnostico

### 2.1 Contagem Geral
```sql
SELECT 
  (payload->>'offer_id') as offer_id,
  COUNT(*) as total_eventos
FROM webhook_events
WHERE created_at > now() - interval '12 months'
GROUP BY 1;
```

### 2.2 Auditoria Formacao Oracula
```sql
SELECT 
  w.created_at,
  w.payload->>'email' as email,
  p.portal
FROM webhook_events w
JOIN profiles p ON (w.payload->>'email') = p.email
WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg'
AND (p.portal != 'formacao' OR p.portal IS NULL);
```

## 3. Regras
- Nao alterar dados.
- Nao alterar codigo.
