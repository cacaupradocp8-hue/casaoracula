# Plano — Etapa 277: Separar Rota, Obra-base e Estação

Restrito a `clube_estacoes` e `clube_rota_itens`. Sem migration, sem RLS, sem alterar visão da aluna, sem alterar Rota dos Lobos, sem v3.

## 1. `AdminCentralCasa.tsx` — remover hardcode

- Substituir o card fixo "Rota dos Lobos" por um bloco **dinâmico** que lê `clube_estacoes` e agrupa por `livro_titulo`.
- Lista todas as Rotas detectadas (grupos por obra-base), destacando a primeira como principal.
- Texto "6 Estações Mapeadas / 12 Portais Ativos" passa a ser calculado (contagem real por grupo) — sem números fixos.
- Botão "Nova Estação" no header continua existindo, mas deixa de ser o caminho de criação de rota; abre `/admin/clube/ciclos`.
- Mantém botão "Ver como Aluna" intocado.

## 2. `AdminRotasCasa.tsx` — separar 3 fluxos

Substituir o diálogo único "Criar Nova Rota" por **três ações distintas**, todas como rascunho:

### a) Criar Rota (apenas metadado lógico)
- Não cria estação. Apenas registra um item leve em `clube_rota_itens` do tipo "marcador de rota":
  - `tipo = 'rota_marker'`
  - `titulo = <nome da rota>`
  - `publicado = false`
  - `estacao_id = null` (ou referenciando um placeholder se a coluna for NOT NULL — nesse caso, ajustar para criar via vínculo posterior).
- Se `estacao_id` for NOT NULL em `clube_rota_itens`, fallback: persistir a Rota como **registro sem estação ainda**, armazenando em `clube_estacoes` apenas quando o admin adicionar a 1ª Obra (passo b). Nesse fallback, manter Rotas "vazias" em memória local até receberem a primeira obra — exibidas no painel como "Rota sem obra".
- A escolha entre os dois caminhos será confirmada lendo o schema de `clube_rota_itens` no momento da implementação.

### b) Adicionar Obra-base a uma Rota
- Diálogo separado: seleciona Rota existente + define `livro_titulo`, `livro_autor`, `livro_capa_url` (opcional).
- Cria **uma estação rascunho** em `clube_estacoes`:
  - `numero = próximo livre dentro da rota`
  - `titulo = <obra>` (sem "Estação I - <rota>")
  - `livro_titulo = <obra>`
  - `ativa = false`, `publicada = false`.
- A obra é o que ancora estações ao agrupamento de rota.

### c) Adicionar Estação a uma Obra
- Diálogo separado: seleciona Obra (livro_titulo existente) + título da estação + número.
- Cria estação em `clube_estacoes` com `ativa = false`, `publicada = false`.

### Listagem
- A página passa a listar **Rotas → Obras → Estações** de forma hierárquica, agrupando `clube_estacoes` por `livro_titulo` e por marcador de rota (quando aplicável).
- Cada nível mostra contagens reais e status (Rascunho/Ativa).

## 3. Remover criação automática de estação ao criar rota

- O fluxo atual (insert direto em `clube_estacoes` ao "Criar Nova Rota") é eliminado.
- Criar Rota nunca insere estação; criar Obra é o que insere a primeira estação rascunho.

## 4. Garantias

- Nenhuma estação nova nasce com `ativa: true` ou `publicada: true`.
- Nenhuma alteração em `useTodasRotas`, no player, em rotas públicas `/clube/*`, ou no conteúdo da Rota dos Lobos.
- Nenhuma migration; só `INSERT/SELECT` em `clube_estacoes` e `clube_rota_itens`.
- `Ver como Aluna` segue o item selecionado (já corrigido em etapa anterior).

## Arquivos afetados

- `src/pages/admin/AdminCentralCasa.tsx` — dinamização do bloco de Rotas.
- `src/pages/admin/AdminRotasCasa.tsx` — três diálogos separados + listagem hierárquica.
- (Possível) novo helper `src/lib/dal/rotasAdmin.ts` para encapsular leituras/escritas em `clube_estacoes` e `clube_rota_itens`.

## Validação

- Inspeção do schema de `clube_rota_itens` antes de implementar a persistência da Rota (passo 2a) para decidir entre marcador ou fallback.
- Confirmar build limpo e que `/clube` da aluna permanece idêntico.
