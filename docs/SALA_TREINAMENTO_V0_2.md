# SALA DE TREINAMENTO V0.2 — DOCUMENTAÇÃO TÉCNICA E ÉTICA

## 1. Visão Geral
A Sala de Treinamento V0.2 representa a primeira iteração persistente da camada pedagógica da Casa Orácula 2.0. Esta versão estabelece uma infraestrutura robusta para o acompanhamento do desenvolvimento técnico e reflexivo das alunas, garantindo o registro histórico de sua jornada de aprendizagem.

**Escopo de Persistência:**
A V0.2 salva exclusivamente:
- Progresso pedagógico por módulo;
- Reflexões simbólicas sobre contos;
- Simulações de casos pedagógicos;
- Formulações de treino clínico.

**Natureza dos Dados:**
Todo o conteúdo processado nesta camada é estritamente **fictício, pedagógico e isolado** do Atlas (Camada Profissional) e de qualquer processamento de Inteligência Artificial.

## 2. Módulos Persistentes

| Módulo | Página | module_key | Progresso | Submissões | exercise_key | exercise_type | Histórico | Arquivamento | Status |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :---: | :---: | :---: |
| **Laboratório dos Contos** | `ClinicaDosContosPage.tsx` | `clinica-dos-contos` | Sim | Sim | `reflexao-simbolica-conto` | `guided_reflection` | Sim | Lógico | Concluído |
| **Casos Simulados** | `CasosSimuladosPage.tsx` | `casos-simulados` | Sim | Sim | `simulacao-pedagogica-caso` | `formulation_practice` | Sim | Lógico | Concluído |
| **Formulação Guiada** | `FormulacaoGuiadaPage.tsx` | `formulacao-guiada` | Sim | Sim | `formulacao-pedagogica-7-camadas` | `formulation_practice` | Sim | Lógico | Concluído |

## 3. Estrutura de Dados

### Tabela: `training_progress`
**Finalidade:** Gerenciar o estado de conclusão e engajamento da aluna em cada módulo pedagógico.
- `user_id`: Identificador único da aluna (vinculado ao Auth).
- `module_key`: Chave identificadora do módulo (ex: `formulacao-guiada`).
- `module_title`: Nome amigável do módulo para exibição.
- `status`: Estado atual (`not_started`, `in_progress`, `completed`).
- `progress_percentage`: Valor numérico (0-100) do progresso.
- `started_at` / `completed_at` / `last_activity_at`: Timestamps de controle temporal.

### Tabela: `training_submissions`
**Finalidade:** Armazenar as produções textuais e reflexivas geradas durante os exercícios.
- `user_id`: Identificador da autora da submissão.
- `module_key`: Contexto do módulo de origem.
- `exercise_key`: Identificador específico do exercício.
- `exercise_type`: Categoria técnica do exercício (ex: `guided_reflection`).
- `case_key`: Referência ao caso ou conto específico (quando aplicável).
- `prompt_text`: O comando ou pergunta apresentada à aluna.
- `response_text`: A resposta textual fornecida.
- `response_metadata`: JSON para dados estruturados adicionais (ex: campos de formulário).
- `is_fictional`: Flag obrigatória `true` para reforçar a natureza não-clínica.
- `is_archived`: Flag de arquivamento lógico (exclusão visual).
- `submitted_at`: Data e hora da submissão.

## 4. Camada Técnica
A integração segue o padrão de arquitetura em camadas da Casa Orácula 2.0:
- **Contrato (`src/types/training.ts`):** Define as interfaces TypeScript para garantir consistência de dados.
- **Serviço (`src/services/trainingService.ts`):** Encapsula a lógica de comunicação com o Supabase, tratando erros e arquivamento.
- **Hooks (`src/hooks/useTrainingData.ts`):** Abstrai a complexidade do service em hooks React (`useTrainingProgress`, `useTrainingSubmissions`) para uso simplificado nas páginas.
- **Persistência (`supabase/migrations/...`):** Migration versionada que cria as tabelas e índices necessários no PostgreSQL.

## 5. Segurança e RLS (Row Level Security)
- **Isolamento de Dados:** Cada aluna possui acesso exclusivo aos seus próprios registros.
- **Identidade Protegida:** O `user_id` é injetado via `auth.uid()` do Supabase, nunca passado manualmente via props ou inputs.
- **Políticas Ativas:** As políticas RLS impedem que submissões de uma usuária sejam lidas ou alteradas por outra.
- **Zero Vazamento:** Não existem políticas que permitam o cruzamento de dados pedagógicos com dados do Atlas ou ferramentas de IA.

## 6. Guardrails Éticos
A Sala de Treinamento opera sob um "Muro de Vidro" ético:
- **Proibição de Dados Reais:** É estritamente proibido inserir nomes de clientes reais, CIDs, diagnósticos reais ou informações sensíveis.
- **Isolamento Clínico:** As respostas não constituem prontuários, atendimentos ou relatórios oficiais.
- **Isolamento Tecnológico:** Dados desta camada não são enviados para processamento de IA ou armazenamento no Atlas Profissional.
- **Sinalização:** O campo `is_fictional: true` é um marcador técnico permanente da natureza pedagógica do dado.

## 7. Arquivamento Lógico
Para preservar a integridade histórica e evitar deleções acidentais:
- A interface não oferece "Delete" físico.
- O comando `archiveSubmission` marca `is_archived = true`.
- Itens arquivados são filtrados automaticamente da visualização de histórico principal, mas permanecem no banco para auditoria ou recuperação se necessário.

## 8. Portabilidade fora do Lovable
O sistema foi desenhado para ser independente da plataforma de desenvolvimento:
- Migrations SQL padrão compatíveis com qualquer instância Supabase/Postgres.
- Código React escrito em TypeScript padrão.
- Ausência de dependências proprietárias ou "black boxes" de infraestrutura.

## 9. Limites da V0.2
Esta versão foca exclusivamente na persistência estruturada. **NÃO ESTÃO INCLUÍDOS:**
- Integração com Syntheia ou qualquer motor de IA.
- Dashboards administrativos ou supervisão remota.
- Exportação para PDF ou integração com o Atlas Profissional.
- Análise automática de qualidade de respostas.

## 10. Guardrails para Futuras Expansões
Qualquer evolução que envolva os itens abaixo requer nova rodada de auditoria ética e técnica:
- Ativação de IA sobre submissões pedagógicas.
- Criação de visões administrativas (professora/supervisora).
- Cruzamento de dados entre Sala de Treinamento e Atlas.
- Mudanças nas políticas de RLS para compartilhamento de dados.

## 11. Estado Final
**A Sala de Treinamento V0.2 está congelada como primeira versão persistente da camada pedagógica da Casa Orácula 2.0.**

---
*Data: 23 de Maio de 2026*
*Status: Congelada e Documentada*
