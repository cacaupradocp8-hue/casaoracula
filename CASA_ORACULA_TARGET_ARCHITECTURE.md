# CASA_ORACULA_TARGET_ARCHITECTURE.md

**Fase 3 — Arquitetura Alvo (Target Architecture)**

Este documento descreve a organização final proposta para o diretório `src/`, isolando funcionalidades por domínios de negócio para garantir escalabilidade, segurança e manutenibilidade.

---

## ESTRUTURA GLOBAL PROPOSTA

```text
src/
├── domains/              # Domínios de negócio isolados
│   ├── sala-visita/      # Porta de entrada e Onboarding
│   ├── clube/            # Motor de recorrência (Clube Oracular)
│   ├── formacao/         # Cursos e Jornadas High-Ticket
│   ├── casa-maquinas/    # Ferramentas Clínicas/Profissionais
│   ├── jardins/          # Espaço do Cliente e Práticas
│   ├── cidadela/         # Motores Simbólicos e Mapas
│   ├── oraculos/         # Sorteios e Portais
│   ├── biblioteca/       # Acervo Unificado
│   ├── syntheia/         # Inteligência Artificial
│   ├── admin/            # Gestão Operacional e Guardiã
│   └── painel-mestre/    # Inteligência Estratégica e Financeira
├── shared/               # UI Components, Layouts, Utils globais
├── lib/                  # Configurações de terceiros (Supabase, Stripe, etc.)
└── integrations/         # Adaptadores para serviços externos
```

---

## DETALHAMENTO POR DOMÍNIO

### 1. src/domains/sala-visita
- **Finalidade:** Atrair, acolher e converter visitantes.
- **Rotas:** `/`, `/welcome`, `/sala-da-visitante`, `/tour`, `/quiz`, `/experiencia`, `/travessia-zero`.
- **Componentes:** `SalaDaVisitante`, `Tour`, `QuizPage`, `ExperienciaGratuita`.
- **Hooks:** `useEffectivePortal`, `useJourneyGuard`.
- **Tabelas Supabase:** `salas`, `sala_ferramentas`, `tour_sections`, `quiz_perguntas`, `quiz_respostas`.
- **Status:** Manter/Reorganizar.
- **Prioridade:** Média.
- **Risco:** Baixo.
- **Plano de Migração:** Mover componentes de `src/pages` e `src/components` para o domínio.
- **Rollback:** Manter rotas originais no `App.tsx` apontando para arquivos antigos se necessário.

### 2. src/domains/clube
- **Finalidade:** Hub de conteúdo recorrente e engajamento contínuo.
- **Rotas:** `/clube`, `/clube/*`, `/planos-clube-oracular`.
- **Componentes:** `ClubeHub`, `ClubeRotas`, `ClubeLaboratorio`, `CamaraSussurro`.
- **Hooks:** `useClubeOracular`, `useClubeLivro`.
- **Tabelas Supabase:** `clube_v3_user_progress`, `clube_obras_essencia_8020`, `clube_livro_aulas`.
- **Edge Functions:** `clube-knowledge-retrieval`.
- **Status:** **Crítico (Hardening)**.
- **Prioridade:** Máxima.
- **Risco:** Crítico.
- **Plano de Migração:** Extrair lógica de `src/hooks` para o domínio; unificar checkouts em `/planos`.
- **Rollback:** Manter duplicidade de rotas de planos durante 1 sprint.

### 3. src/domains/formacao
- **Finalidade:** Entrega de cursos e jornadas de alto valor.
- **Rotas:** `/formacao`, `/cursos`, `/cursos/:id`, `/academia`, `/forum`.
- **Componentes:** `PáginaVendasFormacao`, `CourseView`, `FormationProgress`.
- **Hooks:** `useCourses`, `useCourseAccess`.
- **Tabelas Supabase:** `courses`, `course_modules`, `course_lessons`, `user_course_progress`.
- **Status:** Manter.
- **Prioridade:** Alta.
- **Risco:** Médio.
- **Plano de Migração:** Agrupar lógica de ensino.

### 4. src/domains/casa-maquinas
- **Finalidade:** Ambiente de trabalho para terapeutas/oráculas.
- **Rotas:** `/casa-maquinas/*`, `/casa-maquinas/painel`.
- **Componentes:** `CabineTerapeuta`, `PainelClinico`, `ModoSessao`.
- **Hooks:** `useCasaMaquinasAccess`, `useClienteJardim`, `useSessionMode`.
- **Tabelas Supabase:** `terapeuta_clientes`, `co_sessions`, `co_session_notes`.
- **Edge Functions:** `cabine-decisao-clinica`, `motor-sessao`.
- **Status:** **Crítico (Isolamento)**.
- **Prioridade:** Máxima.
- **Risco:** Crítico.
- **Plano de Migração:** Criar serviços específicos para gestão de clientes.
- **Rollback:** Manter as tabelas de sessão inalteradas; reverter apenas UI se houver quebra.

