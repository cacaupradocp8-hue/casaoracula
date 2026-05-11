# SPRINT 04A — CHECKOUTS, ROCKTY & OFFER MAP
## Diagnóstico Profundo e Mapeamento Nominal

**Data:** 11 de Maio de 2026
**Status:** Diagnóstico (Sem implementação)

---

### 1. Lista Completa de Páginas Comerciais

| Rota | Componente | CTA Principal | Destino | Oferta / Produto | Público | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/planos` | `Planos.tsx` | Dinâmico (Cards) | Rockty / Rota | Clube (Mensal/Anual) | Visitantes/Membros | **Ativa** |
| `/planos-clube-oracular` | `PlanosClubeOracular.tsx` | "Entrar no Clube" | Rockty (Hardcoded/Set) | Clube Mensal/Anual | Visitantes/Membros | **Ativa (Landing)** |
| `/oracula-sales` | `OraculaSalesPage.tsx` | "Entrar na Formação" | Rockty (Hardcoded) | Formação Orácula | Público Externo | **Ativa (Sales Page)** |
| `/convite-clube` | `ConviteClube.tsx` | "Entrar no Clube" | `/planos` | Clube Oracular | Novos Membros | **Ativa (Incentivo)** |
| `/mentoria` | `Mentoria.tsx` | (Visualização) | - | Mentoria & Supervisão | Iniciadas | **Ativa (Portal)** |
| `/academia-formacao` | `AcademiaFormacaoPage.tsx` | "Inscrever-se" | `/academia-formacao` | Cursos/Formação | Alunas | **Ativa (LMS)** |
| `/desbloqueie` | `DesbloqueiePage.tsx` | "Versão completa" | `/planos` | Todos os planos | Visitantes | **Ativa (Gating)** |
| `/pos-compra` | `PosCompra.tsx` | (Polling Status) | `/dashboard-membro` | Confirmação | Recém-pagos | **Ativa (Checkout)** |
| `/checkout-sucesso` | `CheckoutSucesso.tsx` | (Redirect Auto) | `/dashboard-membro` | Sucesso Genérico | Recém-pagos | **Ativa (Legado)** |
| `/checkout-cancelado` | `CheckoutCancelado.tsx` | "Ver Planos" | `/planos` | Cancelamento | Recém-pagos | **Ativa** |
| `/assinatura` | `Assinatura.tsx` | "Ver Planos" | `/planos` | Gestão | Membros | **Ativa (Perfil)** |

---

### 2. URLs Rockty Encontradas (Links de Checkout)

| URL (Trecho) | Arquivo | Linha | Produto | Tipo | Divergência |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `pjo9ceihykihwx1gixhspq?off=mayikrzz0kc58ijeqs9a` | `PlanosClubeOracular.tsx` | 85 | Clube Mensal | Hardcoded (Fallback) | Bate com `ofertas` (Anual?) |
| `pjo9ceihykihwx1gixhspq?off=2tgmh6vsiki7fg0buxdfxq` | `PlanosClubeOracular.tsx` | 101 | Clube Anual | Hardcoded (Fallback) | Bate com `app_settings` |
| `inn1jdxprkw4gafeubsdww?off=qqqmfhyjku7ou9kc70gg` | `OraculaSalesPage.tsx` | 166 | Formação Orácula | Hardcoded | **Não consta em `plans` ou `ofertas`** |
| `pjo9ceihykihwx1gixhspq?off=karv9y4bewbdjcwbmvtwq` | `AdminPlanosClubTab.tsx` | - | Clube Mensal | App Settings | Bate com `ofertas` |

---

### 3. Tabela `plans` (Estrutura Técnica de Acesso)

*Esta tabela define os limites técnicos e o portal resultante no banco de dados.*

| ID | Nome Técnico | Portal Resultante | Preço (Ref) | Duração | Max Clientes | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `visitante` | Visitante | `visitante` | R$ 0.00 | - | 2 | Ativo |
| `fundadora` | Fundadora — Formação | `iniciada` | R$ 1500.00 | 12 meses | Ilimitado | Ativo |
| `mentoria` | Mentoria ORÁCULA | `iniciada` | R$ 2500.00 | 24 meses | Ilimitado | Ativo |
| `assinatura` | Assinatura Profissional | `iniciada` | R$ 49.90 | Mensal | Ilimitado | Ativo |

---

### 4. Tabela `ofertas` (Exibição Comercial em `/planos`)

*Esta tabela controla os cards dinâmicos da página de planos principal.*

| Nome Público | Preço Exibido | CTA | Link/Destino | Status | Observação |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Explorar | Gratuito | Começar Grátis | `/sala-da-visitante` | Ativo | Conversão inicial |
| Clube Mensal | R$ 97/mês | Entrar no Clube | `https://pay.rockty.com/...` | Ativo | Rockty (karv9y...) |
| Clube Anual | R$ 897/ano | Entrar no Clube | `https://pay.rockty.com/...` | Ativo | Rockty (mayikr...) |
| Plano Base | R$ 67/mês | Começar Agora | `/sala-da-visitante` | **Inativo** | Legado |
| Plano Pro | R$ 97/mês | Assinar Pro | `/oracula` | **Inativo** | Legado |

