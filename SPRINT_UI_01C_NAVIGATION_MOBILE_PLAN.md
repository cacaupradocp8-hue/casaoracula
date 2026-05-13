# SPRINT UI-01C — Navigation Mobile Plan

## 1. Diagnóstico Atual
- **Menu Mobile (`Navigation.tsx`):**
  - Utiliza uma div absoluta (`absolute top-16`) que aparece abaixo do header.
  - Não possui scroll próprio (`overflow-y-auto`), o que pode causar corte de itens em telas pequenas ou se o menu crescer.
  - A animação `animate-slide-up` é básica.
  - Itens aninhados são tratados com um estado simples de expansão (`mobileExpandedGroup`), mas sem limites de altura.
  - Não utiliza `safe-area-inset` para dispositivos com notch/home-indicator.
- **Barra Inferior (`BottomNavPreview.tsx`):**
  - Fixa no rodapé com `bottom-4`.
  - Já possui `pb-[env(safe-area-inset-bottom)]`, mas o container pai pode precisar de ajustes de altura dinâmica para não sobrepor conteúdos importantes em telas de 390px.
- **Problemas em 390px:** O menu mobile pode ocupar grande parte da tela, dificultando a visualização se houver muitos itens aninhados abertos.

## 2. Proposta de Implementação
- **Melhoria no Menu Mobile:**
  - Adicionar `max-h-[calc(100vh-4rem)]` e `overflow-y-auto` ao menu mobile para garantir que todos os itens sejam acessíveis via scroll.
  - Aplicar `pb-[env(safe-area-inset-bottom)]` na base do menu.
  - Refinar o espaçamento interno para evitar que os botões pareçam "espremidos" em telas estreitas.
- **Melhoria no BottomNav:**
  - Revisar se a margem `bottom-4` é a melhor solução para dispositivos modernos ou se deve encostar na base com padding interno maior.
- **Preservação:**
  - Desktop (layout acima de `lg`) não será alterado.
  - Rotas, permissões e lógica de autenticação permanecem intactas.

## 3. Mudanças por Arquivo

### `src/components/layout/Navigation.tsx`
- **Problema:** Menu mobile sem scroll e sem tratamento de safe-area.
- **Alteração:** 
  - Adicionar `overflow-y-auto` e `max-h-[calc(100vh-4rem)]`.
  - Adicionar `pb-[env(safe-area-inset-bottom,1.5rem)]` para dispositivos móveis.
- **Risco:** Baixo.
- **Validação:** Abrir o menu em um simulador mobile e expandir todos os grupos para verificar o scroll.

### `src/components/layout/BottomNavPreview.tsx`
- **Problema:** Posicionamento flutuante que pode sobrepor elementos do rodapé em páginas densas.
- **Alteração:** 
  - Ajustar o padding e verificar se o `z-index` está correto (já está em 50).
  - Garantir que a área de toque seja generosa o suficiente.
- **Risco:** Mínimo.
- **Validação:** Verificar em 390px se a barra está centralizada e não interfere no clique de botões de rodapé das páginas.

## 4. Regras Absolutas
- **NÃO** alterar rotas ou lógica de acesso.
- **NÃO** alterar autenticação ou backend.
- **NÃO** alterar o conteúdo estratégico dos menus (labels ou ícones).
- **NÃO** alterar pagamentos ou subscriptions.

## 5. Critérios de Validação
- **Mobile (390px):** Menu principal abre e permite scroll se os itens excederem a tela.
- **Safe Area:** Menu respeita o fundo da tela em iPhones com notch.
- **Menus Aninhados:** Abrir um sub-menu não "quebra" o layout ou empurra o menu para fora da tela.
- **Build:** `npm run build` sem erros.
