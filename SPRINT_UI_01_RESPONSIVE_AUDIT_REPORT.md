# SPRINT_UI_01_RESPONSIVE_AUDIT_REPORT

## 1. Admin Responsivo
**Arquivos analisados:** `src/pages/Admin.tsx`, `src/components/admin/AdminSidebar.tsx`

**Problemas encontrados:**
- A barra lateral administrativa ocupa espaço fixo horizontal em telas menores que `lg`, o que pode espremer o conteúdo principal.
- Em telas móveis, a sidebar colapsada (`w-14`) ainda ocupa espaço visual que poderia ser liberado para o conteúdo.
- Falta um componente de "Sheet" (Drawer) que oculte completamente a navegação em mobile e seja acionado por um botão de menu (hamburger).

**Risco:** Baixo (Ajustes de layout CSS).

---

## 2. Navegação Mobile
**Arquivos analisados:** `src/components/layout/Navigation.tsx`, `src/components/layout/BottomNavPreview.tsx`

**Problemas encontrados:**
- O menu mobile no `Navigation.tsx` é uma lista absoluta simples. Em dispositivos com entalhes (notches) ou barras de navegação do sistema, o preenchimento pode não ser o ideal.
- `BottomNavPreview` usa `pb-[env(safe-area-inset-bottom)]`, o que é excelente, mas o container pai no `AppLayout.tsx` precisa garantir que o conteúdo principal (`main`) tenha padding inferior suficiente para não ser sobreposto.

**Risco:** Baixo.

---

## 3. Larguras Fixas (Rigidez de UI)
**Padrões problemáticos encontrados:**
- **SelectTrigger rígido:** Usos de `w-[140px]`, `w-[180px]`, `w-[250px]` em dezenas de arquivos (ex: `AdminCursosTab.tsx`, `BibliotecaPessoal.tsx`, `GestosIntegracaoPage.tsx`). Isso causa quebra de alinhamento em telas estreitas (320px).
- **Cards com largura fixa:** Alguns componentes decorativos ou de vitrine usam `min-w-[280px]` ou similar sem considerar o fallback para `w-full` em telas menores.
- **Cabeçalhos de Table:** Colunas com `w-[200px]` fixo em tabelas forçam o scroll horizontal mesmo quando há espaço para fluidez.

**Risco:** Baixo.

---

## 4. Tabelas
**Arquivos analisados:** `src/pages/labirinto/LabirintoTabela.tsx`, `src/components/qa-jardim/*.tsx`

**Problemas encontrados:**
- Uso de `min-w-[720px]` é uma solução segura para evitar compressão de dados, mas não é a ideal para UX mobile.
- Tabelas complexas em `AdminMatriculasTab` ou `AdminUsersTab` (prováveis locais) podem ser ilegíveis em mobile sem uma transformação para formato de "Cards".

**Risco:** Médio (Transformar tabelas em cards exige cuidado visual).

---

## 5. Grids
**Arquivos analisados:** `src/components/courses/CourseGrid.tsx`, `src/pages/MapaVivoList.tsx`

**Problemas encontrados:**
- Breakpoints padrão (`md:grid-cols-2 lg:grid-cols-3`) são funcionais, mas em telas muito grandes (Ultrawide) deixam o conteúdo muito esticado ou com espaços vazios laterais excessivos se o container for muito largo.
- Falta de um breakpoint intermediário (`sm:grid-cols-2`) para telas de 640px.

**Risco:** Muito Baixo.

---

## 6. Formulários
**Arquivos analisados:** `src/pages/Auth.tsx`, abas do painel Admin.

**Problemas encontrados:**
- `Auth.tsx`: O `GlassContainer` tem padding fixo que consome muito espaço em telas de 320px-360px.
- Botões de formulário nem sempre ocupam a largura total (`w-full`) em mobile, dificultando o toque (touch target).

**Risco:** Baixo.

---

## 7. Tipografia e Containers
**Arquivos analisados:** `src/components/ui/ResponsiveContainer.tsx`, `src/index.css`

**Problemas encontrados:**
- `ResponsiveContainer` tem max-widths bem definidos, mas não é aplicado consistentemente em todas as rotas de "páginas de conteúdo".
- Variáveis `--section-gap` e `--container-gap` são usadas pontualmente, mas muitos componentes ainda injetam `py-20` ou `gap-8` hardcoded, ignorando a fluidez do `clamp`.

---

## Proposta de Divisão em Blocos

### Bloco 1: Flexibilização de Inputs e Grids (Prioridade Máxima)
- Substituir `w-[...px]` por `w-full sm:w-[...px]` em todos os `SelectTrigger`.
- Ajustar `CourseGrid` e `MapaVivoList` para breakpoints mais fluidos (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
- **Risco:** Mínimo.

### Bloco 2: Navegação e Layout Estrutural
- Refatorar `AdminSidebar` para usar o componente `Sheet` (Drawer) do shadcn em telas menores que `lg`.
- Ajustar o padding inferior global no `AppLayout` para telas móveis.
- **Risco:** Baixo/Médio.

### Bloco 3: Formulários e Tabelas
- Ajustar padding responsivo no `Auth.tsx`.
- Implementar wrapper de scroll e min-width inteligente em tabelas administrativas críticas.
- **Risco:** Baixo.

## Recomendação Inicial
Iniciar pelo **Bloco 1**, pois remove a rigidez mais visível (Selects e Grids) com impacto zero na estrutura de navegação, sendo uma vitória rápida para a usabilidade imediata.
