# SPRINT_04C1B_PRE_MIGRATION_DRY_RUN_V2_RESULT.md

## 1. Plans Ausentes
Foram verificados os IDs necessários para a integridade referencial da nova tabela `rockty_offer_mapping`.

| Plan ID | Status |
|---------|--------|
| `clube_mensal` | **AUSENTE** |
| `clube_anual` | **AUSENTE** |
| `formacao_oracula` | **AUSENTE** |

**Nota:** Estes planos devem ser criados na migration V3.2 antes da criação da FK.

## 2. Classificação de matriculas_pendentes
Análise do campo `curso_id` na tabela `matriculas_pendentes`.

| Categoria | Qtd | Amostra (Email / Offer ID) |
|-----------|-----|----------------------------|
| **OFICIAL_MAPEAVEL** | 2 | `compradora.inexistente@example.com` (karv9y4bewbdjcwbmvtwq), `teste.mensal+01@example.com` (karv9y4bewbdjcwbmvtwq) |
| **TEST_MODE** | 1 | `teste.desconhecido+01@example.com` (TEST_UNKNOWN_OFFER) |
| **ID_EXTRA_DESCONHECIDO** | 0 | - |
| **OFFER_ID_DESCONHECIDO** | 0 | - |

## 3. Conflitos para UNIQUE(provider, external_subscription_id)
Verificação de assinaturas que impediriam a criação da constraint de unicidade por ID externo.

**Resultado:** 0 conflitos encontrados.
*A tabela `subscriptions` está limpa para esta nova regra.*

## 4. Conflitos para UNIQUE(user_id, provider, plan_id)
Verificação de assinaturas duplicadas para o mesmo usuário, provedor e plano.

**Resultado:** 0 conflitos encontrados.
*A tabela `subscriptions` está limpa para esta nova regra.*

## 5. Divergências entre profiles.portal e user_roles.portal
Identificação de usuários com estados de acesso inconsistentes.

| Email | User ID | Profile Portal | Role Portal | Created At | Hypothesis |
|-------|---------|----------------|-------------|------------|------------|
| `gigametalplast@gmail.com` | `afe12d58-16ad-41dc-ab6a-ff230adedd6e` | `visitante` | `assinante` | 2026-02-07 | Sincronia incompleta durante update manual ou falha em trigger legado. |

**Recomendação:** Sincronizar para `assinante` durante a migration V3.2.

## 6. Conclusão
**Status:** **SEGURO PARA GERAR SQL FINAL**

**Justificativa:**
- Não foram detectados conflitos de dados que impeçam as novas constraints de `UNIQUE` em `subscriptions`.
- As pendências mapeáveis seguem os padrões esperados.
- A ausência dos registros na tabela `plans` é esperada e será resolvida pelo `INSERT` inicial da migration V3.2.
- A divergência de portal é isolada em um único usuário e pode ser tratada via script de correção simples na migration.

---
*Relatório gerado em 12/05/2026 via Dry-run V2.*
