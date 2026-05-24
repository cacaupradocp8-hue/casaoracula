# FORMAÇÃO ORÁCULA V0.2 — DOCUMENTAÇÃO TÉCNICA

## 1. Visão Geral

A **Formação Orácula V0.2** representa a camada educacional da Escola Orácula dentro do ecossistema da Casa Orácula 2.0. Ela organiza e gerencia o percurso de aprendizagem das usuárias, consolidando a estrutura de cursos, módulos, aulas e o acompanhamento de progresso.

Esta versão foca na estabilização do fluxo de acesso e na consistência dos dados de conclusão, servindo como fundação para certificações e especializações futuras.

### Escopo e Delimitação
A V0.2 é estritamente educacional. Para garantir a segurança e a integridade do sistema, esta versão **não interage** com:
- **Atlas**: Sem envio de dados educacionais para o mapeamento arquetípico.
- **IA / Syntheia**: Sem integração de processamento de linguagem natural ou mentoria automatizada nesta etapa.
- **Casa das Máquinas**: Sem alterações em configurações de infraestrutura profunda.
- **Dados Clínicos / Prontuários**: Separação total entre o progresso de aprendizagem e registros de atendimento ou relatórios clínicos.

---

## 2. Estado da Versão 0.2

A implementação atual atingiu os seguintes marcos de estabilidade:
- **Auditoria de Dados**: Validação completa de Schema e políticas de RLS.
- **Auto-matrícula Segura**: Implementação de fluxo controlado para cursos gratuitos sem necessidade de intervenção administrativa.
- **Cálculo de Progresso Unificado**: Introdução de um helper compartilhado que garante paridade visual entre o Catálogo de Cursos e a Página de Detalhes.
- **Arquitetura Limpa**: 
    - Sem necessidade de novas migrations.
    - Sem criação de RPCs ou Views complexas.
    - Preservação de componentes legados críticos como `CursoDeusasPage.tsx` como exceções controladas.
    - Preparação conceitual para o ciclo de Certificados (emissão automática desativada nesta fase).

---

## 3. Estrutura de Dados (Tabelas Principais)

### `courses`
- **Finalidade**: Catálogo global de ofertas educacionais.
- **Notas**: Leitura pública (se publicado), escrita restrita ao Admin via RLS.

### `course_modules`
- **Finalidade**: Agrupamento lógico e organização sequencial.
- **Notas**: Define a hierarquia e a ordem dos conteúdos dentro de um curso.

### `course_lessons`
- **Finalidade**: Unidade mínima de conteúdo (vídeo, texto, material).
- **Notas**: Utiliza o campo `publicado`. Na V0.2, **todas** as aulas publicadas são consideradas obrigatórias para o cálculo de 100% de progresso.

### `course_enrollments`
- **Finalidade**: Registro do vínculo entre usuária e curso.
- **Notas**: Contém `user_id`, `course_id`, `status` (active/inactive) e `data_inicio`. Possui restrição única (`UNIQUE(user_id, course_id)`) para evitar duplicidade.

### `course_lesson_progress`
- **Finalidade**: Rastreamento granular de conclusão por aula.
- **Notas**: Armazena o estado `completed` e `progress_percent`. É a fonte primária para o cálculo agregado.

### `course_work_submissions`
- **Finalidade**: Gestão de entregas de trabalhos e arquivos.
- **Notas**: Na V0.2, estas entregas são opcionais e não bloqueiam o cálculo técnico de conclusão do curso.

### `course_exercise_responses`
- **Finalidade**: Coleta de respostas de exercícios e reflexões educacionais.
- **Notas**: Dados estritamente educacionais; não são processados pela IA ou enviados ao Atlas.

### `course_module_forum_posts`
- **Finalidade**: Espaço de interação e dúvidas por módulo.
- **Notas**: Fluxo de suporte e comunidade, sem impacto no cálculo de progresso automático.

### `certificates`
- **Finalidade**: Repositório de certificações emitidas.
- **Notas**: Tabela existente, porém a lógica de emissão automática via progresso agregado será integrada em um ciclo futuro.

---

## 4. Fluxo de Auto-matrícula Segura

Implementado para reduzir a fricção em cursos gratuitos, garantindo a integridade dos dados:

1. **Acesso**: Usuária autenticada visualiza o detalhe de um curso com `pricing_model === 'free'`.
2. **Ação**: Clique no botão "Começar Curso".
3. **Execução**: O componente `CursoDetalhe.tsx` invoca a função `enrollInFreeCourse` do hook `useCourseDetail`.
4. **Validações de Segurança**:
    - Confirmação de sessão ativa (`user.id`).
    - Verificação de que o curso é realmente gratuito no banco de dados.
    - Verificação de que não existe matrícula prévia para evitar erros de constraint.
5. **Persistência**: Utilização de `upsert` com tratamento de conflito em `(user_id, course_id)`.
6. **Resultado**: Matrícula criada com `status: 'active'`, liberando acesso imediato às aulas.

**Segurança**: O `user_id` é extraído diretamente da sessão do cliente, impossibilitando matrículas em nome de terceiros. Cursos pagos permanecem protegidos pelo fluxo de checkout.

---

## 5. Helper de Progresso Unificado

Localizado em `src/utils/courseProgress.ts`, a função `calculateCourseProgress` é a "única fonte da verdade" para o sucesso educacional na V0.2.

### Contrato da Função
```ts
interface CourseProgressResult {
  totalLessons: number;      // Aulas publicadas encontradas
  completedLessons: number;  // Aulas concluídas pela usuária
  progressPercent: number;   // Percentual (0-100)
  isComplete: boolean;       // Verdadeiro se completou todas as publicadas
}
```

### Regras de Cálculo
- **Filtro de Publicação**: Aulas marcadas como não publicadas são ignoradas tanto no total quanto no progresso (não contam e não somam).
- **Proteção de Dados**: Tratamento de divisão por zero (se o curso não tiver aulas, o progresso é 0).
- **Idempotência**: O cálculo é feito em tempo de execução (client-side) nos hooks `useCourses` e `useCourseDetail`, garantindo que a mesma informação seja vista em qualquer lugar da aplicação.
- **Pureza**: A função é pura, facilitando testes e garantindo que não haja efeitos colaterais indesejados no banco de dados durante a visualização.
