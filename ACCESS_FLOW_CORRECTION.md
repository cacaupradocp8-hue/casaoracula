# Access Flow Correction - Casa Orácula

## 1. Perfil: Visitante (Gatilhamento e Proteção)
**Objetivo:** Impedir o acesso à CidadELA e fluxos exclusivos.

*   **Páginas Bloqueadas:**
    *   `/cidadela` e `/clube/cidadela/*` agora exigem `minPortal="assinante"`.
    *   `/clube/primeira-cartografia` agora exige `minPortal="assinante"`.
    *   `/clube/rotas/rota-dos-lobos` (previamente aberta) agora exige `minPortal="assinante"`.
*   **Fluxo Corrigido:**
    *   `Sala da Visitante` → Permite acesso apenas a conteúdos de degustação.
    *   O `useJourneyGuard` foi ajustado para ignorar redirecionamentos de "bloqueio de jornada" (como cartografia obrigatória) para o perfil `visitante`, permitindo navegação livre na sala de entrada.

---

## 2. Perfil: Assinante / Founder (Pós-Venda)
**Objetivo:** Direcionar para a ativação da CidadELA.

*   **Ativação da CidadELA:**
    *   `useJourneyGuard` agora reconhece o estado `founder_beta`.
    *   Se `founder_beta = true`, o redirecionamento de cartografia incompleta leva para `/clube/primeira-cartografia` (Express).
    *   O redirecionamento de revelação incompleta leva para `/clube/cidadela/resultado`.
*   **Hierarquia de Portal:**
    *   Garantido que as rotas do `/clube` e `/ferramentas` herdem a proteção `minPortal="assinante"`.

---

## 3. Navegação e Menus
*   **Navigation.tsx:** Validado que o menu `visitanteMenuGroups` não inclui Cidadela ou Jardins.
*   **Gatilhos de Redirecionamento:**
    *   Páginas de "Caminhos de Aprofundamento" levam corretamente à página de planos se acessadas por visitantes.

## 4. Auditoria de Segurança
- [x] Rota `/clube/rotas/rota-dos-lobos` restrita.
- [x] Rota `/clube/primeira-cartografia` restrita.
- [x] Rota `/cidadela` restrita.
- [x] Loop de jornada desativado para visitantes.
- [x] Redirecionamento inteligente para Cartografia Founder vs Padrão.
