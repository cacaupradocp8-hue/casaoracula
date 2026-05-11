# Sprint 04B.1: Auditoria Retroativa de Webhooks Rockty

**Status:** Planejamento / Diagnóstico (Somente Leitura)
**Objetivo:** Identificar divergências históricas entre as ofertas compradas no Rockty e os acessos liberados no portal, com foco em falhas de fallback e compras da Formação Orácula.

---

## 1. Escopo da Auditoria
Mapeamento nominal e estatístico dos últimos 12 meses de eventos recebidos via webhook para garantir que cada `offer_id` resultou na `subscription` e `portal` corretos.

### Tabelas Envolvidas (Apenas Consulta):
- `webhook_events`: Registro bruto dos payloads recebidos.
- `webhook_logs`: Logs de processamento das Edge Functions.
- `subscriptions`: Assinaturas criadas/atualizadas.
- `profiles`: Perfil da usuária (campo `portal` e `user_role`).
- `plans`: Tabela de referência de planos.
- `ofertas`: Tabela de referência comercial.
- `matriculas_pendentes`: Registros aguardando criação de conta.

---

## 2. Segmentação de Ofertas Críticas
Foco nos `offer_id` identificados como fora da tabela `plans` ou com alto risco de fallback:
- `qqqmfhyjku7ou9kc70gg`: Formação Orácula (Hardcoded no Sales).
- `karv9y4bewbdjcwbmvtwq`: Clube Mensal (Referência).
- `mayikrzz0kc58ijeqs9a`: Clube Anual (Referência).
- `2tgmh6vsiki7fg0buxdfxq`: Mentoria/Especial (Suspeito).
- `unknown_offer`: Qualquer ID não mapeado na tabela `plans`.

---

## 3. Estratégia de Diagnóstico (Queries SQL)

### 3.1 Contagem Geral e Distribuição
```sql
-- Total de eventos por oferta nos últimos 12 meses
SELECT 
  (payload->>'offer_id') as offer_id,
  COUNT(*) as total_eventos,
  MIN(created_at) as primeira_ocorrencia,
  MAX(created_at) as ultima_ocorrencia
FROM webhook_events
WHERE created_at > now() - interval '12 months'
GROUP BY 1
ORDER BY 2 DESC;
```

### 3.2 Identificação de Fallbacks Suspeitos
Busca por eventos onde o `offer_id` não existe na tabela `plans` mas resultou em acesso ao `clube_oracular`.
```sql
SELECT 
  w.created_at,
  w.payload->>'email' as email,
  w.payload->>'offer_id' as offer_id,
  s.plan_id as plan_atribuido,
  p.portal as portal_atual
FROM webhook_events w
LEFT JOIN plans pl ON (w.payload->>'offer_id') = pl.id
LEFT JOIN subscriptions s ON w.payload->>'email' = s.user_email -- Simplificado para busca nominal
LEFT JOIN profiles p ON s.user_id = p.id
WHERE pl.id IS NULL 
AND w.created_at > now() - interval '12 months';
```

### 3.3 Auditoria Específica: Formação Orácula
Localizar compradoras da Formação que podem estar com o portal configurado como "clube" ou sem assinatura vinculada.
```sql
SELECT 
  w.created_at,
  w.payload->>'email' as email,
  p.portal,
  p.user_role,
  s.status as sub_status
FROM webhook_events w
JOIN profiles p ON (w.payload->>'email') = p.email
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE w.payload->>'offer_id' = 'qqqmfhyjku7ou9kc70gg'
AND (p.portal != 'formacao' OR p.portal IS NULL);
```

---

## 4. Relatório Final de Saída (Esperado)
O relatório gerado após a execução das queries deverá listar:
1. **Data do Evento:** Timestamp original da compra.
2. **Email da Compradora:** Identificação para possível correção manual.
3. **Offer ID:** O ID exato enviado pelo Rockty.
4. **Produto Provável:** Inferência baseada no valor ou histórico.
5. **Acesso Liberado:** Qual `portal` consta no `profile` hoje.
6. **Risco:** 
   - `CORRETO`: Oferta e portal coincidem.
   - `SUSPEITO`: Oferta desconhecida mas liberou Clube.
   - `INCORRETO`: Compra da Formação mas portal está como Clube.

---

## 5. Resumo Estatístico para Tomada de Decisão
- Total de eventos Rockty processados.
- Qtd de ofertas não cadastradas na tabela `plans`.
- Qtd de usuárias em fallback (Clube por padrão).
- Qtd de alunas da Formação com acesso divergente.

---

## 6. Regras de Não-Intervenção
- **NÃO** realizar UPDATE em nenhuma tabela.
- **NÃO** disparar novos webhooks.
- **NÃO** alterar o código da Edge Function `rockty-webhook`.
- **NÃO** criar novos registros em `plans` ou `ofertas` nesta fase.

**Próximo Passo:** Executar as queries acima e consolidar a lista nominal para revisão da coordenação antes da Sprint 04C.
