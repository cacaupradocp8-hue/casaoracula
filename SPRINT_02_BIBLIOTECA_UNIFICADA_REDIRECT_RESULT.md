# SPRINT 02 — Biblioteca Unificada + Redirects (Resultado)

## 1. Identificação
**Projeto:** Casa Orácula
**Sprint:** 02
**Status:** Concluída e Validada

## 2. Alterações Realizadas

### 2.1. Roteamento (`src/App.tsx`)
- **Restaurada Rota:** `/biblioteca-casos` agora renderiza o componente `BibliotecaCasos` (página dedicada).
- **Proteção Aplicada:** Rota envolta em `ProtectedRoute minPortal="oracula"`.
- **Importação:** Adicionada importação lazy de `BibliotecaCasos`.

### 3.2. Redirects de Legado (`src/routes/jornadaRoutes.tsx` e `src/App.tsx`)
- Centralizado redirect de `/minha-biblioteca` -> `/biblioteca?aba=pessoal` em `jornadaRoutes.tsx`.
- Mantidos redirects de `/biblioteca-travessias` e `/biblioteca-das-travessias` para a aba correspondente na unificada.
- Preservadas rotas de detalhe `/:slug` e `/:familiaSlug`.

### 3.3. Gating de UI (`src/pages/BibliotecaUnificada.tsx`)
- Implementado filtro de abas dinâmico usando `useEffectivePortal`.
- Aba "Casos Clínicos" agora é condicionada a `oracula` ou `admin`.
- Adicionado redirecionamento preventivo caso o usuário acesse `?aba=casos` via URL sem permissão.
- Ajustado layout das abas (`grid-cols-X`) para se adaptar ao número de abas visíveis.

## 3. Matriz de Validação (Perfis)

| Rota | Visitante / Iniciada | Orácula | Admin |
| :--- | :--- | :--- | :--- |
| `/biblioteca` | Acessa (3 abas) | Acessa (4 abas) | Acessa (4 abas) |
| `/biblioteca-casos` | Bloqueado (Guard) | Acessa | Acessa |
| `/minha-biblioteca` | Redirect OK | Redirect OK | Redirect OK |
| `/biblioteca-travessias`| Redirect OK | Redirect OK | Redirect OK |

## 4. Rollback
Para reverter:
1. Em `src/App.tsx`, reverter a rota `/biblioteca-casos` para ser um `Navigate to="/biblioteca?aba=casos"`.
2. Em `src/pages/BibliotecaUnificada.tsx`, remover o filtro `filteredTabs` e voltar a mapear `TABS` diretamente com `grid-cols-4`.

## 5. Garantia de Integridade
- **Banco de Dados:** Nenhuma alteração.
- **RLS:** Nenhuma alteração.
- **Edge Functions:** Nenhuma alteração.
- **Auth:** Nenhuma alteração nas regras globais.
- **Narroterapia/Casa das Máquinas:** Inalteradas.
