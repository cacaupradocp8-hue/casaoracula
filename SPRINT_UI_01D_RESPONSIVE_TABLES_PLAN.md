# SPRINT UI-01D — Responsive Tables Plan

## 1. Arquivos com Tabelas Identificados
- `src/components/admin/AdminPlanosTab.tsx`
- `src/components/admin/AdminProgressoTab.tsx`
- `src/components/admin/AdminMatriculasTab.tsx`
- `src/components/admin/AdminSalasTab.tsx`
- `src/components/admin/AdminSessoesTab.tsx`
- `src/components/admin/AdminUsersTab.tsx` (Nota: usa Cards, mas possui elementos que podem se beneficiar de melhor responsividade)
- `src/components/admin/AdminRadiestesiaTab.tsx`
- `src/components/admin/AdminTorreVivaTab.tsx`

## 2. Diagnóstico Geral
- **Problema Mobile:** As tabelas utilizam o componente `<Table>` do shadcn/ui, que por padrão não lida com overflow horizontal se não for explicitamente envolvido em um container de scroll.
- **Consequência:** Quebra de layout, "estiramento" da página ou corte de colunas importantes (especialmente as de "Ações" que ficam à direita).
- **Inputs e Badges:** Em tabelas como a de Planos, os inputs de número e badges de status ocupam largura fixa que, somada, excede os 390px do mobile.

## 3. Implementação Proposta
- **Container de Scroll:** Envolver todos os componentes `<Table>` em uma `div` com as classes `overflow-x-auto w-full` ou utilizar o componente `<ScrollArea>` onde for mais apropriado para manter o design system.
- **Largura Mínima:** Definir um `min-w-[600px]` ou `min-w-[800px]` (dependendo da densidade de dados) na tag `<table>` para garantir que o conteúdo não seja comprimido a ponto de ficar ilegível.
- **Preservação Total:** Nenhuma lógica de fetch (Supabase), filtros, queries ou ações de botões será alterada. A mudança é puramente estrutural em volta do JSX da tabela.

## 4. Mudanças por Arquivo (Exemplos)

### `src/components/admin/AdminProgressoTab.tsx`
- **Problema:** Tabela densa com nome, portal, formação, barra de progresso e data.
- **Alteração:** Envolver a `<Table>` em um container de scroll.
- **Classes Novas:** `<div className="overflow-x-auto"><Table className="min-w-[800px]">...`
- **Risco:** Zero (visual).

### `src/components/admin/AdminMatriculasTab.tsx`
- **Problema:** Ações de exclusão e badges de status podem ser empurrados para fora da tela.
- **Alteração:** Adicionar container de scroll horizontal.
- **Classes Novas:** `<div className="overflow-x-auto"><Table className="min-w-[700px]">...`

### `src/components/admin/AdminPlanosTab.tsx`
- **Problema:** Já possui `ScrollArea`, mas pode precisar de um ajuste de `min-width` na tabela interna para evitar compressão dos inputs.

## 5. Regras Absolutas
- **NÃO** alterar queries do Supabase ou lógica de banco.
- **NÃO** alterar permissões (RLS) ou autenticação.
- **NÃO** remover colunas ou dados estratégicos.
- **NÃO** alterar rotas protegidas ou fluxos de pagamento.
- **NÃO** realizar publicação automática.

## 6. Critérios de Validação
- **Mobile (390px):** A página administrativa não deve ter scroll horizontal; apenas a área interna da tabela deve permitir o deslizamento lateral.
- **Interatividade:** Botões de salvar, excluir e badges clicáveis devem permanecer 100% funcionais dentro do scroll lateral.
- **Visual:** Títulos de colunas alinhados e legibilidade preservada.
- **Build:** `npm run build` deve ser concluído sem erros.
