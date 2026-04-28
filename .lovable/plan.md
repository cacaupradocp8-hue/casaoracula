Plano para corrigir a rolagem no Hub Editorial do Clube de Leitura

Diagnóstico
- A página principal do `/admin/clube` já rola.
- O problema aparece nos editores internos, especialmente nas abas e modais de edição do Clube.
- Há dois pontos frágeis:
  1. Modais com `DialogContent` usando `max-h-[90vh] overflow-hidden flex flex-col` + `ScrollArea className="flex-1"`. Em alguns tamanhos de tela, o `flex-1` não recebe altura real suficiente e a área interna não rola corretamente.
  2. Páginas de edição com abas largas/grades fixas que podem ficar presas ou cortadas em viewport menor, principalmente no admin com menu lateral e barra inferior.

Correção proposta

1. Criar um padrão seguro para modais longos do admin
- Trocar o padrão problemático:
  - `max-h-[90vh] p-0 overflow-hidden flex flex-col`
  - `ScrollArea className="flex-1 ..."`
- Para um padrão com altura explícita e rolagem real:
  - `max-h-[calc(100dvh-2rem)] overflow-y-auto`
  - conteúdo com `pb-24` quando houver botão fixo inferior
- Aplicar nos editores do Clube que usam formulários longos.

2. Ajustar os editores do Clube de Leitura
- Corrigir `PassosRotaTab.tsx`:
  - modal de “Editar Passo / Novo Passo” deve rolar internamente de forma confiável
  - botão salvar deve continuar acessível
- Corrigir `SemanasTab.tsx`:
  - modal “Configurar Portal / Novo Portal” deve permitir rolar todas as quatro camadas
  - rodapé com Cancelar/Salvar deve permanecer visível sem esconder campos
- Revisar abas semelhantes em `AdminCentralEstacao.tsx` para evitar corte em telas menores.

3. Melhorar a rolagem da página de edição
- Em `AdminCentralEstacao.tsx`, remover dependência de container com largura/altura que possa prender conteúdo.
- Adicionar respiro inferior (`pb-32`) na página da estação para não ficar atrás da barra inferior.
- Tornar a lista de abas responsiva:
  - em telas menores, permitir quebra/overflow horizontal seguro
  - evitar que os botões das abas comprimam o editor.

4. Ajustar especificamente o editor de Portais Simbólicos
- Em `AdminPortalCMS.tsx`, garantir que a coluna do formulário tenha margem inferior suficiente.
- Revisar o botão “Salvar Portal” sticky para não cobrir o último bloco do formulário.
- Se necessário, transformar o botão final em rodapé seguro com espaçamento inferior.

Arquivos a alterar
- `src/components/admin/central-jornadas/PassosRotaTab.tsx`
- `src/components/admin/central-jornadas/SemanasTab.tsx`
- `src/pages/admin/clube/AdminCentralEstacao.tsx`
- `src/pages/admin/clube/AdminPortalCMS.tsx`

Resultado esperado
- Ao abrir qualquer aba/editor do Hub Editorial do Clube de Leitura, a página ou o modal poderá rolar normalmente.
- Todos os campos longos ficarão acessíveis.
- Botões de salvar/cancelar não ficarão escondidos nem cobrirão campos.
- A correção mantém a estrutura atual do admin e não altera banco de dados, permissões ou conteúdo.