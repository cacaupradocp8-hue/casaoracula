

# Plano: Restaurar Sala da Visitante como Porta Principal

## Situacao Atual

- `/` (raiz) aponta para Auth (login) via PublicRoute
- `/sala-da-visitante` e ProtectedRoute que redireciona para `/salas/be626211-...` (pagina de sala do banco de dados)
- `/comece-aqui` redireciona para `/quiz/descubra-seu-eixo`
- `VisitorSalaContent` existe e funciona bem, mas esta embutido dentro de SalaDetalhe
- Visitantes autenticados (portal=visitante) caem no dashboard apos onboarding
- PublicRoute redireciona usuarios autenticados para `/dashboard-membro`

## Problemas

1. Nao existe rota standalone para a Sala da Visitante - ela depende de uma sala no banco de dados
2. Apos login, visitantes vao direto para dashboard, sem passar pela Sala
3. O CTA do VisitorSalaContent aponta para `/quiz/descubra-seu-eixo` (slug antigo) em vez de `/quiz/descubra-sua-voz`
4. Nao ha conexao clara com a Travessia 00

## Plano de Execucao

### 1. Criar pagina standalone `/sala-da-visitante`

Criar `src/pages/SalaDaVisitante.tsx` como pagina propria (nao redirect para sala do banco). Reutiliza `VisitorSalaContent` refatorado com layout AppLayout.

### 2. Refatorar `VisitorSalaContent`

- Atualizar CTA principal: "Descobrir minha Voz" → navega para `/quiz/descubra-seu-eixo` (manter slug existente que funciona)
- Adicionar indicacao visual da Travessia 00 como proximo passo apos o quiz
- Remover botao "Explorar a Casa" (gera confusao)
- Simplificar texto de boas-vindas para clareza em 3 segundos

### 3. Atualizar rotas em `App.tsx`

- `/sala-da-visitante` → pag