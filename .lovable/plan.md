## Sistema de Rotas Premium — Plano em 3 Fases

Hoje a Rota "O Chamado Selvagem" (`/clube/rota/:slug`) já lê de `clube_estacoes` + `clube_rota_itens` + `clube_rota_progresso` via `useRotaOracular`. Mas: (1) a página tem fallbacks hardcoded por toda parte (áudios mock, perguntas mock, cenário mock, capa Unsplash); (2) o Admin atual (`RotaDoLivroEditor`, `PassoEditor`, `EstacoesPassosManager`) não expõe todos os campos premium; (3) não existe um catálogo de rotas — só a "atual".

As 3 fases atacam isso em ordem para evitar retrabalho: dados primeiro, ferramenta de cadastro depois, vitrine por último.

---

### FASE 1 — Página de Rota 100% DB-driven (sem mocks)

**Objetivo:** zerar fallbacks hardcoded em `ClubeRotaPremium.tsx`. Tudo que aparece na tela vem do banco. Se não há dado, a seção esconde com elegância (não mostra placeholder mock).

**Mudanças:**
- `ClubeRotaPremium.tsx`:
  - Remover fallback de `audios` (mock Unsplash, "Áudio de integração", duração "—")
  - Remover fallback de `perguntasSugeridas` (lobo/força/símbolos)
  - Remover fallback de `simulacaoTexto` (string genérica)
  - Remover fallback de `jardimPrompt` (string das peles)
  - Remover capa Unsplash em "Converse com o livro"
  - Cada seção (áudios / chat-livro / simulação / jardim) só renderiza se houver conteúdo real. Se vazio: seção some.
- `useRotaOracular`:
  - Adicionar campo `descricao` ao select de `clube_rota_itens` (hoje cast `as any`).
  - Resolver áudios via `clube_audio_tracks` ou `clube_portal_audios` quando `ref_tipo='audio'`, em vez de só `metadata.audios`.
  - Resolver perguntas sugeridas via `clube_livro_perguntas` quando `ref_tipo='chat_livro'`.
- `RotaAtualHero.tsx` (home): garantir que progresso, CTA "continuar" e segmentos vêm de `pontos`/`progressoRota` reais (auditar).
- Marcar item como `in_progress` ao entrar na página da rota (criar registro em `clube_rota_progresso` com status `in_progress` se ainda não existe).

**Entrega:** `/clube/rota/:slug` mostra exatamente o que estiver cadastrado, nada mais. Se uma rota não tem áudios, a seção de áudios não aparece. Aluna nunca vê texto mock.

---

### FASE 2 — Admin CRUD de Rotas (cobertura completa)

**Objetivo:** Admin consegue criar uma rota nova de ponta a ponta sem editar SQL. Todos os campos premium expostos.

**Mudanças:**
- Auditar `RotaDoLivroEditor.tsx` + `PassoEditor.tsx` + `PassosRotaTab.tsx`. Garantir formulário com:
  - **Identificação:** `titulo`, `subtitulo`, `slug`, `ordem`, `obrigatorio`, `publicado`, `icone`, `image_url`
  - **Cartografia:** `porta`, `campo`, `torre`, `labirinto`, `frase_guia`
  - **Conteúdo da travessia:** `jardim_prompt`, `cenario_treinamento`, `leitura_referencia`
  - **Referência:** `tipo`, `ref_tipo`, `ref_id` (com seletor por tipo: portal, áudio, aula, chat-livro, jardim, etc.), `rota_custom`
  - **Metadata estruturada (JSON form):** áudios `[{titulo, url, tipo, duracao}]`, `perguntas_sugeridas: string[]`
  - **Impacto na CidaDELA:** `impacto_cidadela` (lista de `{distrito, intensidade, tipo_impacto}`)
- Editor da Estação (rota macro): banner, livro (título/autor/capa), essência (núcleo/tensão/transformação), status `ativa`/`publicada`.
- Botão "Visualizar como aluna" abre `/clube/rota/:slug` em nova aba para preview.
- Validação: aviso se a rota não tem nenhum item publicado, se faltam campos de cartografia, se `ref_tipo` exige `ref_id` e está vazio.

**Entrega:** Admin → Clube → Estações → seleciona uma estação → cria/edita rota completa pela UI. Nada precisa ser inserido manualmente no banco.

---

### FASE 3 — Catálogo de Rotas (Hub Netflix)

**Objetivo:** página `/clube/rotas` com TODAS as estações (não só a ativa), com lock progressivo, estilo Netflix + Apple.

**Mudanças:**
- Nova página `src/pages/clube/ClubeRotasCatalogo.tsx`:
  - Grid de estações (cards grandes, capa do livro, gradiente midnight/gold).
  - Estado de cada card: **Concluída** (Check gold), **Em curso** (badge "Você está aqui" + progresso %), **Disponível** (CTA "Iniciar"), **Bloqueada** (cadeado, mostra preview borrado estilo Netflix premium).
  - Filtros: Todas / Em curso / Concluídas / Próximas.
  - Hover/tap revela: livro, autor, núcleo simbólico, número de fases.
  - Click em rota disponível/concluída → `/clube/rota/:slug` (primeira fase). Bloqueada → modal "Conclua a rota X para liberar".
- Novo hook `useTodasRotas()`: lista todas `clube_estacoes` publicadas + agrega progresso do usuário por estação.
- Lógica de lock: estação N só desbloqueia quando estação N-1 tem 100% dos itens obrigatórios concluídos. Admin sempre vê tudo.
- Adicionar rota `/clube/rotas` em `clubeRoutes.tsx`.
- Link no `BottomNav` do Clube e no `RotaAtualHero` ("Ver todas as rotas").

**Entrega:** Aluna entra em `/clube/rotas`, vê o mapa completo da jornada (passado, presente, futuro bloqueado), entende que existe muito além da rota atual. Sensação de jornada infinita.

---

### Detalhes técnicos

**Tabelas envolvidas (já existem, sem migration nesta fase):**
- `clube_estacoes` — rota macro (livro + essência)
- `clube_rota_itens` — fases/passos da rota (com cartografia + metadata)
- `clube_rota_progresso` — progresso por usuária/item (`status`: not_started/in_progress/completed)
- `clube_audio_tracks`, `clube_livro_perguntas` — fontes secundárias para Fase 1

**Trigger existente:** `aplicar_impacto_cidadela()` já roda em `clube_progresso_passos` ao concluir um passo. Verificar se também roda quando `clube_rota_progresso.status` vira `completed` — se não, adicionar trigger equivalente nessa tabela (migration pequena na Fase 1, opcional).

**Sem novo schema:** o plano usa só o que já está no banco. Migrações só se aparecer um campo faltando durante implementação.

**Ordem de execução:** Fase 1 → 2 → 3, sequencial. Cada uma é entregável standalone.

---

### Confirmação antes de começar

Ao aprovar, eu inicio a **Fase 1** imediatamente. Fases 2 e 3 entram em mensagens seguintes (uma por vez, para você revisar entre elas).
