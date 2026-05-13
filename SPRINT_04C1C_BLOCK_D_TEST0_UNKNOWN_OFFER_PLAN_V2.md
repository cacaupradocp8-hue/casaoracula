# SPRINT_04C1C_BLOCK_D_TEST0_UNKNOWN_OFFER_PLAN_V2.md

Plano de teste seguro para validação de oferta desconhecida (Unknown Offer) no BLOCO D - Versão V2 (Safe ID).

## 1. Segurança e Isolamento
- **Foco:** Proteção de usuários reais.
- **Correção:** Uso de UUID fictício para garantir que nenhum registro real seja afetado por efeitos colaterais.
- **UUID de Teste:** `00000000-0000-0000-0000-000000000999` (Inexistente no banco).

## 2. Estado Atual antes do Teste (Contagens de Controle)
Deverão ser capturadas imediatamente antes da execução:
- `SELECT count(*) FROM subscriptions;`
- `SELECT count(*) FROM profiles;`
- `SELECT count(*) FROM user_roles;`
- `SELECT count(*) FROM matriculas_pendentes;`

## 3. Payload/RPC Simulado (Script de Teste)
A chamada será feita diretamente via SQL para testar a lógica da função.

**SQL de execução (Planejado):**
```sql
SELECT public.process_webhook_subscription(
  '00000000-0000-0000-0000-000000000999', -- User ID Fictício
  'rockty',                               -- Provider
  'TEST_UNKNOWN_OFFER',                   -- Offer ID não mapeado
  'active',                               -- Status
  'assinante',                            -- Portal (bloqueado)
  'active',                               -- Status Profile
  now(),                                  -- Period Start
  now() + interval '30 days',             -- Period End
  now() + interval '30 days',             -- Next Billing
  'TEST_EXT_UNKNOWN_D0',                  -- External Sub ID
  'Teste Unknown Offer'                   -- Customer Name
);
```

## 4. Resultado Esperado
- **Retorno JSON:** `{"error": "Oferta Rockty nao mapeada ou inativa", "offer_id": "TEST_UNKNOWN_OFFER"}`.
- **Bloqueio de DML:** A função deve retornar o erro **antes** de qualquer comando `INSERT` ou `UPDATE`.
- **Integridade de Tabelas:** Todas as contagens de controle devem permanecer idênticas.
- **Inexistência de Lixo:** `SELECT count(*) FROM subscriptions WHERE external_subscription_id = 'TEST_EXT_UNKNOWN_D0';` deve ser `0`.

## 5. Validações Pós-Teste (Checklist)
- [ ] Comparar contagens de `subscriptions`, `profiles`, `user_roles` e `matriculas_pendentes`.
- [ ] Validar que o retorno da função foi o erro de mapeamento esperado.
- [ ] Confirmar que nenhum usuário real foi acessado/alterado.

## 6. Riscos Mapeados
- **Risco:** Falha na constraint de chave estrangeira (`user_id`).
- **Mitigação:** Como a função deve retornar o erro de mapping na primeira etapa (etapa 1 da lógica), ela nunca chegará ao `INSERT` que dispararia o erro de FK ou alteraria o banco. Isso confirma a eficácia do bloqueio preventivo.

## 7. Próximos Passos
- Aguardar autorização para execução desta validação diagnóstica.
