# CASA_ORACULA_MASTER_REFACTORING_PLAN.md

**Fase 3 — Plano Mestre de Refatoração & Extração**
Este documento detalha o roteiro técnico para a reorganização arquitetural da Casa Orácula, seguindo as diretrizes de negócio e segurança estabelecidas nas fases de Descoberta e Inventário.

---

## 1. DOMÍNIO: PAINEL MESTRE (FOUNDER DASHBOARD)
O Painel Mestre é uma funcionalidade crítica de inteligência de negócio e financeira.

### 1.1 Estratégia de Extração
Isolamento completo no novo diretório de domínio para evitar acoplamento com o código administrativo geral.

- **Novo Diretório:** `src/domains/painel-mestre`
- **Componentes a Mover:**
  - `src/components/admin/AdminFounderDashboardTab.tsx` → `src/domains/painel-mestre/components/Dashboard.tsx`
  - `src/hooks/useFounderAlerts.ts` → `src/domains/painel-mestre/hooks/useFounderAlerts.ts`
- **Infraestrutura Própria:**
  - Criar `src/domains/painel-mestre/services/financial.service.ts` para isolar consultas às views financeiras.
  - Criar `src/domains/painel-mestre/types/index.ts` para tipagem de métricas e alertas.

### 1.2 Plano de Rollback
1. Manter o componente original `AdminFounderDashboardTab.tsx` renomeado como `AdminFounderDashboardTab.legacy.tsx` por 1 sprint.
2. A nova rota/aba apontará para o componente em `src/domains/painel-mestre`.
3. Em caso de erro crítico de importação ou quebra de hooks, reverter o import no `Admin.tsx` para o arquivo `.legacy`.

---

## 2. UNIFICAÇÃO DE BIBLIOTECAS
Consolidação do acervo para reduzir carga cognitiva da usuária.

- **Oficial (Geral):** `BibliotecaUnificada.tsx` (`/biblioteca`)
- **Profissional (Sensível):** `BibliotecaCasos.tsx` (`/biblioteca/casos`) — Permanece isolada sob `useProfessionalStatus`.
- **Legacy/Redirects:**
  - `BibliotecaDasTravessias.tsx` → Redirecionar para `/biblioteca?filter=travessias` ou integrar como seção interna.
  - `BibliotecaTravessias.tsx` → Idem.
  - `BibliotecaTravessiasFamilia.tsx` → Idem.

---

## 3. ECOSSISTEMA DE MAPAS (CANÔNICO)
Definição de propósito para as 5 engines identificadas.

| Engine | Finalidade | Status |
|---|---|---|
| **Mandala da Cidadela** | Experiência simbólica e visual principal. | Mantida (UI/UX Principal) |
| **Mapa Vivo** | Acompanhamento longitudinal e clínico (evolução). | Mantida (Motor Clínico) |
| **Cartografia Psíquica** | Leitura e diagnóstico simbólico inicial. | Mantida (Diagnóstico) |
| **Mapa Oracula** | Versão legada / simplificada. | Redirecionar para Mandala |
| **Mapa Vivo Live** | Componente de tempo real. | Integrar como "Modo Live" dentro do Mapa Vivo |

---

## 4. ESTRATÉGIA DE CHECKOUTS & PLANOS
Preparação para unificação de rotas sem alterar a lógica de processamento.

- **Ação:** Mapear todos os IDs de planos no Stripe e suas respectivas rotas atuais.
- **Nova Rota Proposta:** `/planos` (Hub Único)
  - Abas: `Clube Oracular` | `Formação` | `Mentoria`
- **Restrição:** Não alterar `stripe-webhook` ou lógica de assinatura no Supabase nesta fase.

---

## 5. LIMPEZA DE DADOS LEGADOS (_DEPRECATED_)
Tratamento das tabelas de versões anteriores.

- **Tabelas Afetadas:** `_deprecated_club_*`
- **Procedimento:** 
  1. Gerar relatório de dependências SQL (views/functions que ainda tocam nelas).
  2. Confirmar no frontend se algum hook (ex: `useClubeLivro` antigo) ainda faz fetch.
  3. Classificar como "Hidden" no schema (comentário SQL) antes da deleção futura.

---

## 6. RADIESTESIA (MODO LABORATÓRIO)
Isolamento do produto lateral.

- **Ação:** Ocultar do menu de navegação principal para usuárias padrão.
- **Acesso:** Apenas via URL direta (`/radiestesia`) ou via "Laboratório" no perfil de Admin/Oracula.
- **Status:** Desenvolvimento lateral ativo, sem prioridade no Roadmap de Hardening.

---

## 7. OTIMIZAÇÃO DE ATIVOS VISUAIS (SKILL ATIVA)
Dada a natureza visual das Mandalas, Mapas e Oráculos, as seguintes diretrizes de performance devem ser aplicadas:

- **Formatos:** Converter assets estáticos para `.webp` ou `.avif`.
- **Lazy Loading:** Implementar `loading="lazy"` em componentes de grid (Biblioteca/Oráculos).
- **CLS:** Definir `width` e `height` explícitos nos SVGs e Imagens dos Mapas.
- **Compressão:** Alvo de 80% de qualidade para WebP.

---

## 8. CRONOGRAMA DE EXECUÇÃO (FASE 4)

1. **Sprint 01:** Extração do Painel Mestre e criação do domínio `src/domains/painel-mestre`.
2. **Sprint 02:** Implementação de Redirects para Bibliotecas e Mapas secundários.
3. **Sprint 03:** Consolidação da rota `/planos` (Frontend Only).
4. **Sprint 04:** Auditoria final de tabelas `_deprecated` e ocultação da Radiestesia.

---
*Relatório gerado em: 11/05/2026*
*Este documento é um guia estratégico e não executa alterações automáticas.*
