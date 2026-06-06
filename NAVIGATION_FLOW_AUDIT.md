# Navigation Flow Audit - Casa Orácula

## 1. Perfil: Visitante (Não Autenticada / Gratuito)
**Objetivo:** Conhecer a proposta, sentir a "vibe" da Casa e converter para um plano.

*   **Ponto de Entrada:** `/` (Sala da Visitante) ou `/auth`.
*   **Páginas Acessíveis:**
    *   `/` (Sala da Visitante)
    *   `/auth` (Login/Cadastro)
    *   `/primeira-leitura` (Degustação)
    *   `/clube` (Landing de planos/preview)
    *   `/planos`
*   **Próximo Passo Esperado:** `/auth` -> Cadastro -> `/sala-da-visitante`.
*   **Páginas Indevidas:** Nenhuma detectada via App.tsx (Gatilhadas por ProtectedRoute).
*   **Bugs/Loops Encontrados:**
    *   Se a usuária tenta acessar `/dashboard-membro` sem estar logada, é redirecionada para `/auth`.
    *   Se logada como `visitante`, o `ProtectedRoute` com `minPortal="visitante"` permite acesso, mas redireciona para `/sala-da-visitante`.
*   **Recomendação:** Garantir que o CTA de "Entrar" na Sala da Visitante leve sempre ao `/auth` com redirect correto.

---

## 2. Perfil: Founder Beta
**Objetivo:** Validar o método através de um fluxo linear e guiado (Experiência Fundadora).

*   **Ponto de Entrada:** `/dashboard-membro` (Redirecionada via `ProtectedRoute` se `founder_beta=true`).
*   **Páginas Acessíveis (Fluxo Guiado):**
    *   `/dashboard-membro` (Ponto central)
    *   `/clube/primeira-cartografia` (Passo 1)
    *   `/clube/cidadela/resultado` (Passo 2)
    *   `/clube/rotas/rota-dos-lobos` (Passo 3 - Eixo central)
    *   `/clube/rota/:slug` (Estações da Rota)
    *   `/jardim-da-psique` (Registro de rastros)
    *   `/clube/founder-feedback` (Encerramento/Parecer)
*   **Páginas Indevidas:**
    *   Acesso ao menu "Espaço Profissional" (Casa das Máquinas) deve estar escondido.
    *   Acesso a `/admin` deve estar escondido (mesmo se for admin, o alternador de visualização resolve isso).
*   **Bugs/Loops Encontrados:**
    *   `useJourneyGuard` pode causar loops se a fundadora já tiver cartografia mas o hook tentar mandá-la para a cartografia completa (`/ferramenta/cartografia-psiquica-oracula`) em vez da expressa.
    *   O menu de navegação (`Navigation.tsx`) para `founder_beta` é bem restrito, o que é bom, mas o botão "Voltar ao Portal das Rotas" no footer de `RotaDosLobos.tsx` leva a `/clube/rotas`, que pode mostrar a landing de vendas ou o portal completo de assinante em vez do fluxo restrito.
*   **Recomendação:** No `Navigation.tsx`, o menu `founderMenuGroups` está correto. Ajustar o redirecionamento de `/clube` para fundadoras para sempre cair em `/clube/primeira-cartografia` (se sem cartografia) ou `/clube/rotas/rota-dos-lobos` (se com cartografia).

---

## 3. Perfil: Assinante (Clube/Mentorada)
**Objetivo:** Explorar as Rotas da Casa e ferramentas de auto-mapeamento.

*   **Ponto de Entrada:** `/dashboard-membro`.
*   **Páginas Acessíveis:**
    *   Todo o ecossistema `/clube/*`
    *   Ferramentas individuais `/ferramentas/*`
    *   Jardins `/jardim-da-psique`
    *   Cidadela `/cidadela`
*   **Próximo Passo Esperado:** Atravessar uma Rota ou usar uma Ferramenta.
*   **Páginas Indevidas:**
    *   `/admin/*` (Gatilhada por `minPortal="admin"`)
    *   `/casa-das-maquinas/*` (Gatilhada por `minPortal="oracula"`)
