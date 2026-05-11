# CASA_ORACULA_DISCOVERY_REPORT.md

Este relatório apresenta o diagnóstico inicial da **Fase 1: Descoberta** do ecossistema Casa Orácula, conforme as diretrizes do Blueprint de Produto e Arquitetura.

---

## 1. Mapa das Áreas Existentes
A Casa Orácula está organizada em domínios que misturam jornada do usuário, ferramentas terapêuticas e gestão administrativa.

- **Sala de Visita**: Ponto de entrada para não-autenticados ou novos usuários (Degustação).
- **Clube / Rotas**: Ecossistema de assinatura com trilhas de conteúdo e imersão.
- **Formação Orácula**: Ambiente educacional para certificação no método.
- **Casa das Máquinas / Cabine**: Ferramentas de uso profissional (terapeutas/oráculas).
- **Jardins**: Espaço de introspecção e acompanhamento de sementes/processos.
- **cidaDELA / Cartografia**: Representação visual e arquetípica da psique e do ecossistema.
- **Oráculos**: Ferramentas de sorteio e consulta simbólica.
- **Biblioteca**: Acervo de casos, livros e travessias.
- **Syntheia**: Interface de IA para suporte formativo e navegação.
- **Admin Guardiã**: Painel de controle operacional.
- **Painel Mestre**: Dashboard estratégico e financeiro (Founder Dashboard).

---

## 2. Rotas Principais Encontradas
- `/`: Home / Welcome.
- `/auth`: Autenticação.
- `/dashboard-membro`: Painel principal do usuário ativo.
- `/sala-da-visitante`: Área de degustação e visitante.
- `/clube/*`: Domínio do Clube Oracular.
- `/cursos/*`, `/travessias/*`: Domínio da Formação.
- `/casa-maquinas/*`: Domínio da Cabine/Profissional.
- `/admin/*`: Domínio da Guardiã.
- `/syntheia`: Interface de IA.
- `/oraculos/*`: Portais e sorteios.
- `/cidadela/*`: Mapas e cartografias.

---

## 3. Funcionalidades por Domínio

### Sala de Visita
- Degustação de travessias (`ExperienciaGratuita.tsx`).
- Quiz de entrada (`QuizPage.tsx`).
- Welcome dinâmico por perfil.

### Clube / Rotas
- Catálogo de rotas e estações.
- Laboratórios (`ClubeLaboratorio.tsx`) com fases: Forja, Espelho, Encarnação.
- Camara do Sussurro (casos críticos/insights).
- Clube do Livro (legado integrado ao Clube v3).

### Formação Orácula
- Módulos formativos e aulas.
- Sistema de avaliações e progresso.
- Fórum de alunas.
- Academia de Formação.

### Casa das Máquinas / Cabine
- Painel Clínico e Cabine do Terapeuta.
- Sessões Imersivas e Notas de Sessão.
- Mapa Vivo do Cliente.
- Gestos de Integração.

### Jardins
- Jardim da Psique (acompanhamento).
- Registro de sementes e flores (`co_garden_flowers`).
- QA Jardins (vínculos).

### cidaDELA / Cartografia
- Mandala da Cidadela (`MandalaCidadela.tsx`).
- Mapa Vivo V2.
- Revelação da Cidadela.

### Oráculos
- Sorteio de cartas e histórico.
- Biblioteca de cartas oraculares.
- Templo da Escuta.

### Biblioteca
- Biblioteca Unificada (Acervo).
- Biblioteca das Travessias.
- Biblioteca de Casos (profissionais).

### Syntheia
- Chat de suporte formativo.
- Adaptador de contexto (`syntheiaContextAdapter.ts`).
- Vozes e interação por áudio.

### Admin Guardiã
- Gestão de usuários e matrículas.
- Editor de blocos e ferramentas.
- Central de jornadas e ciclos.
- Configurações de SaaS.

---

## 4. Tipos de Usuários Identificados (`PortalType`)
1. **Visitante**: Acesso inicial, degustação.
2. **Aluna**: Matriculada na formação, limite de 5 casos.
3. **Orácula**: Formada, certificada, casos ilimitados.
4. **Assinante**: Acesso contínuo ao Clube e ferramentas.
5. **Admin / Guardiã**: Acesso total, gestão e decisões.
*Legados identificados:* `mentorada`, `pre_iniciada`, `iniciada`.

---

## 5. Regras de Accesso Encontradas
- **Hierarquia**: `visitante(1) → aluna(2) → oracula(3) → assinante(4) → admin(5)`.
- **Gaurds**: `ProtectedRoute` utiliza `minPortal` para validação em nível de rota.
- **RLS**: Implementado via políticas no Supabase (verificado no audit anterior).

---

