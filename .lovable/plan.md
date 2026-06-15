## Diagnóstico

A estação **Casa da Boa Menina** existe corretamente no banco:
- `slug: casa-da-boa-menina`, `numero: 2`, `ativa: true`, `publicada: true`, `rota_id` vinculado à Rota dos Lobos.
- A rota direta `/clube/rota/casa-da-boa-menina` carrega a estação sem problema.

O bug está em **`src/pages/clube/ClubeRotaHub.tsx`**, no grid de estações da Rota dos Lobos:

```ts
status: idx === 0 ? 'unlocked' : 'locked'
```

Esse mock força **toda estação a partir da nº 2 a ficar travada** (cinza, `pointer-events-none`), independente do que esteja no banco ou da progressão da aluna. Por isso a Casa da Boa Menina não fica clicável a partir do hub.

## Plano de correção

Regra de desbloqueio aprovada: **admin destrava tudo; aluna segue desbloqueio sequencial conforme conclusão**.

### 1. Hook de progresso por rota
Criar `src/hooks/useRotaProgresso.ts`:
- Lê `clube_conclusao_estacoes` (já existe) para o `user_id` atual, filtrando pelas estações da rota.
- Retorna um `Set<string>` com os `estacao_id` concluídos.
- Também expõe `isAdmin` consultando `has_role(auth.uid(), 'admin')` via RPC já existente no projeto (reutilizar helper `useUserRole` se houver; senão consulta direta a `user_roles`).

### 2. Função de status por estação
Em `ClubeRotaHub.tsx`, substituir o mock por:

```text
ordem ascendente das estações (já vem ordenada)
para cada estação i:
  if admin              -> 'unlocked' (ou 'completed' se concluída)
  else if i === 0       -> concluída ? 'completed' : 'unlocked'
  else if estação i-1 concluída -> concluída(i) ? 'completed' : 'unlocked'
  else                  -> 'locked'
```

Estações sem `publicada/ativa = true` continuam `locked` mesmo para aluna (admin ainda enxerga aberto, conforme regra "admin bypassa").

### 3. Passar status correto ao `RotaEstacoesGrid`
Sem mudanças estruturais no componente — ele já suporta os três estados `locked | unlocked | completed`.

### 4. Garantir clique na Casa da Boa Menina hoje
Validação manual após o fix:
- Admin: card da Casa da Boa Menina aparece destravado e abre `/clube/rota/casa-da-boa-menina`.
- Aluna com Clareira do Chamado concluída em `clube_conclusao_estacoes`: Casa da Boa Menina destravada.
- Aluna sem conclusão da Estação 1: Casa da Boa Menina permanece travada (cadeado), sem regressão.

## Fora de escopo
- Não alterar conteúdo da Casa da Boa Menina (já refinado em sprints anteriores).
- Não mexer no gating de `/clube/rotas` (catálogo) — o warning de console é da rota de catálogo para visitante, comportamento esperado.
- Não criar tabelas novas, não mexer em RLS (`clube_conclusao_estacoes` e `user_roles` já têm policies).
- Nenhuma mudança em rotas, auth ou pagamentos.

## Arquivos afetados
- `src/hooks/useRotaProgresso.ts` (novo)
- `src/pages/clube/ClubeRotaHub.tsx` (substituir mock de status)