*   **Bugs/Loops Encontrados:**
    *   Se a assinante não tem cartografia, o Dashboard a força para `/ferramenta/cartografia-psiquica-oracula`. Se ela sair dessa página sem completar, o Dashboard a joga de volta. É um "loop de jornada" intencional, mas pode ser frustrante se ela quiser apenas explorar o acervo.
*   **Recomendação:** Criar uma forma de "ignorar por enquanto" a cartografia no Dashboard para assinantes veteranas.

---

## 4. Perfil: Admin
**Objetivo:** Gestão da plataforma e suporte.

*   **Ponto de Entrada:** `/admin` ou `/dashboard-membro`.
*   **Páginas Acessíveis:** TUDO.
*   **Bugs/Loops Encontrados:**
    *   O alternador "Ver como Fundadora" funciona via `updateUserMetadata`, o que é volátil. Se o admin der refresh, ele volta a ver como admin (isso é bom para segurança, mas pode confundir durante o teste).
    *   Algumas rotas de admin em `adminRoutes.tsx` apontam para o mesmo componente `<Admin />`, que deve gerenciar as abas internamente. Se a aba não existir, pode gerar página em branco ou erro de renderização.
*   **Recomendação:** Persistir o estado `preview_mode` no `localStorage` em vez de apenas no metadado do usuário para facilitar testes de navegação.

---

## 5. Auditoria de Rotas Órfãs e Loops Críticos

1.  **Loop do useJourneyGuard:**
    *   Local: `src/hooks/useJourneyGuard.ts`
    *   Problema: Redireciona para `/ferramenta/cartografia-psiquica-oracula` se `!hasCartografia`.
    *   Risco para Founder: A fundadora deve ir para `/clube/primeira-cartografia` (Express). O hook atual não diferencia `founder_beta`.
    *   **Correção Urgente:** Adaptar `useJourneyGuard` para respeitar a flag `founder_beta`.

2.  **Página Órfã: `/clube/rotas` para Fundadora:**
    *   Local: `src/pages/clube/ClubeRotasPortal.tsx`
    *   Problema: Se a fundadora clicar em "Voltar" no footer da Rota dos Lobos, ela cai aqui. Se ela já tem cartografia, ela vê o portal completo das rotas (que pode ter cards bloqueados ou confusão visual).
    *   **Correção:** Se `founder_beta`, o portal de rotas deve mostrar apenas a Rota dos Lobos.

3.  **CTA Quebrado: "Ver Dashboard" em CidadelaResultadoFounder:**
    *   Local: `src/pages/clube/CidadelaResultadoFounder.tsx`
    *   Problema: Leva para `/dashboard-membro`. Se o `useJourneyGuard` não estiver sincronizado, pode causar redirecionamento reverso.
    *   **Correção:** Sincronizar estados de conclusão.

4.  **Permissão Incorreta: Casa das Máquinas:**
    *   Local: `src/components/routing/CasaMaquinasGuard.tsx`
    *   Problema: Redireciona para `/planos` se não tiver acesso. Para uma fundadora (que é uma terapeuta convidada), cair em uma página de vendas (`/planos`) quebra o clima "VIP".
    *   **Correção:** Redirecionar para `/dashboard-membro` com um toast explicativo "Espaço restrito ao modo profissional".

## 6. Checklist de Correções Recomendadas

- [ ] **AuthContext:** Persistir `founder_beta` de forma mais robusta durante a sessão de preview.
- [ ] **useJourneyGuard:** Diferenciar redirecionamento de cartografia (Express vs Completa) para Fundadoras.
- [ ] **Navigation:** Esconder explicitamente o alternador de "Mundo" para fundadoras que não são admins.
- [ ] **ClubeRotasPortal:** Simplificar visualização para Fundadoras (focar 100% na Rota dos Lobos).
- [ ] **App.tsx:** Revisar se todos os redirecionamentos de `/clube` levam em conta o perfil logado.