---

### 5. Webhooks e Liberação de Acesso

#### `rockty-webhook` (Edge Function)
*   **Eventos:** `subscription_created`, `subscription_renewed`, `payment_confirmed`, `subscription_canceled`, `subscription_expired`.
*   **Lógica de Liberação:**
    *   Identifica usuário pelo email.
    *   Se não existe, cria em `matriculas_pendentes`.
    *   Se existe, chama RPC `process_webhook_subscription`.
*   **Escrita:** Tabelas `subscriptions`, `profiles` (coluna `portal`), `user_roles`.
*   **Portal Liberado:** `assinante` (mapeado via código como `assinante`, mas a tabela `plans` aponta para `iniciada`). **Risco de inconsistência de nomenclatura.**

#### `check-access-expiration` (Cron Job)
*   **Função:** Verifica `subscriptions` e `degustacao_requests`.
*   **Ação:** Reverte portal para `visitante` se expirado.

---

### 6. Matriz Comercial (Fluxo Nominal)

1.  **Oferta:** Clube Mensal (R$ 97)
    *   **Página:** `/planos` ou `/planos-clube-oracular`
    *   **Checkout:** Rockty (karv9y...)
    *   **Webhook:** `subscription_created`
    *   **Tabela Alterada:** `subscriptions` (status active), `profiles` (portal: assinante)
    *   **Área Acessada:** Portais com `minPortal: assinante` ou `iniciada` (dependendo da validação).

2.  **Oferta:** Formação (R$ 1500+)
    *   **Página:** `/oracula-sales`
    *   **Checkout:** Rockty (qqqmfh...)
    *   **Webhook:** Trata como `clube_oracular` por fallback se o `plan_id` não for reconhecido. **Risco Crítico.**

---

### 7. Divergências e Riscos Encontrados

1.  **Divergência de Preço:** A tabela `plans` lista assinatura a **R$ 49.90**, mas a tabela `ofertas` e as landings exibem **R$ 97.00**.
2.  **Divergência de Nome/ID:** O webhook usa o termo `assinante` para o portal, enquanto a tabela `plans` usa `iniciada`. Isso pode causar falhas em `guards` que checam o nível exato.
3.  **Oferta "Fantasma":** O checkout da Formação em `/oracula-sales` está totalmente hardcoded e não possui registro correspondente nas tabelas de banco de dados (`plans` ou `ofertas`). Se o webhook receber esse `plan_id`, ele pode cair no fallback de "clube_oracular".
4.  **Links Duplicados:** URLs da Rockty estão espalhadas em: `App Settings`, fallback em código (`PlanosClubeOracular.tsx`) e banco de dados (`ofertas`). Se o admin mudar no banco, a landing pode continuar com o link antigo.
5.  **Riscos de Receita:** Mudanças nos webhooks sem testar os `plan_ids` manuais da Rockty podem bloquear o acesso de quem pagou caro (Formação).

---

### 8. Recomendações Estratégicas

1.  **Hub de Planos:** Centralizar todas as ofertas na tabela `ofertas` e fazer com que `/planos`, `/planos-clube-oracular` e `/oracula-sales` consultem a mesma fonte.
2.  **Sincronização `plans` ↔ `ofertas`:** O `ID` da oferta deve ser o mesmo `plan_id` enviado pela Rockty para evitar fallbacks genéricos.
3.  **Normalização de Roles:** Unificar `assinante` e `iniciada` em uma única nomenclatura de permissão.
4.  **Redirects:** Transformar rotas redundantes em redirects para uma landing única de alta conversão, mantendo apenas `/planos` como o seletor técnico.

---
**Fim do Diagnóstico SPRINT 04A.**
*Nenhuma alteração foi realizada em código ou banco de dados.*
