## Estado atual (descoberto na inspeção)

A estrutura de banco já está construída — só não está sendo aproveitada pelo admin:

- `clube_estacoes` — Estações (Mês 1, Mês 2…) ✅ existe
- `clube_rota_itens` — Passos da rota, com `tipo_passo`, `ordem`, `impacto_cidadela` (JSONB) ✅ existe
- `clube_rota_progresso` e `clube_progresso_passos` — Progresso da aluna ✅ existem
- Função `get_clube_proximo_passo()` ✅ existe
- Trigger `aplicar_impacto_cidadela()` ✅ existe e já escreve em `cidadela_mapa_vivo`

**Problema:** O admin (`/admin/clube`) ainda mostra abas antigas (Ciclos, Livros, Encontros) escrevendo em tabelas legadas (`club_cycles`, `club_books`). A nova arquitetura está órfã.

## O que será feito

### 1. Reescrever `AdminClubeOracularTab.tsx`

Trocar as 3 abas antigas por uma navegação hierárquica:

```text
[Lista de Estações]
    └─ clicar →  [Detalhe da Estação + Lista de Passos]
                      └─ clicar passo →  [Editor do Passo]
```

- **Lista de Estações:** cards com número, título, fase lunar, livro, status (ativa/publicada), contagem de passos. Botão "Nova Estação".
- **Detalhe + Passos:** cabeçalho com dados da estação + lista vertical numerada dos passos:
  ```
  [1] Portal       — A voz silenciada           ⚙️
  [2] Escuta       — Áudio 8 min                ⚙️
  [3] Aplicação    — Gesto do dia               ⚙️
  [4] Registro     — Carta para si              ⚙️
  [5] Integração   — Selo da rota               ⚙️
  ```
  Botões para reordenar (↑/↓), editar, duplicar, remover, e "Adicionar Passo".

### 2. Editor de Passo (dialog único)

Substitui a fragmentação atual (portal/áudio/lab em telas diferentes). Campos:

- `tipo_passo`: Portal | Escuta | Aplicação | Registro | Integração
- `titulo`, `subtitulo`, `icone`, `ordem`, `obrigatorio`, `publicado`
- `conteudo_inline` (JSONB) — texto, URL de áudio, instruções da ação
- `impacto_cidadela` (JSONB editável via formulário amigável):
  - distrito (select)
  - tipo_impacto (ativação | estabilização)
  - intensidade (1–3)
  - condicao (opcional)

### 3. UI da aluna — fluxo do próximo passo

Atualizar a tela do Clube da aluna para:

- Buscar `get_clube_proximo_passo(user_id, estacao_id)`
- Mostrar apenas: "Você está aqui" + **próximo passo único** + impacto esperado
- Ao concluir → INSERT em `clube_progresso_passos` (a trigger já cuida da CidaDELA)
- Não exibir a lista inteira (foco linear)

### 4. Legado preservado

As tabelas antigas (`club_cycles`, `club_books`, `clube_portais`, `clube_livro_escutas`) **não serão apagadas**. Apenas removidas do caminho oficial do admin. Permanecem acessíveis por outras telas/admins existentes.

## Detalhes técnicos

- Arquivos novos/alterados:
  - `src/components/admin/AdminClubeOracularTab.tsx` (reescrita completa)
  - `src/components/admin/clube/EstacaoDetalhe.tsx` (novo)
  - `src/components/admin/clube/PassoEditor.tsx` (novo)
  - `src/components/admin/clube/ImpactoCidadelaForm.tsx` (novo)
  - `src/pages/clube/ProximoPasso.tsx` (atualizar/criar) — UI da aluna
- Sem migration: schema já suporta tudo.
- RLS: validar que `clube_rota_itens`, `clube_estacoes` e `clube_progresso_passos` têm policies de admin/aluna corretas (verificar e ajustar se necessário, com migration mínima caso falte).

## Resultado

- Admin deixa de ser CMS fragmentado e passa a ser "designer de jornada".
- Aluna vive um fluxo linear (um passo por vez).
- Cada passo concluído altera a CidaDELA automaticamente via trigger já existente.