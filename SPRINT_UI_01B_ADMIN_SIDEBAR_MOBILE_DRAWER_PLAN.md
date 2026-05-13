# SPRINT UI-01B — AdminSidebar Mobile Drawer Plan

## 1. Arquivos que serão analisados e alterados
- `src/pages/Admin.tsx`: Responsável por orquestrar o layout principal do painel administrativo.
- `src/components/admin/AdminSidebar.tsx`: Componente da barra lateral que precisa de ajustes para ser usado tanto em desktop (fixo) quanto em mobile (drawer).

## 2. Diagnóstico Atual
- **Desktop:** A sidebar é fixa com largura de `w-64` (ou `w-14` colapsada), ocupando espaço lateral no container flex.
- **Mobile:** A sidebar tenta manter o comportamento flex, o que "espreme" o conteúdo principal ou gera overflow horizontal dependendo do tamanho da tela.
- **Interação:** Não existe um botão de menu (hamburger) para alternar a visibilidade no mobile.
- **Componentes:** O projeto já possui `src/components/ui/sheet.tsx`, que é o componente ideal para implementar o Drawer.

## 3. Proposta de Implementação

### src/pages/Admin.tsx
- Adicionar estado `isMobileMenuOpen` (boolean).
- Implementar um botão flutuante ou fixo no topo (visível apenas abaixo de `lg`) com o ícone `Menu`.
- Envolver a sidebar em um componente `Sheet` (Drawer) para resoluções menores que `lg`.
- Manter a sidebar original como `hidden lg:block` para desktop.
- Garantir que o conteúdo principal (`flex-1`) ocupe 100% da largura no mobile.

### src/components/admin/AdminSidebar.tsx
- Adicionar uma prop opcional `onItemClick` ou similar.
- No `Admin.tsx`, passar uma função para fechar o Drawer quando um item for selecionado.
- Ajustar os paddings internos se necessário para o contexto do Drawer.

## 4. Regras de Segurança
- **Sem alteração de permissões:** As verificações de acesso no `Admin.tsx` ou rotas não serão tocadas.
- **Sem alteração de rotas:** A navegação continuará funcionando via `useNavigate` e `searchParams`.
- **Sem alteração de backend:** Nenhuma chamada ao Supabase ou Edge Functions será modificada.
- **Preservação do Desktop:** O layout atual para telas grandes não deve sofrer alterações visuais.

## 5. Critérios de Validação
- **Mobile (390px):** Sidebar oculta por padrão; botão de menu presente; ao abrir, a sidebar ocupa a tela (estilo Drawer); ao clicar em uma aba, o Drawer fecha e o conteúdo troca.
- **Tablet:** Comportamento semelhante ao mobile ou desktop dependendo do breakpoint (ajustaremos para `lg:block`).
- **Desktop:** Sidebar continua fixa à esquerda, funcional e colapsável.
- **Build:** `npm run build` deve passar sem erros de tipagem.
- **Visual:** Conteúdo administrativo não deve ter scroll horizontal.

## 6. Ordem de Implementação
1. Modificar `AdminSidebar.tsx` para aceitar fechamento externo.
2. Atualizar `Admin.tsx` com a lógica de `Sheet` e botão de toggle.
3. Testar responsividade e ajuste de breakpoints.
