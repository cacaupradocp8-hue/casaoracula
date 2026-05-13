# SPRINT_UI_01A_GRIDS_INPUT_WIDTHS_PLAN

## Objetivo
Corrigir problemas de grids responsivos e larguras rígidas de inputs/componentes, garantindo que a interface se adapte fluidamente a todos os tamanhos de tela (mobile-first), sem alterar regras de negócio ou lógica do sistema.

## 1. Lista de Arquivos para Alteração

### Componentes de Grid e Listagem
- `src/components/courses/CourseGrid.tsx`
- `src/pages/MapaVivoList.tsx`

### Componentes Administrativos (Inputs e Layout)
- `src/components/admin/AdminCursosTab.tsx`
- `src/components/admin/AdminPlanosTab.tsx`
- `src/components/admin/AdminOraculosTab.tsx`
- `src/components/admin/AdminGaleriaTab.tsx`
- `src/components/admin/AdminProgressoTab.tsx`
- `src/components/admin/treinamento/AdminCamaraSussurro.tsx`
- `src/components/admin/communication/CommunicationLogs.tsx`
- `src/pages/admin/AdminAlunaAcompanhamento.tsx`

### Componentes de Visualização/Páginas
- `src/pages/AcademiaFormacaoPage.tsx`
- `src/pages/JardimPsique.tsx`
- `src/pages/casa-maquinas/BibliotecaIntervPage.tsx`
- `src/pages/casa-maquinas/GestosIntegracaoPage.tsx`
- `src/components/biblioteca/BibliotecaPessoal.tsx`
- `src/components/treinamento/simulador/SimuladorConducao.tsx`
- `src/components/casa-maquinas/SessionInterventionSuggestions.tsx`

---

## 2. Detalhamento por Arquivo

### Grids e Listas
| Arquivo | Problema | Alteração Proposta | Risco | Validação |
| :--- | :--- | :--- | :--- | :--- |
| `CourseGrid.tsx` | Gap excessivo e falta de suporte a ultra-wide. | Ajustar `lg:grid-cols-3` para `xl:grid-cols-4` e otimizar gaps. | Baixo | Desktop e Ultra-wide. |
| `MapaVivoList.tsx` | Cards com títulos que podem quebrar layout. | Garantir `truncate` e `w-full` em telas pequenas. | Baixo | Mobile (390px). |

### Inputs e Selects (Padrão SelectTrigger)
Muitos arquivos utilizam `SelectTrigger className="w-[180px]"` ou similar, o que causa quebra em telas menores que a largura fixa.

| Arquivo | Alteração Proposta | Risco | Validação |
| :--- | :--- | :--- | :--- |
| Todos listados acima com `SelectTrigger` | Substituir `w-[XXXpx]` por `w-full sm:w-[XXXpx]`. | Baixo | Mobile vs Desktop. |

### Admin Tabs e Tabelas
| Arquivo | Problema | Alteração Proposta | Risco | Validação |
| :--- | :--- | :--- | :--- | :--- |
| `AdminCursosTab.tsx` | Larguras fixas em filtros e headers. | Substituir larguras rígidas por classes responsivas. | Baixo | Mobile. |
| `AdminPlanosTab.tsx` | Inputs de criação de plano muito largos. | Garantir `max-w-md` ou similar em vez de largura fixa. | Baixo | Mobile. |

---

## 3. Classes que serão Substituídas/Otimizadas

- **Larguras Rígidas:**
    - `w-[180px]`, `w-[250px]`, `w-[300px]` -> `w-full sm:w-[...px]`
    - `min-w-[...px]` -> `min-w-0` ou `w-full` em mobile.
- **Grids:**
    - Inclusão de `grid-cols-1` explícito em mobile.
    - Otimização para `xl:grid-cols-4` ou `2xl:grid-cols-5` onde aplicável.
- **Componente Card:**
    - Remoção de `w-[...px]` em favor de `w-full`.

---

## 4. Componentes Excluídos deste Bloco
- `AdminSidebar` (Será tratado em bloco separado de navegação).
- `Navigation` mobile (Menu sanduíche/Sheet).
- `BottomNavPreview`.
- Lógicas de permissão, auth e pagamentos.

---

## 5. Critérios de Validação Final

1. **Responsividade:**
    - Mobile 390px: Nenhum scroll horizontal. Inputs ocupam largura total.
    - Tablet: Transição suave de 1 para 2 colunas.
    - Desktop: Grid e filtros alinhados.
2. **Build:**
    - Executar `bun run build` para garantir que as alterações não introduziram erros de sintaxe ou importação.
3. **Consistência Visual:**
    - Verificar se os `Selects` no Admin não estão desalinhados em telas grandes.

---

## 6. Proibição e Segurança
- Nenhuma alteração em tabelas do banco de dados.
- Nenhuma alteração em RLS ou Edge Functions.
- Foco exclusivo em classes Tailwind no frontend.
