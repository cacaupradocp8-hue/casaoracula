# Encerramento Soft Delete Cursos V0

## 1. Status final

`SOFT_DELETE_COURSES_V0_CLOSED`

O ciclo V0 de soft delete para Cursos, Módulos e Aulas foi concluído com sucesso. Todas as etapas de planejamento, auditoria de schema, implementação de filtros na experiência da aluna e atualização da interface administrativa foram validadas.

## 2. Objetivo do ciclo

O objetivo principal deste ciclo foi substituir o delete físico (exclusão permanente de registros) por arquivamento lógico (soft delete) nas entidades fundamentais da academia:

- **Cursos** (`courses`)
- **Módulos de curso** (`course_modules`)
- **Aulas de curso** (`course_lessons`)

Esta mudança garante que conteúdos arquivados não prejudiquem a integridade histórica e operacional do sistema, preservando:
- Progresso acumulado das alunas (denominadores de progresso agora ignoram aulas arquivadas sem perder o histórico);
- Matrículas ativas e inativas;
- Certificados emitidos;
- Experiência protegida da aluna (filtros automáticos para ocultar arquivados);
- Admin Cursos (capacidade de gerenciar o arquivamento sem perda de dados).

## 3. Schema implementado

As tabelas afetadas possuem agora os seguintes campos para suporte ao arquivamento:

```sql
archived_at timestamptz null
archived_by uuid null
archive_reason text null
```

Estes campos permitem rastrear quando, por quem e por qual motivo um registro foi retirado de circulação operacional.
