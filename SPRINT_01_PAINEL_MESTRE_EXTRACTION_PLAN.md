# SPRINT_01_PAINEL_MESTRE_EXTRACTION_PLAN.md

**Sprint 01 — Extração Segura do Painel Mestre**

Este documento detalha o plano técnico para a extração do Painel Mestre (Founder Dashboard) para um domínio próprio (`src/domains/painel-mestre`), garantindo o isolamento da lógica financeira e estratégica sem alterar funcionalidades ou dados.

---

## 1. ARQUIVOS ATUAIS ENVOLVIDOS

| Arquivo | Função Atual | Destino Proposto |
| :--- | :--- | :--- |
| `src/components/admin/AdminFounderDashboardTab.tsx` | Componente principal do dashboard | `src/domains/painel-mestre/components/FounderDashboard.tsx` |
| `src/hooks/useFounderAlerts.ts` | Lógica de geração de alertas financeiros | `src/domains/painel-mestre/hooks/useFounderAlerts.ts` |
| `src/types/founder.ts` | Definições de interfaces (Métricas e Alertas) | `src/domains/painel-mestre/types/index.ts` |
| `src/pages/Admin.tsx` | Orquestrador de abas do administrativo | (Manter importando o novo caminho) |
| `view_founder_real_financial_summary` | View do Supabase (SQL) | Não alterado (apenas mapeado) |

---

## 2. NOVA ESTRUTURA PROPOSTA

A nova estrutura segue o padrão de isolamento por domínio:

```text
src/domains/painel-mestre/
├── components/
│   ├── FounderDashboard.tsx       # Componente extraído de AdminFounderDashboardTab
│   ├── MetricCard.tsx             # Componentes de UI internos (sub-componentes)
│   └── CostItem.tsx
├── hooks/
│   ├── useFounderAlerts.ts        # Hook de alertas movido
│   └── useFounderMetrics.ts       # (Opcional) Extração da lógica de query/agregração
├── services/
│   └── financialService.ts        # Isolamento de chamadas ao Supabase (futuro)
├── types/
│   └── index.ts                   # Unificação de interfaces (FounderFinancialMetrics, etc.)
└── index.ts                       # Exportação pública do domínio (Public API)
```

---

## 3. ESTRATÉGIA DE MIGRAÇÃO (SAFE-MOVE)

1.  **Cópia de Segurança:** Criar os arquivos no novo diretório sem remover os originais.
2.  **Refatoração de Imports Internos:** Ajustar os caminhos nos arquivos copiados para apontar para os novos locais dentro do domínio (ex: `@/types/founder` → `../types`).
3.  **Encapsulamento:** Exportar o componente principal via `src/domains/painel-mestre/index.ts`.
4.  **Troca Parcial (Shadow Switch):**
    *   No `src/pages/Admin.tsx`, alterar o lazy import de `AdminFounderDashboardTab` para o novo caminho.
    *   Manter o import antigo comentado como plano de contingência imediata.
5.  **Validação de Build:** Rodar o compilador para garantir que nenhum import quebrado foi introduzido.

---

## 4. PLANO DE ROLLBACK

Em caso de falha visual ou de dados:
1.  **Reverter `src/pages/Admin.tsx`:** Restaurar o import para `src/components/admin/AdminFounderDashboardTab`.
2.  **Verificação:** Confirmar que a aba "Founder" volta a exibir os dados originais.
3.  **Logs:** Checar o console do navegador por erros de `undefined` em métricas.

---

## 5. CHECKLIST DE VALIDAÇÃO

- [ ] **Acesso:** Rota `/admin?tab=founder` abre sem erro 404 ou tela branca.
- [ ] **Segurança:** Tentar acessar a aba com usuário sem permissão (Admin Guardiã deve acessar, assinante não).
- [ ] **Métricas:** O MRR, Custos e Lucro Líquido batem com os valores anteriores (especialmente as agregações `period_start`).
- [ ] **Simulador:** O "Simulador de Crescimento" (What-if) continua funcionando e reagindo aos sliders.
- [ ] **Alertas:** Alertas (IA, Margem, Churn) aparecem corretamente baseados nos thresholds.
- [ ] **Build:** `npm run build` ou equivalente passa sem erros de tipos.

---

## 6. RISCOS MAPEADOS

*   **Import Circular:** Se o novo domínio tentar importar algo de `src/pages/Admin.tsx`. (Mitigação: Usar apenas `src/shared` ou caminhos internos).
*   **Contexto Perdido:** Se houver dependência oculta de contextos globais injetados em `Admin.tsx`. (Mitigação: Testar como componente isolado).
*   **Dados Nulos:** Falha na Query do TanStack Query por `queryKey` alterada acidentalmente. (Mitigação: Manter a `queryKey: ['founder-financials', period]`).

---

## 7. O QUE NÃO SERÁ FEITO (OUT OF SCOPE)

*   Nenhuma alteração em tabelas ou views SQL.
*   Nenhuma mudança na lógica de cálculo de receita (incluindo o hardcode de `revenue_formacao`).
*   Nenhuma melhoria visual ou de UX.
*   Nenhuma alteração em políticas de RLS.

---
*Plano gerado em 11/05/2026 — Somente Planejamento.*
