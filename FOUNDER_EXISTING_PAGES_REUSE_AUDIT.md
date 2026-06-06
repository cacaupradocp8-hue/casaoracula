# FOUNDER_EXISTING_PAGES_REUSE_AUDIT

## 1. Identificação de Páginas Existentes

Após auditoria técnica no diretório `src/pages/clube/` e `src/pages/`, mapeamos as seguintes interfaces:

| Rota Atual | Componente/Arquivo | Função Identificada | Status Visual |
| :--- | :--- | :--- | :--- |
| `/clube/rotas` | `ClubeRotasPortal.tsx` | Portal contemplativo com áudio de boas-vindas e CTA para Rota dos Lobos. | **Excelente** (Preservar) |
| `/clube/rota-dos-lobos` | `RotaDosLobos.tsx` | Hero cinematográfico e lista das 6 estações. | **Excelente** (Preservar) |
| `/clube/rota/:slug` | `ClubeRotaPremium.tsx` | Página interna de cada estação (Áudio, Conteúdo, Jardins, Missão). | **Bom** (Refinar CTAs) |
| `/cidadela` | `CidadelaPage.tsx` | Visão técnica dos distritos e marcos acesos. | **Incompleto** (Reaproveitar lógica) |
| `/dashboard-membro` | `DashboardMembro.tsx` | Landing atual com Mandala e resumo de ações. | **Bom** (Base para Dash Founder) |
| `/ferramenta/cartografia...` | `CartografiaPsiquicaPage.tsx` | Motor do teste de CidadELA. | **Funcional** (Preservar motor) |
| `/jardim-da-psique` | `JardimPsique.tsx` | Listagem de registros pessoais. | **Bom** (Preservar) |

## 2. O que será Preservado (NÃO recriar)

*   **Portal de Boas-Vindas (`ClubeRotasPortal`):** Já possui o tom editorial e áudio de chegada. Será o ponto 2 do fluxo.
*   **Apresentação da Rota (`RotaDosLobos`):** Design de alto nível, 100% alinhado. Será o ponto 8 do fluxo.
*   **Estrutura de Estação (`ClubeRotaPremium`):** Já integra áudios e inputs dos Jardins. Será o ponto 10 do fluxo.
*   **Motor da Cartografia (`CartografiaEstruturalStepper`):** A lógica de cálculo e geração do JSON de perfil já está pronta e robusta.

## 3. Páginas "Soltas" ou que precisam de Costura

*   **Página 1 (Entrada Founder):** Atualmente, a entrada cai direto no dashboard genérico. Precisamos da Landing "Conselho Fundador" para receber a beta.
*   **Resultado da CidadELA:** O resultado atual é muito técnico/clínico. Usaremos o componente `CidadelaRotasView.tsx` para uma exibição mais simbólica e "limpa" para a fundadora.
*   **Dashboard Founder:** Substituiremos a visão genérica por uma versão que coloque a Mandala em destaque total, removendo acessos a "Cursos" ou "Formação" que não pertencem ao fluxo beta.

## 4. Proposta de Reaproveitamento e Conexão (O Fluxo Final)

| Etapa | Ação | Página/Componente Reaproveitado | Ajuste Necessário |
| :--- | :--- | :--- | :--- |
| **1. Entrada** | Boas-vindas Founder | `ClubeHomeFounder.tsx` (Nova) | Texto de recepção e CTA "Criar CidadELA". |
| **2. Cartografia** | Teste Simbólico | `CartografiaPsiquicaPage.tsx` | Ajustar breadcrumb e CTAs de retorno. |
| **3. Resultado** | Revelação da Cidade | `CidadelaRotasView.tsx` | Forçar versão "Rotas" (sem termos técnicos). |
| **4. Início Rota** | Portal das Rotas | `ClubeRotasPortal.tsx` | Remover cards de outras rotas; focar Lobos. |
| **5. A Rota** | Rota dos Lobos | `RotaDosLobos.tsx` | Conectar progresso real do banco aos cards. |
| **6. Estação** | Conteúdo + Jardins | `ClubeRotaPremium.tsx` | Garantir que "Próxima Estação" flua no fim. |
| **7. Dashboard** | Acompanhamento | `DashboardMembro.tsx` | Filtrar menus para esconder áreas profissionais. |
| **8. Feedback** | Parecer Técnico | `ClubeFeedbackFounder.tsx` (Nova) | Formulário final para a fundadora. |

## 5. Componentes Reutilizáveis (Lego Técnico)

*   `MiniMapaCidadela`: Para o Dashboard e fechamento de estações.
*   `EscutaPremium`: Para todos os áudios do fluxo.
*   `JardimInput`: Já configurado para salvar em `psique` e `oficio`.
*   `EstacaoCaminhoTrail`: O trilho horizontal que já indica onde a usuária está.

## 6. Riscos de Sobreposição

Identificamos que o `BottomNavPreview` atual aponta para caminhos genéricos (`/cursos`, `/ferramentas`). Para a `founder_beta`, o menu inferior será simplificado para: **Início (CidadELA) \| Rota \| Jardins \| Feedback.**

---
**Conclusão da Auditoria:** Temos 80% das páginas prontas e com visual excelente. O trabalho é 20% criação (Landing/Feedback) e 80% orquestração de rotas e permissões.
