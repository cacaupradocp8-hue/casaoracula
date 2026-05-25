# Plano de Impacto Soft Delete Cursos: Progresso, Biblioteca e Filtros

## 1. Status

`SOFT_DELETE_COURSES_PROGRESS_FILTERS_PLAN_CREATED`

## 2. Resumo executivo

O schema V0 para suporte a arquivamento lógico (soft delete) em Cursos, Módulos e Aulas já está presente no banco de dados. Este documento estabelece o plano de impacto para a aplicação desses filtros. O objetivo principal é garantir que, ao arquivar um curso ou aula, a experiência da aluna permaneça consistente, sem quebras em cálculos de progresso, acesso à biblioteca ou validade de certificados. A aplicação ainda não deve realizar operações de arquivamento até que as proteções descritas neste plano sejam implementadas na camada de filtros e lógica de negócio.

## 3. Tabelas envolvidas

| Tabela | Função | Relação com Cursos | Risco no Arquivamento | Filtro `archived_at IS NULL`? |
| :--- | :--- | :--- | :--- | :--- |
| `courses` | Cadastro principal de cursos | Raiz da hierarquia | Desaparecimento de hubs e listagens públicas | Sim (Páginas da Aluna) |
| `course_modules` | Estrutura de módulos | Relacionado a `courses` | Quebra na navegação interna do curso | Sim (Páginas da Aluna) |
| `course_lessons` | Conteúdo das aulas | Relacionado a `course_modules` | Impacto crítico no cálculo de progresso (%) | Sim (Páginas da Aluna) |
| `course_enrollments` | Vínculo de matrícula | Relacionado a `courses` | Perda de histórico de acesso da aluna | **Não** (Histórico preservado) |
| `course_lesson_progress` | Marcadores de conclusão | Relacionado a `course_lessons` | Inconsistência entre aulas feitas e aulas visíveis | **Não** (Histórico preservado) |
| `course_work_submissions` | Entregas de atividades | Relacionado a `courses` | Perda de registros pedagógicos | **Não** (Auditoria preservada) |
| `course_module_forum_posts` | Interações da comunidade | Relacionado a `course_modules` | Tópicos órfãos ou inacessíveis | **Não** (Histórico preservado) |
| `certificates` | Prova de conclusão | Relacionado a `courses` | Invalidação de diplomas já emitidos | **Não** (Vitalício) |

## 4. Regras futuras para filtros

Definir regra futura para páginas de aluna:

```ts
.is("archived_at", null)
```

Esta regra deve ser aplicada em todas as leituras de Cursos, Módulos e Aulas fora do ambiente de Admin, especificamente em:
- Listagens de cursos (Hubs, Carrosséis);
- Detalhes do curso e grade curricular;
- Player de aulas;
- Utilitários de cálculo de progresso (`src/utils/courseProgress.ts`).