## 6. Funcionalidades Essenciais (Manter)
- **Dashboard Membro**: Centralização da experiência.
- **Clube v3**: Motor de engajamento recorrente.
- **Cabine Terapeuta**: Núcleo da "Casa das Máquinas".
- **Sistema de Oráculos**: Identidade do produto.
- **Cartografia Psíquica**: Diferencial metodológico.

---

## 7. Funcionalidades Experimentais
- **Syntheia Voice**: Interação de voz com a IA.
- **Radiestesia Portal**: Mesa radiônica e gráficos.
- **Modo Sessão Imersivo**: Interface focada para atendimento.

---

## 8. Funcionalidades Legadas
- **Clube do Livro (v1/v2)**: Muitas tabelas `_deprecated_club_*`.
- **Cursos/Aulas legados**: Redirecionamentos presentes no `App.tsx`.
- **Tipos de Portal**: `mentorada`, `pre_iniciada`.

---

## 9. Funcionalidades Duplicadas ou Sobrepostas
- **Bibliotecas**: `BibliotecaUnificada`, `BibliotecaDasTravessias`, `BibliotecaTravessias`.
- **Mapas**: `MapaOracula`, `MapaCidadela`, `MapaVivoV2`, `MandalaCidadela`.
- **Checkouts**: Múltiplos fluxos de planos (`Planos.tsx`, `PlanosClubeOracular.tsx`).

---

## 10. Riscos Atuais
- **Complexidade de Rotas**: `App.tsx` com ~600 linhas e excesso de Lazy Loading disperso.
- **Inconsistência de Dados**: Tabelas `_deprecated` convivendo com novas estruturas.
- **Segurança**: Views `SECURITY DEFINER` e funções sem `search_path` (conforme report de Hardening).
- **Hardcoding**: Lógica de receita hardcoded no Painel Mestre (v0).

---

## 11. Perguntas Pendentes
1. Quais tabelas `_deprecated` podem ser arquivadas permanentemente?
2. O domínio "Radiestesia" é estratégico ou experimental/legado?
3. Qual a biblioteca "oficial" que deve centralizar as outras três?
4. O ecossistema de Mapas (Mandala vs Cidadela vs Mapa Vivo) deve ser unificado em uma única engine?

---

## 12. Recomendações Iniciais (Estratégicas)
- **Unificação de Domínios**: Mover arquivos para `src/domains/` seguindo a nova arquitetura modular.
- **Limpeza de Rotas**: Centralizar definições de rotas em arquivos menores por domínio (já iniciado com `casaMaquinasRoutes.tsx`).
- **Refatoração de Segurança**: Aplicar o plano de Hardening em fases antes de novas features.

---

## PAINEL MESTRE / CABINE ADMINISTRATIVA

Esta área foi identificada como o **Founder Dashboard**, o coração estratégico da Casa Orácula.

### Mapeamento Técnico
- **Rota Atual**: `/admin?tab=founder`
- **Componente**: `src/components/admin/AdminFounderDashboardTab.tsx`
- **Tabelas Consultadas**:
  - `view_founder_real_financial_summary` (View principal).
  - `ai_interaction_logs` (Mapeado via hooks).
  - `view_founder_alerts` (Provável fonte do hook `useFounderAlerts`).
- **Métricas Exibidas**:
  - **MRR**: Segmentado por Clube e SaaS.
  - **Receita**: Formação, Upsells e Total.
  - **Custos Operacionais**: IA (Models), Infra (Cloud), Stripe, Ads, Time.
  - **Lucratividade**: Lucro Bruto, Líquido, Margem Líquida.
  - **Saúde**: Churn, LTV, CAC, Payback Period.
- **Uso de IA**:
  - Monitoramento de custos de modelos (`cost_ia`).
  - Simulador de projeção (What-if) que inclui aumento de custo de IA.
- **Consumo das Assinantes**: Exibido indiretamente através de MRR e Churn.
- **Logs**: Utiliza `ai_interaction_logs` para cálculos de custo.
- **Custos, Limites e Alertas**:
  - Sistema de alertas premium (`useFounderAlerts`).
  - Categorias: Financeiro, Churn, IA, Infra.
- **Permissões**: Apenas usuários com `portal === 'admin'`.
- **Partes Funcionando**: Dashboard financeiro, simulador de projeções, sistema de alertas de severidade.
- **Partes Incompletas**: 
  - `revenue_formacao` está fixado em `0` no código.
  - Churn rate e LTV/CAC parecem ser valores fixos de exemplo no componente atual.
- **Riscos de Alteração**: Crítico. Qualquer erro aqui impacta a visão estratégica e financeira da guardiã. Recomenda-se isolar em domínio próprio `src/domains/painel-mestre`.

---
*Relatório gerado em: 11/05/2026*
