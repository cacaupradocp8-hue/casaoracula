# SPRINT 02 — Biblioteca Unificada + Redirects (Plano Técnico)

## 1. Identificação
**Projeto:** Casa Orácula
**Sprint:** 02
**Objetivo:** Consolidar a Biblioteca Unificada e separar a Biblioteca de Casos como área profissional protegida.

## 2. Inventário de Rotas e Componentes

### Rotas Oficiais (Pós-Sprint)
- `/biblioteca` -> `BibliotecaUnificada.tsx` (Abas: Simbólica, Pessoal, Travessias)
- `/biblioteca-casos` -> `BibliotecaCasos.tsx` (Protegida: Orácula/Admin)

### Redirects (Preservação de Legado)
- `/biblioteca-travessias` -> `/biblioteca?aba=travessias`
- `/biblioteca-das-travessias` -> `/biblioteca?aba=travessias`
- `/minha-biblioteca` -> `/biblioteca?aba=pessoal`

### Páginas de Detalhe (Mantidas)
- `/biblioteca-travessias/:familiaSlug` -> `BibliotecaTravessiasFamilia.tsx`
- `/biblioteca-das-travessias/:slug` -> `BibliotecaTravessiaDetalhe.tsx`

## 3. Estratégia de Implementação

### 3.1. Gating de UI (`src/pages/BibliotecaUnificada.tsx`)
- Filtrar o array `TABS` baseado no perfil do usuário.
- A aba `casos` só aparece para usuários com nível `oracula` ou `admin`.
- Se um usuário comum tentar acessar `?aba=casos` via URL, redirecionar para `simbolica`.

### 3.2. Roteamento (`src/App.tsx` e `src/routes/jornadaRoutes.tsx`)
- Em `App.tsx`: remover o redirect de `/biblioteca-casos` e transformá-lo em uma rota real.
- Aplicar `ProtectedRoute` com `minPortal="oracula"` (ou verificação de role equivalente já existente no projeto).
- Garantir que `BibliotecaCasos.tsx` (página) esteja importada corretamente.

## 4. Plano de Rollback
1. Reverter alterações em `src/App.tsx` (restaurar o redirect anterior de `/biblioteca-casos`).
2. Reverter filtro de abas em `src/pages/BibliotecaUnificada.tsx`.
3. Os componentes legados (`BibliotecaDasTravessias.tsx`, etc.) permanecem no sistema, garantindo integridade imediata.

## 5. Riscos e Mitigação
- **Risco:** Usuário comum acessando Casos via URL direta.
- **Mitigação:** `ProtectedRoute` no nível da rota e condicional no `TabsContent`.
- **Risco:** Links quebrados em e-mails ou materiais antigos.
- **Mitigação:** Redirects ativos para todas as rotas de entrada conhecidas.

## 6. Checklist de Sucesso
- [ ] `/biblioteca` renderiza abas Simbólica, Pessoal e Travessias para todos.
- [ ] Aba "Casos" invisível para usuários `visitante`, `pre_iniciada` e `iniciada` (comum).
- [ ] `/biblioteca-casos` renderiza conteúdo apenas para Admin/Orácula.
- [ ] Redirects `/biblioteca-travessias` etc. funcionando.
- [ ] Build e Typecheck OK.
