# Plano de UI e Mutations para Soft Delete em Admin Cursos

## 1. Status

`SOFT_DELETE_COURSES_ADMIN_UI_MUTATIONS_PLAN_CREATED`

## 2. Resumo executivo

O domínio de Cursos já possui o schema necessário e os filtros de proteção implementados nas experiências das alunas. No entanto, o painel administrativo (Admin Cursos) ainda utiliza exclusões físicas (`DELETE`), o que é destrutivo para o histórico de matrículas, progresso e certificados. Este plano detalha a futura substituição dessas exclusões por arquivamento lógico (`SOFT DELETE`), garantindo a preservação da integridade dos dados e permitindo a restauração de conteúdos se necessário.

## 3. Estado atual do Admin Cursos

Mapeamento realizado no arquivo `src/components/admin/AdminCursosTab.tsx`:

- **Onde existe delete físico**:
    - **Cursos**: Função `handleDeleteCourse` (Linha 152).
    - **Módulos**: Função `handleDeleteModule` (Linha 200).
    - **Aulas**: Função `handleDeleteLesson` (Linha 268).
- **Tabelas afetadas**: `public.courses`, `public.course_modules`, `public.course_lessons`.
- **Confirmação**: Utiliza o nativo `confirm()` do navegador com mensagens de aviso sobre exclusão em cascata.
- **Toast**: Exibe mensagens de sucesso ("Curso excluído!", "Módulo excluído!", etc.).
- **Reload/Refetch**: Chama a função `fetchData()` após a exclusão para atualizar a UI.
- **Cascata e Impacto**:
    - **Cursos**: O delete de curso afeta módulos e aulas via restrições de chave estrangeira no banco (ON DELETE CASCADE) ou lógica de UI. No estado atual, a exclusão física remove permanentemente o registro do curso.
    - **Módulos**: Afeta todas as aulas vinculadas.
    - **Aulas**: Impacta diretamente a tabela de progresso e submissões vinculadas.
- **Riscos identificados**: Exclusão de progresso de alunas, perda de vínculo em certificados emitidos e interrupção de acesso a materiais de suporte em fóruns ou submissões de trabalhos.

## 4. Estado futuro desejado

O fluxo de gerenciamento deve evoluir para:

- **Mudança na UI**: O botão com ícone de lixeira e texto “Excluir” deve ser renomeado para “Arquivar” (ou manter o ícone, mas alterar a ação interna).
- **Ação Técnica**: A operação deve disparar um `UPDATE` definindo `archived_at` como o timestamp atual.
- **Auditoria**:
    - `archived_by`: Deve ser preenchido com o UUID do usuário administrativo logado.
    - `archive_reason`: Opcionalmente, pode ser solicitado um motivo em um modal de confirmação.
- **Preservação de Dados**:
    - **Não apagar**: O registro permanece na tabela.
    - **Progresso e Matrículas**: Mantidos intactos para histórico e auditoria.
    - **Certificados e Submissões**: Permanecem vinculados aos IDs originais, evitando erros de referência nula.
    - **Fórum**: Posts e respostas são preservados.
- **Estado do Registro**: O arquivamento é independente do status de publicação (`publicado`). Um curso pode estar arquivado mas ter sido publicado no passado.
- **Integridade**: Não deve haver alteração na ordem (`ordem`) ou no conteúdo pedagógico durante o arquivamento.

## 5. Mutations futuras recomendadas

Para suportar este comportamento, recomenda-se a criação das seguintes funções (provavelmente no DAL de escrita do Admin):

```ts
/**
 * Arquiva um curso logicamente.
 * @param courseId ID do curso a ser arquivado
 * @param reason Motivo opcional do arquivamento
 */
async function archiveCourse(courseId: string, reason?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return await supabase
    .from('courses')
    .update({ 
      archived_at: new Date().toISOString(),
      archived_by: user?.id,
      archive_reason: reason 
    })
    .eq('id', courseId);
}

/**
 * Arquiva um módulo de curso logicamente.
 * @param moduleId ID do módulo
 * @param reason Motivo opcional
 */
async function archiveCourseModule(moduleId: string, reason?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return await supabase
    .from('course_modules')
    .update({ 
      archived_at: new Date().toISOString(),
      archived_by: user?.id,
      archive_reason: reason 
    })
    .eq('id', moduleId);
}

/**
 * Arquiva uma aula de curso logicamente.
 * @param lessonId ID da aula
 * @param reason Motivo opcional
 */
async function archiveCourseLesson(lessonId: string, reason?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return await supabase
    .from('course_lessons')
    .update({ 
      archived_at: new Date().toISOString(),
      archived_by: user?.id,
      archive_reason: reason 
    })
    .eq('id', lessonId);
}
```
