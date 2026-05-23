# Desenho Técnico do Service de Treinamento — V0.2

## 1. Visão Geral
Este documento define a arquitetura técnica e o contrato funcional do futuro `trainingService`. Este service será o único responsável pela persistência pedagógica da Sala de Treinamento na Casa Orácula 2.0.

### Escopo de Atuação
- **Sim:** Progresso de módulos, submissões de exercícios fictícios, arquivamento lógico de respostas, tratamento de erros de persistência.
- **Não:** Atlas, casos clínicos reais, prontuários, diagnósticos, integração com IA/Syntheia, relatórios clínicos.

## 2. Arquitetura Proposta

### `src/services/trainingService.ts`
Camada de comunicação pura com o Supabase.
- **Responsabilidades:** Executar chamadas via cliente Supabase, forçar o isolamento ético (`is_fictional: true`), retornar dados tipados e gerenciar erros de rede/DB.
- **Restrições:** Não deve conter estado React, navegação, lógica de UI ou dependências do Atlas/IA.

### `src/hooks/useTrainingData.ts`
Camada de integração com o ecossistema React.
- **Responsabilidades:** Gerenciar estados de `loading` e `error`, persistir cache local de progresso e expor métodos simplificados para os componentes da Sala de Treinamento.
- **Estado:** Planejado para implementação futura, após a estabilização do service.

## 3. Métodos do `trainingService` (V0.2 Inicial)

### `getModuleProgress(moduleKey: string)`
- **Finalidade:** Recuperar o estado de conclusão de um módulo para a usuária logada.
- **Retorno:** `Promise<TrainingProgress | null>`.
- **Segurança:** O `userId` deve ser extraído da sessão ativa do Supabase; a UI nunca envia este campo.

### `upsertProgress(input: TrainingProgressUpdate)`
- **Finalidade:** Sincronizar o avanço da aluna (visto, em andamento, concluído).
- **Operação:** `UPSERT` baseado na constraint única `(user_id, module_key)`.
- **Campos Editáveis:** `status`, `progress_percentage`, `last_activity_at`, `completed_at`.

### `listSubmissions(moduleKey?: string)`
- **Finalidade:** Listar o histórico pedagógico de respostas da usuária.
- **Filtros Padrão:** Ocultar registros com `is_archived = true`.
- **Segurança:** Isolamento garantido por RLS no banco de dados.

### `submitExercise(input: TrainingSubmissionInsert)`
- **Finalidade:** Registrar uma nova reflexão ou resposta em exercício simulado.
- **Regra de Ouro:** O service deve injetar ou validar `is_fictional: true`. Caso o input tente enviar `false`, a operação deve ser abortada com erro de segurança.

### `archiveSubmission(submissionId: string)`
- **Finalidade:** Realizar o arquivamento lógico de uma resposta.
- **Operação:** `UPDATE training_submissions SET is_archived = true WHERE id = submissionId`.
- **Restrição:** Não permite a exclusão física dos dados na V0.2 inicial.

## 4. Fora de Escopo (V0.2 Inicial)
- Exclusão física de dados (`deleteTrainingData`).
- Edição de conteúdo de submissões já enviadas (`updateSubmission`).
- Relatórios agregados ou dashboards de Admin.
- Qualquer ponte funcional para o Atlas Orácula.

## 5. Decisões Estratégicas

### Gestão de Identidade (`userId`)
O service deve operar sob o princípio da **Identidade Implícita**. A usuária não informa quem é; o service descobre via sessão do Supabase Auth. Isso evita ataques de ID-spoofing no frontend.

### Evolução Pedagógica (Imutabilidade)
Submissões são consideradas marcos de amadurecimento. Portanto, não permitimos o `update` do texto da resposta. Se a aluna desejar revisar seu pensamento, ela deve realizar uma nova submissão, preservando a trilha histórica do seu aprendizado.

## 6. Tratamento de Erros
- **`UNAUTHORIZED`**: Sessão ausente ou expirada.
- **`PERMISSION_DENIED`**: Violação de política RLS.
- **`VALIDATION_ERROR`**: Tentativa de inserir dados clínicos ou violar constraints éticas.
- **`NETWORK_ERROR`**: Falha de conexão com a infraestrutura Supabase.

## 7. Guardrails Éticos e Portabilidade
- **Treino != Atendimento**: O service não deve aceitar campos que remetam a prontuários reais.
- **Independência de Plataforma**: O service usará apenas o cliente `@supabase/supabase-js`. Nenhuma lógica estará atrelada a segredos ou comportamentos exclusivos do Lovable.
- **Versionamento**: Este desenho deve ser respeitado durante a implementação para garantir que qualquer desenvolvedor futuro consiga manter o código via GitHub/CLI.

## 8. Ordem de Implementação Futura
1. Aplicação da Migration SQL (`docs/TRAINING_V0_2_SCHEMA_DRAFT.sql`).
2. Implementação do `trainingService.ts`.
3. Testes de unidade e validação de RLS.
4. Implementação do Hook `useTrainingData.ts`.
5. Integração visual na Sala de Treinamento.

---
**Status Final:** `READY_FOR_SERVICE_IMPLEMENTATION_AFTER_MIGRATION`
