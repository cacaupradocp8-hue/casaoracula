# CICLO FORMAÇÃO ORÁCULA V0.2 — ENCERRAMENTO

## 1. Estado final

“A Formação Orácula V0.2 está encerrada, documentada e congelada como camada educacional da Escola Orácula dentro da Casa Orácula 2.0.”

## 2. Escopo concluído

- auditoria de schema e RLS;
- auto-matrícula segura para cursos gratuitos;
- preservação de cursos pagos;
- helper compartilhado de progresso;
- cálculo consistente entre catálogo e detalhe;
- preservação da auto-matrícula;
- preservação de certificados para ciclo futuro;
- preservação de `CursoDeusasPage.tsx` como exceção controlada;
- documentação técnica em `docs/FORMACAO_ORACULA_V0_2.md`;
- ausência de IA;
- ausência de Atlas;
- ausência de dados clínicos.

## 3. Componentes fechados

| Área | Ficheiro ou Tabela | Estado | Observação |
| :--- | :--- | :--- | :--- |
| Database | `courses` | Fechado | Tabela base de cursos. |
| Database | `course_modules` | Fechado | Estrutura de módulos. |
| Database | `course_lessons` | Fechado | Conteúdo das aulas. |
| Database | `course_enrollments` | Fechado | Gestão de inscrições. |
| Database | `course_lesson_progress` | Fechado | Tracking de progresso individual. |
| Database | `course_work_submissions` | Fechado | Submissões de trabalhos. |
| Database | `course_exercise_responses` | Fechado | Respostas de exercícios. |
| Database | `certificates` | Fechado | Tabela de certificados (preservada). |
| Hooks | `src/hooks/useCourses.ts` | Fechado | Integrado com helper de progresso. |
| Hooks | `src/hooks/useCourseDetail.ts` | Fechado | Integrado com auto-matrícula e progresso. |
| Utils | `src/utils/courseProgress.ts` | Fechado | Lógica centralizada de progresso. |
| Docs | `docs/FORMACAO_ORACULA_V0_2.md` | Fechado | Documentação técnica principal. |

## 4. Guardrails congelados

Registram-se como proibidos dentro da V0.2:

- criar certificados automáticos;
- gerar PDF;
- criar RPC;
- criar view;
- criar migration;
- alterar RLS;
- alterar schema;
- criar campo agregado em `course_enrollments`;
- migrar `CursoDeusasPage.tsx` sem auditoria própria;
- integrar IA;
- chamar Syntheia;
- integrar Atlas;
- usar dados clínicos;
- usar dados de clientes;
- gerar prontuário;
- gerar relatório clínico.

## 5. Formação como Escola Orácula

A Formação Orácula V0.2 prepara a base para:

- Certificação Core;
- especializações;
- laboratórios;
- método oracular;
- ética;
- formulação de casos;
- supervisão futura.

*Nota: Estas camadas ainda não foram implementadas neste ciclo.*

## 6. Ficheiros principais do ciclo

- `src/hooks/useCourseDetail.ts`;
- `src/hooks/useCourses.ts`;
- `src/utils/courseProgress.ts`;
- `docs/FORMACAO_ORACULA_V0_2.md`;
- `docs/CICLO_FORMACAO_ORACULA_V0_2_ENCERRAMENTO.md`.

## 7. Estado de portabilidade

A implementação está preparada para saída futura do Lovable porque possui:

- Supabase/Postgres padrão;
- hooks React padrão;
- helper TypeScript puro;
- RLS existente;
- ausência de service role no frontend;
- ausência de dependência oculta do Lovable;
- documentação técnica em `docs/`.

## 8. Próximos ciclos possíveis

- certificados automáticos;
- PDF de certificado;
- RPC ou view de progresso;
- tabela agregada de progresso;
- migração de `CursoDeusasPage.tsx`;
- pré-requisitos entre módulos;
- dashboard de Formação;
- auditoria específica da Cidadela;
- limpeza de legado;
- Atlas Orácula V0.2 somente com auditoria ética própria;
- IA/Syntheia somente em ciclo separado.

## 9. Decisão final

`FORMACAO_ORACULA_V0_2_CLOSED`
