# FOUNDER_EXPERIENCE_REFACTOR_PLAN

## Objetivo
Refatorar a experiência das usuárias `founder_beta` do Clube de Leitura Oracular, criando um fluxo guiado focado na CidadELA, sem impactar a experiência de administradores e usuárias comuns.

## Flag de Controle
*   **Flag:** `founder_beta: boolean`
*   **Implementação:** Adição do campo `founder_beta` à interface `User` no `AuthContext.tsx` e mapeamento a partir da tabela `profiles`.
*   **Uso:** Renderização condicional em rotas estratégicas e componentes de navegação.

## Arquivos que serão alterados
1.  `src/contexts/AuthContext.tsx`: Inclusão da flag `founder_beta` no estado do usuário.
2.  `src/App.tsx`: Definição da rota `/clube` como ponto de entrada dinâmico (Landing Founder ou Catálogo Comum).
3.  `src/components/layout/Navigation.tsx` & `src/components/layout/BottomNavPreview.tsx`: Ajuste dos menus para esconder áreas profissionais/admin para Founders.
4.  `src/pages/clube/ClubeHomeFounder.tsx` (Novo): Página inicial exclusiva para Founders (Página 1 do fluxo).
5.  `src/pages/clube/ClubeFeedbackFounder.tsx` (Novo): Página de feedback final (Página 12 do fluxo).
6.  `src/pages/clube/ClubeRotasPortal.tsx`: Adaptação para ser a visualização de rotas "acendendo" distritos.
7.  `src/pages/clube/RotaDosLobos.tsx`: Refinamento visual e inclusão de vínculos com a CidadELA.
8.  `src/pages/clube/ClubeRotaPremium.tsx`: Refinamento da estrutura de "Estação" para incluir os Jardins e Missão de Campo de forma integrada.
9.  `src/components/cartografia/CartografiaEstruturalStepper.tsx`: Ajuste nos textos e fluxos de resultado para focar na CidadELA Founder.

## Rotas Impactadas
*   `/clube`: Redireciona para `ClubeHomeFounder` se `founder_beta === true`.
*   `/clube/primeira-cartografia`: Nova rota (ou alias para `/ferramenta/cartografia-psiquica-oracula` com layout ajustado).
*   `/clube/cidadela/resultado`: Novo alias para o resultado da cartografia.
*   `/clube/dashboard`: Dashboard focado 100% na CidadELA.
*   `/clube/founder-feedback`: Nova rota para coleta de parecer técnico.

## Tabelas Impactadas
*   `profiles`: Inclusão da coluna `founder_beta` (via migração).
*   `user_cidadela_estado`: Atualização de distritos ao concluir estações.
*   `jardim_entradas`: Armazenamento dos rastros (Psique e Ofício).

## Componentes Reaproveitados
*   `MandalaCidadela` / `MiniMapaCidadela`: Protagonistas visuais.
*   `EstacaoHero` / `EstacaoCaminhoTrail`: Estrutura de conteúdo.
*   `EscutaPremium`: Áudios de onboarding e estações.
*   `CartografiaEstruturalStepper`: Motor da Primeira Cartografia.

## Experiência Preservada
*   **Usuárias comuns:** Continuam vendo o catálogo de rotas padrão e dashboard de membro atual.
*   **Admin:** Mantém acesso total, incluindo a "Casa das Máquinas" e "Painel de Gestão", que serão invisíveis para Founders.

## Riscos de Quebra
*   **Conflito de Flags:** Garantir que `founder_beta` tenha precedência sobre layouts de `assinante` comum, mas não bloqueie o portal `admin` de testar a própria experiência.
*   **Estado da CidadELA:** A atualização em tempo real dos distritos requer que os gatilhos de conclusão de estação no `ClubeRotaPremium` estejam bem mapeados.

---
*Plano gerado para validação técnica antes da execução.*