### 5. src/domains/jardins
- **Finalidade:** Espaço de auto-observação e partilha para a usuária.
- **Rotas:** `/jardim`, `/canteiro`.
- **Hooks:** `useJardimHeroina`, `useCanteiroReactions`.
- **Tabelas Supabase:** `co_jardins`, `co_garden_flowers`, `heroina_insights`.
- **Status:** Manter.
- **Prioridade:** Média.
- **Risco:** Alto (Privacidade).

### 6. src/domains/cidadela
- **Finalidade:** Motores visuais e motores de cartografia psíquica.
- **Rotas:** `/cidadela`, `/cidadela/mandala`.
- **Componentes:** `MandalaCidadela`, `MapaVivoV2`, `CartografiaGPS`.
- **Hooks:** `useCidadelaEstado`, `useMapaVivo`, `useCartografiaProfile`.
- **Tabelas Supabase:** `user_cidadela_estado`, `co_cartografia_profile`.
- **Status:** **Reorganizar (Unificação)**.
- **Prioridade:** Alta.
- **Risco:** Alto (Performance/CLS).

### 7. src/domains/oraculos
- **Finalidade:** Mecânicas de sorteio e portais simbólicos.
- **Rotas:** `/oraculos`, `/templo-escuta`.
- **Hooks:** `useOracles`, `useAudioProgress`.
- **Tabelas Supabase:** `decks`, `cards`, `oracle_draws`, `oraculo_portais`.
- **Edge Functions:** `oracle-draw`, `oracle-synthesis`.
- **Status:** Manter.
- **Prioridade:** Alta.
- **Risco:** Médio.

### 8. src/domains/biblioteca
- **Finalidade:** Centralização de conhecimento e acervo.
- **Rotas:** `/biblioteca`, `/biblioteca/casos`.
- **Componentes:** `BibliotecaUnificada`, `BibliotecaCasos`.
- **Hooks:** `useBibliotecaCasos`.
- **Status:** **Unificação**.
- **Prioridade:** Média.
- **Risco:** Baixo.
- **Plano de Migração:** Integrar `BibliotecaDasTravessias` como filtros na Unificada.

### 9. src/domains/syntheia
- **Finalidade:** Interface de IA e suporte cognitivo.
- **Rotas:** `/syntheia`.
- **Componentes:** `SyntheiaChat`, `SyntheiaInterface`.
- **Hooks:** `useSyntheiaChat`.
- **Edge Functions:** `syntheia-chat`.
- **Status:** Estabilizar.
- **Prioridade:** Média.
- **Risco:** Alto (Custos).

### 10. src/domains/admin
- **Finalidade:** Gestão operacional da plataforma (usuárias, conteúdos).
- **Rotas:** `/admin`.
- **Componentes:** `AdminLayout`, `EditorBlocos`.
- **Tabelas Supabase:** `user_roles`, `content_blocks`.
- **Status:** Crítico.
- **Prioridade:** Alta.
- **Risco:** Crítico (Permissões).

### 11. src/domains/painel-mestre
- **Finalidade:** Visão estratégica e financeira para a Founder.
- **Rotas:** `/admin?tab=founder` (futuramente `/painel-mestre`).
- **Componentes:** `AdminFounderDashboardTab`, `FinancialSummary`.
- **Hooks:** `useFounderAlerts`.
- **Tabelas Supabase (Views):** `view_founder_real_financial_summary`, `view_founder_alerts`.
- **Status:** **Extração Crítica**.
- **Prioridade:** Máxima.
- **Risco:** Crítico (Dados Sensíveis).
- **Plano de Migração:** Mover lógica financeira para serviços isolados.
- **Rollback:** Preservar a view original e o componente administrativo antigo.

---
## CRITÉRIOS DE VALIDAÇÃO GERAL
1. **Zero Downtime:** Nenhuma rota de checkout ou acesso ao Clube pode quebrar durante a movimentação.
2. **Isolamento de Erros:** Uma falha no `domains/syntheia` não deve afetar o `domains/clube`.
3. **Performance:** Tempo de carregamento da página inicial (LCP) deve permanecer estável ou melhorar.
4. **Segurança:** Nenhuma mudança em RLS ou Policies deve ser necessária para a reorganização de pastas.

---
*Arquitetura alvo gerada em 11/05/2026 — Somente Planejamento.*
