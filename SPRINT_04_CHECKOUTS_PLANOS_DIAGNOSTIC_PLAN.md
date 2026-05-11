# Planejamento de Sprint 04: Checkouts e Planos — Diagnóstico e Mapeamento

## 1. Objetivo
Realizar um mapeamento exaustivo de todos os fluxos de pagamento, ofertas e planos existentes na Casa Orácula para subsidiar uma unificação futura. Esta fase é **estritamente diagnóstica**.

---

## 2. Rotas Atuais Relacionadas
Identificamos as seguintes rotas que envolvem ofertas, planos e fluxos de entrada paga:

*   **`/planos`**: Hub geral que consome a tabela `ofertas`. Exibe cards para Clube e Formação.
*   **`/planos-clube-oracular`**: Landing page dedicada ao Clube de Leitura, com toggle mensal/anual.
*   **`/oracula-sales`**: Sales page sofisticada da Formação Orácula.
*   **`/convite-clube`**: Página de entrada específica para convites do Clube.
*   **`/aceitar-convite?token=...`**: Fluxo de onboarding para clientes convidadas por profissionais (Jardim da Heroína).
*   **`/assinatura` / `/billing`**: Páginas de gestão de assinatura (parcialmente legadas ou em transição).
*   **`/academia-formacao`**: Dashboard ou página de vendas da Formação.
*   **`/desbloqueie`**: Gatekeeper (paywall) que redireciona usuárias sem acesso.
*   **`/checkout-sucesso` / `/checkout-cancelado`**: Handlers de retorno de pagamento.

---

## 3. Componentes-Chave
Componentes que controlam a lógica de preços e CTAs:

*   `PlanosClubeCards.tsx`: Renderiza os cards de preço do Clube.
*   `PlanosFormacao.tsx`: Componente de "upsell" para a Formação dentro do hub de planos.
*   `OraculaSalesPage.tsx`: Contém links diretos de checkout para a Formação.
*   `useOfertas.ts`: Hook que busca dados da tabela `ofertas`.
*   `useAccessExpiration.ts`: Hook que valida o portal e a expiração da usuária.
*   `RocktyButton`: (Implícito) CTAs que apontam para `pay.rockty.com`.

---

## 4. Infraestrutura de Pagamento (Edge Functions & DB)
A Casa Orácula utiliza o **Rockty** como provedor principal de checkout.

*   **Edge Functions**:
    *   `rockty-webhook`: Processa eventos de criação, renovação e cancelamento. É a "Fonte da Verdade" para ativação.
    *   `activate-pos-compra`: Lógica disparada após a confirmação.
    *   `check-access-expiration`: Verifica diariamente se assinaturas expiraram para reverter o portal para `visitante`.
*   **Tabelas de Banco de Dados**:
    *   `plans`: Define `visitante`, `fundadora` (Formação), `mentoria` e `assinatura`.
    *   `subscriptions`: Armazena o estado atual da assinatura (Stripe/Rockty integration style).
    *   `ofertas`: Dados exibidos visualmente no `/planos`.
    *   `matriculas_pendentes`: Registra compras de usuárias que ainda não criaram conta no Auth.
    *   `webhook_events` / `webhook_logs`: Rastreabilidade de transações.

---

## 5. Mapeamento de Ofertas Encontradas

| Oferta | Nome Público | Rota Principal | Preço Estimado | CTA Destination | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Clube Mensal** | Clube de Leitura | `/planos-clube-oracular` | R$ 97 / mês | Rockty (ID mayikr...) | Ativo |
| **Clube Anual** | Clube de Leitura | `/planos-clube-oracular` | R$ 897 / ano | Rockty (ID 2tgmh...) | Ativo |
| **Formação** | Formação Orácula | `/oracula-sales` | R$ 1.500+ | Rockty (ID inn1j...) | Ativo |
| **Mentoria** | Mentoria Orácula | `/mentoria` | R$ 2.500 | Consultivo / Direto | Ativo |
| **SaaS** | Casa das Máquinas | `/casa-maquinas` | Incluso na Assinatura | Interno | Ativo |
| **Gratuito** | Visitante | `/experiencia-gratuita` | R$ 0 | `/auth` | Ativo |

---

## 6. Riscos e Problemas Identificados (Diagnóstico)
*   **Dados Duplicados**: Existe uma tabela `plans` (lógica de acesso) e uma `ofertas` (exibição). Se mudarmos o preço em uma, a outra pode ficar desatualizada.
*   **URLs Hardcoded**: Os links de checkout da Rockty estão espalhados em arquivos `.tsx` (ex: `PlanosClubeOracular.tsx` e `OraculaSalesPage.tsx`).
*   **Experiência Fragmentada**: O usuário pode encontrar preços ou CTAs diferentes dependendo de se entrar por `/planos` ou `/planos-clube-oracular`.
*   **Métricas de Conversão**: Não há um tracking unificado de qual página converte mais (hub vs landing pages específicas).
*   **Terminologia**: "Assinante" vs "Iniciada" vs "Oracula" — os nomes das roles no banco nem sempre batem com os nomes comerciais.

---

## 7. Decisões Pendentes para Sprints Futuras
*   Deveríamos centralizar todos os `price_ids` e `checkout_urls` na tabela `plans`?
*   O hub `/planos` deve ser o único ponto de entrada ou manteremos as landing pages isoladas?
*   Como tratar o "Clube" dentro da "Formação" (Upsell vs Cross-sell)?
*   Unificação do visual dos cards de preço (hoje cada página tem seu estilo).

---

## 8. Recomendações de Arquitetura Futura
1.  **Single Source of Truth**: Criar uma View ou API interna que retorne os dados da oferta baseada na tabela `plans`.
2.  **Redirect Manager**: Transformar rotas legadas em redirects automáticos para o novo hub.
3.  **Config Centralizada**: Mover as URLs da Rockty para o `App Settings` (tabela de configurações) para permitir troca sem deploy.

---
**Elaborado por**: Lovable AI
**Data**: 11/05/2026
**Contexto**: Início do Planejamento da Sprint 04.
