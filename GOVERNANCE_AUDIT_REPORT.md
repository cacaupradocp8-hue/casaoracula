# Casa Orácula — Governance Audit Report

**Status:** ❄️ FROZEN ARCHITECTURE — Auditoria concluída. Nenhuma alteração estrutural deve ser feita sem aprovação das fases recomendadas.
**Data:** 24/05/2024
**Responsável:** Product Governance Architect

---

## 1. DISCOVERY FINDINGS (INVENTÁRIO)

### A. Mapa de Rotas e Ecossistemas
O ecossistema atual possui aproximadamente 180 rotas ativas e 135 arquivos de página. A fragmentação é alta, com sobreposição de responsabilidades entre Clube, Formação e Casa das Máquinas.

| Domínio | Rotas-chave | Audiência | Status |
|---|---|---|---|
| **Público** | `/`, `/sala-da-visitante`, `/quiz/:quizId`, `/oracula` (sales) | Visitante | CORE |
| **Onboarding** | `/onboarding`, `/welcome`, `/mapa-casa`, `/dashboard-membro` | Aluna | CORE |
| **Clube/Rotas** | `/clube/rota/:slug`, `/clube-livro/*`, `/biblioteca`, `/biblioteca-travessias*` | Assinante | CLUB (Fragmentado) |
| **Formação** | `/portal-oracula`, `/portal-junguiano`, `/labirinto-heroina`, `/academia` | Aluna Formação | TRAINING |
| **Casa das Máquinas** | `/casa-das-maquinas`, `/casa/*`, `/casa-tecelas`, `/minhas-clientes` | Orácula | CLINICAL (Fragmentado) |
| **Ferramentas** | `/ferramenta/:slug`, `/ferramentas/*` (hardcoded + dinâmico) | Mentorada+ | CORE (Duplicado) |
| **Mapas** | CidaDELA, Mapa Vivo, Mapa Oracula, Mapa Casa, Mapa Heroína | Mentorada+ | DUPLICATE |

### B. Registries de Ferramentas
Identificamos 3 fontes de verdade concorrentes:
1. **Database:** Tabelas `tools` e `sala_ferramentas`.
2. **Hardcoded Hubs:** `FerramentasHub.tsx`, `FerramentasVitrine.tsx`, `FerramentasMetodoHub.tsx`.
3. **App Routing:** Rotas estáticas em `App.tsx` que ignoram a lógica de `FerramentaDinamica`.

---

## 2. RISKS (MAPA DE RISCOS)

| Severidade | Risco | Local |
|---|---|---|
| 🚨 **CRITICAL** | Rota duplicada com permissões conflitantes (`/ferramenta/cartografia-psiquica-oracula`) | App.tsx L358 e L418 |
| 🚨 **CRITICAL** | Relatórios internos expostos no bundle público (`/relatorio-auditoria-*`, `/relatorio-sprint-*`) | pages/ |
| 🔴 **HIGH** | Violação da regra "DB-First" (Ferramentas hardcoded no frontend) | App.tsx e Hubs |
| 🔴 **HIGH** | Sobreposição de Bibliotecas (4 variantes de Bibliotecas de Travessias) | pages/ |
| 🔴 **HIGH** | Fragmentação de Mapas (5 motores de mapa sem distinção clara) | pages/ |
| 🟡 **MEDIUM** | Inconsistência de Naming (Clube vs Rotas, Casa das Máquinas vs Casa vs Tecelas) | Global |
| 🟡 **MEDIUM** | Carga Cognitiva Crítica (180+ rotas, 75+ abas admin) | UI/UX |

---

## 3. DUPLICATE CONSOLIDATION (RECOMENDAÇÕES)

### Itens para Unificação (Merge)
- **Bibliotecas:** Fundir `BibliotecaTravessias`, `BibliotecaDasTravessias` e `BibliotecaTravessiasFamilia` na `BibliotecaUnificada`.
- **Big Five:** Eleger `Big5Simbolico` como canônico; arquivar `Big5` e `Big5Funcional`.
- **Eneagrama:** Eleger `EneagramaFeminino` como canônico.
- **Mapas:** Manter apenas `Mandala CidaDELA` (Simbólico) e `Mapa Vivo` (Longitudinal).
- **Formação:** Mover Academia, Forum e Avaliações para abas dentro de `/portal-oracula`.
- **Casa das Máquinas:** Unificar todos os prefixos sob `/casa-das-maquinas/*`.

---

## 4. METHOD & UX CONFLICTS

- **Navegação por Inventário:** O sistema atual lista "Ferramentas". Deve migrar para **Navegação por Jornada** (ENTENDER · EXPLORAR · ORGANIZAR · INTERVIR · TREINAR · ACOMPANHAR).
- **Ferramentas "Místicas":** Radiestesia, Chakras e Hawkins não alimentam o Atlas Orácula e devem ser confinadas ao "Laboratório" (oculto).
- **Copy Ética:** Substituir termos que sugiram "diagnóstico" ou "certeza clínica" por "formulação simbólica" e "suporte reflexivo".

---

## 5. ATLAS INTEGRATION MAP

| Ferramenta | Camada Atlas | Contribuição | Status |
|---|---|---|---|
| CidaDELA | Estrutural | Input Direto | **CORE** |
| Mapa Vivo | Longitudinal | Evolução | **CORE** |
| Big5 Simbólico | Dimensional | Traços | **CORE** |
| Torre Viva | Defesas | Mecanismos | **CORE** |
| Labirinto | Repetição | Padrões | **CORE** |
| Radiestesia | — | — | **ARCHIVE/LAB** |

---

## 6. BUILD ORDER (PLANO DE EXECUÇÃO PÓS-APROVAÇÃO)

1. **Correção Crítica:** Resolver rotas duplicadas e remover relatórios do bundle.
2. **Registry Único:** Migrar ferramentas hardcoded para a tabela `tools`.
3. **Consolidação de Rotas:** Implementar redirects para bibliotecas e mapas duplicados.
4. **Ownership Cleanup:** Reorganizar abas administrativas e unificar prefixos de domínio.
5. **Navegação 2.0:** Reescrita da sidebar baseada em verbos de jornada.
6. **Arquivo Seguro:** Desativar componentes legados após validação de dependências.

---

## 7. APPROVAL REQUIRED (PENDÊNCIAS)

- [ ] Remoção das rotas `/relatorio-*`.
- [ ] Unificação do Big5 e Eneagrama (definir canônico).
- [ ] Unificação do prefixo `/casa-das-maquinas`.
- [ ] Ocultação da Radiestesia no menu principal.
- [ ] Mudança da navegação para modelo "Baseado em Jornada".

---
**FIM DO RELATÓRIO DE GOVERNANÇA**