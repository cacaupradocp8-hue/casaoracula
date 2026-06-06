# Visitor Flow Audit - Casa Orácula

## Fluxo Atualizado da Visitante
O fluxo foi costurado para garantir uma jornada linear de descoberta, desde a entrada sensorial até a decisão de assinatura.

1.  **Página Inicial (Sala da Visitante):**
    *   **Componente:** `VisitorSalaContent.tsx`
    *   **CTA Principal:** "Iniciar Primeira Leitura" -> Leva a `/primeira-leitura`.
2.  **Primeira Leitura (Degustação do Método):**
    *   **Página:** `PrimeiraLeituraPage.tsx`
    *   **Etapas Internas:**
        *   `LimiarIntro`: Pergunta norteadora sobre escuta.
        *   `CasePresentation`: Caso Marina (42 anos).
        *   `ResultCard`: Devolutiva baseada na percepção da usuária.
3.  **Descoberta do Caminho (PathSelector):**
    *   **Componente:** `PathSelector.tsx` (Etapa final da Primeira Leitura).
    *   **Opções de Saída:**
        *   **Aprofundamento Imediato:** Iniciar `Travessia 00` (Gratuita, mas exige login/cadastro).
        *   **Reconhecimento da Voz:** `Quiz da Voz` (Mapeamento simbólico).
        *   **Decisão de Assinatura:** `Clube & Escola` (Redireciona para `/planos`).
4.  **Planos e Assinatura:**
    *   **Página:** `Planos.tsx`
    *   **Finalização:** Escolha da oferta -> Checkout -> Login/Cadastro.

---

## Auditoria de Pontos de Fricção

*   **Páginas Órfãs:**
    *   A página `/formacao` estava sendo usada como destino no `PathSelector`, mas o componente correto para conversão de visitantes é `/planos`. **Corrigido.**
*   **Acesso Restrito:**
    *   A `Travessia 00` está marcada como acessível para visitantes no `useRouteGuard`, mas exige autenticação (`isAuthenticated`). Isso é correto, pois serve como gancho de cadastro.
*   **Consistência de Termos:**
    *   O termo "Descoberta do Caminho" agora aponta diretamente para a página de Planos no contexto de conversão.

## Recomendações Implementadas
- [x] Sincronização do CTA de "Clube & Escola" para a página de `/planos`.
- [x] Garantia de que a `Primeira Leitura` é a porta de entrada obrigatória para a jornada de descoberta.
- [x] Limpeza de rotas de legado no `useRouteGuard` para evitar loops em páginas de visitante.
