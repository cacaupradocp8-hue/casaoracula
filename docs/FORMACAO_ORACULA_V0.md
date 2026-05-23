# DOCUMENTAÇÃO: FORMAÇÃO ORÁCULA V0

## 1. Visão Geral
A **Formação Orácula V0** é o espaço central de ensino do Método Orácula dentro do ecossistema da Casa Orácula 2.0. Ela representa o pilar teórico e estrutural onde o conhecimento é transmitido e organizado.

Esta área organiza:
- **Ciclos de Estudo:** Jornadas temáticas de aprendizado (anteriormente "Cursos").
- **Módulos da Formação:** Divisões estruturais do conhecimento dentro de cada ciclo.
- **Aulas:** Unidades fundamentais de transmissão de conteúdo.
- **Materiais:** Recursos de apoio para o aprofundamento teórico.
- **Práticas de Mestria Oracular:** Atividades focadas na integração do método (anteriormente "Projeto de Mestria").
- **Ensino Teórico:** A base conceitual do Método Orácula.
- **Pontes para Treino Prático:** Encaminhamento para a Sala de Treinamento.
- **Pontes para Aplicação Profissional:** Fundamentação para o uso no Atlas Orácula.

## 2. Decisão Técnica da V0
A versão V0 foca na unificação de linguagem e posicionamento conceitual, mantendo a infraestrutura técnica legada para garantir estabilidade e continuidade do progresso dos alunos.

**Definições Técnicas:**
- Mantém as rotas `/cursos`, `/formacao-metodo`, `/academia` e `/metodo`.
- Mantém os players de aula e a lógica de vídeo existentes.
- Mantém os ficheiros `AulaPage.tsx` e `CursoAula.tsx` sem alterações funcionais.
- Mantém o banco de dados Supabase intacto (sem alterações em tabelas ou políticas).
- Mantém o progresso de aulas e matrículas de alunos sem interferência.
- Altera apenas a interface visível (labels, títulos e descrições) e o posicionamento simbólico.

## 3. Rotas Principais
- `/cursos`: Lista de Ciclos de Estudo e Módulos da Formação.
- `/formacao-metodo`: Painel central da Formação Orácula e ensino do método.
- `/academia`: Academia de Mestria (espaço de excelência).
- `/metodo`: Visão geral do Método Orácula.
- `/aulas/:id`: Visualização de aula individual (padrão legante).
- `/cursos/:courseId/aula/:lessonId`: Visualização de aula dentro de um ciclo específico.
- `/metodo/portas`: O ensino das Portas do Método.
- `/metodo/torres`: O ensino das Torres do Método.
- `/metodo/campos-psiquicos`: O ensino dos Campos Psíquicos.
- `/metodo/triade`: O ensino da Tríade do Método.

## 4. Ficheiros Principais
- `src/pages/FormacaoMetodoPage.tsx`: Página principal do ensino do método.
- `src/pages/Cursos.tsx`: Listagem de conteúdos da formação.
- `src/pages/AcademiaFormacaoPage.tsx`: Página da Academia de Mestria.
- `src/pages/Metodo.tsx`: Hub de conceitos do Método Orácula.
- `src/pages/AulaPage.tsx`: Player e conteúdo de aula.
- `src/pages/CursoAula.tsx`: Interface de aula dentro de curso.
- `src/pages/metodo/AsPortas.tsx`: Conteúdo específico sobre as Portas.
- `src/pages/metodo/AsTorres.tsx`: Conteúdo específico sobre as Torres.
- `src/pages/metodo/OsCamposPsiquicos.tsx`: Conteúdo específico sobre os Campos Psíquicos.
- `src/pages/metodo/TriadeMetodo.tsx`: Conteúdo específico sobre a Tríade.
- `src/components/layout/Navigation.tsx`: Ponto de entrada visual e navegação para a Formação.

## 5. Núcleo da Formação Orácula V0
O núcleo inicial da V0 estabelece a base para a evolução da plataforma:
- **Ensino do Método Orácula:** Foco na transmissão pura da técnica.
- **Ciclos de Estudo:** Organização cronológica e temática.
- **Módulos da Formação:** Estruturação pedagógica.
- **Aulas e Materiais:** O corpo técnico do conhecimento.
- **Academia de Mestria:** Espaço de refinamento e excelência.
- **Práticas de Mestria Oracular:** Atividades de integração aluno-método.

## 6. Pontes com Outras Áreas

### Sala de Treinamento
A Formação ensina o método e encaminha o aluno para o treino prático e repetitivo na Sala de Treinamento.

### Atlas Orácula
O Atlas aplica profissionalmente o raciocínio e a estrutura aprendida na Formação em casos reais e consultas.

### Rotas da Casa
As Rotas da Casa sustentam a continuidade, o aprofundamento e a travessia simbólica do aluno para além do ensino técnico.

### Casa das Máquinas
A Casa das Máquinas é onde ocorre a aplicação profissional do método e a gestão da prática.

## 7. Linguagem Oficial
Substituições aplicadas para alinhar à identidade da Casa Orácula 2.0:
- "Cursos" → "Ciclos de Estudo" ou "Módulos da Formação"
- "Área de Membros" → "Formação Orácula"
- "Academia" → "Academia de Mestria"
- "Projeto de Mestria" → "Prática de Mestria Oracular"
- "Formação" → "Formação Orácula"
- "Método" → "Método Orácula"

## 8. Limites Técnicos da V0
A V0 **não** realiza as seguintes operações:
- Alteração de dados em tabelas de cursos ou aulas.
- Mudanças em permissões de acesso (RLS) ou autenticação.
- Alterações em colunas ou estruturas do Supabase.
- Modificações na lógica de cálculo de progresso ou conclusão de aulas.
- Alterações nos players de vídeo ou provedores de streaming.
- Mudança de URLs, slugs de rotas ou caminhos de ficheiros.
- Remoção de código legado ou redirecionamentos existentes.

## 9. Guardrails para Próximas Etapas
As seguintes ações exigem nova aprovação e não fazem parte da V0:
- Redesenho completo da interface das páginas de cursos/aulas.
- Migração de players de vídeo ou lógica de progresso.
- Alteração na lógica de matrículas (`course_enrollments`).
- Criação de novas rotas estruturais para a formação.
- Integração de exercícios persistidos no banco de dados.
- Conexão de dados reais entre Formação e Atlas/Admin.
- Implementação de sistema automático de certificados.

## 10. Estado Final
A **Formação Orácula V0** está congelada como o espaço de ensino do método, preservando a robustez da infraestrutura legada enquanto projeta a nova identidade conceitual da Casa Orácula 2.0.
