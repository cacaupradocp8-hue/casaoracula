# CASA_ORACULA_FUNCTIONAL_INVENTORY.md

**Fase 2 — Inventário Funcional**
Diagnóstico detalhado por funcionalidade. Nenhuma alteração de código, banco, RLS, Edge Functions, Auth ou publicação foi realizada.

> Legenda de Status: `manter` · `revisar` · `legado` · `duplicado` · `experimental` · `crítico` · `laboratório`
> Legenda de Risco: `baixo` · `médio` · `alto` · `crítico`

---

## 1. SALA DE VISITA

### 1.1 Sala da Visitante (portal de entrada)
- **Rota:** `/sala-da-visitante`
- **Componentes:** `SalaDaVisitante.tsx`, `VisitorSalaContent`, `AppLayout`
- **Hooks:** `useEffectivePortal`, `useAuth`
- **Tabelas:** `salas`, `sala_ferramentas`, `tour_sections`
- **Edge Functions:** —
- **Usuário:** visitante, todos
- **Status:** manter
- **Risco:** baixo
- **Negócio:** porta de entrada simbólica; conversão indireta; parte da experiência principal; **não ocultar**.

### 1.2 Tour Institucional
- **Rota:** `/tour`
- **Componentes:** `Tour.tsx`, `HeroSection`, `SalasSection`, `FerramentasSection`, `RecursosSection`, `CTASection`
- **Hooks:** `useQuery` (TanStack)
- **Tabelas:** `tour_sections`, `salas`, `sala_ferramentas`
- **Usuário:** visitante
- **Status:** manter
- **Risco:** baixo
- **Negócio:** conversão de visitante → assinante/aluna; receita indireta.

### 1.3 Experiência Gratuita / Travessia 00
- **Rota:** `/experiencia`, `/travessia-zero`
- **Componentes:** `ExperienciaGratuita.tsx`
- **Hooks:** `useTravessiaUnlock`, `useJourneyGuard`
- **Tabelas:** `conteudo_travessias`, `user_progress`
- **Usuário:** visitante, aluna
- **Status:** crítico (gating de toda jornada)
- **Risco:** alto
- **Negócio:** porta única obrigatória; bloqueia Dashboard se não concluída.

### 1.4 Quiz de Entrada
- **Rota:** `/quiz`
- **Componentes:** `QuizPage.tsx`
- **Tabelas:** `quiz_perguntas`, `quiz_respostas`
- **Usuário:** visitante
- **Status:** manter
- **Risco:** baixo
- **Negócio:** segmentação de leads; receita indireta.

### 1.5 Welcome dinâmico
- **Rota:** `/`, `/welcome`
- **Componentes:** `Welcome.tsx`
- **Usuário:** todos
- **Status:** manter
- **Risco:** baixo

---

## 2. CLUBE / ROTAS

### 2.1 Clube Oracular v3 (Hub)
- **Rota:** `/clube`
- **Componentes:** `ClubeHub`, `ClubeRotas`, `ClubeEstacoes`
- **Hooks:** `useClubeOracular`, `useClubeLivro`, `useClubeInsights`, `useEssencia8020`
- **Tabelas:** `clube_v3_user_progress`, `clube_obras_essencia_8020`, `clube_livro_aulas`, `clube_livro_integracoes`
- **Edge Functions:** `clube-knowledge-retrieval`, `syntheia-chat`
- **Usuário:** assinante, aluna, oracula, admin
- **Status:** **crítico** (núcleo de MRR)
- **Risco:** crítico
- **Negócio:** principal motor de assinatura recorrente; **gera receita direta**; experiência principal; **não ocultar**.

### 2.2 Clube — Laboratórios (Forja / Espelho / Encarnação)
- **Rota:** `/clube/laboratorio/:id`
- **Componentes:** `ClubeLaboratorio.tsx`
- **Hooks:** `useLabOracular`, `useSeasonLab`
- **Tabelas:** `clube_laboratorios`, `clube_v3_user_progress`
- **Usuário:** assinante
- **Status:** manter
- **Risco:** médio

### 2.3 Câmara do Sussurro
- **Rota:** `/clube/sussurro`
- **Componentes:** `CamaraSussurro`
- **Tabelas:** `clube_sussurros`
- **Usuário:** assinante
- **Status:** manter
- **Risco:** médio
- **Negócio:** insights críticos; parte da experiência diferencial.

### 2.4 Clube do Livro (legado v1/v2)
- **Rota:** `/clube-livro/*` (redirects)
- **Tabelas:** `_deprecated_club_*`, `_deprecated_club_user_cycles`
- **Status:** **legado**
- **Risco:** alto (não remover sem auditoria de dados históricos)
- **Negócio:** descontinuado; manter dados arquivados.

### 2.5 Planos do Clube / Checkout
- **Rota:** `/planos`, `/planos-clube-oracular`
- **Componentes:** `Planos.tsx`, `PlanosClubeOracular.tsx`
- **Status:** **duplicado**
- **Risco:** alto
- **Negócio:** **gera receita direta**; risco de divergência de preço/conteúdo entre páginas; unificar após Fase 3.

---

## 3. FORMAÇÃO ORÁCULA

### 3.1 Página de Vendas da Formação
- **Rota:** `/formacao`
- **Componentes:** seções narrativas (`HeroFormacao`, `MetodoSection`, ...)
- **Status:** crítico
- **Risco:** alto
- **Negócio:** **principal funil high-ticket**; gera receita direta.

### 3.2 Cursos e Módulos
- **Rota:** `/cursos`, `/cursos/:id`
- **Hooks:** `useCourses`, `useCourseDetail`, `useCourseAccess`, `useFormationProgress`
- **Tabelas:** `courses`, `course_modules`, `course_lessons`, `user_course_progress`
- **Usuário:** aluna, oracula, admin
- **Status:** manter
- **Risco:** médio

### 3.3 Travessias (conteúdo formativo)
- **Rota:** `/travessias/*`
- **Hooks:** `useCOTravessias`, `useMotorDeTravessia`, `useRitualPassage`
- **Tabelas:** `conteudo_travessias`, `travessia_library_tags`, `ritual_passages`
- **Status:** crítico
- **Risco:** alto

### 3.4 Academia / Progresso
- **Rota:** `/academia`
- **Hooks:** `useAcademyProgress`
- **Status:** manter
- **Risco:** baixo

### 3.5 Fórum de Alunas
- **Rota:** `/forum`
- **Status:** revisar (engajamento)
- **Risco:** baixo

---

## 4. CASA DAS MÁQUINAS / CABINE

### 4.1 Painel Clínico (Cabine do Terapeuta)
- **Rota:** `/casa-maquinas`, `/casa-maquinas/painel`
- **Componentes:** `CabineTerapeuta`, `PainelClinico`, `CabinePreparacao`
- **Hooks:** `useCasaMaquinasAccess`, `useClienteJardim`, `useClienteJardimCompleto`, `useMapaVivo`, `useMapaVivoLive`
- **Tabelas:** `terapeuta_clientes`, `co_sessions`, `co_cartografia_profile`, `co_mapa_vivo`, `co_jardins`
- **Edge Functions:** `cabine-decisao-clinica`, `mapa-vivo-update`, `motor-sessao`
- **Usuário:** oracula, admin
- **Status:** **crítico**
- **Risco:** **crítico**
- **Negócio:** núcleo profissional; diferencial competitivo; **não ocultar, não refatorar sem rollback**.

### 4.2 Sessões Imersivas / Modo Sessão
- **Rota:** `/casa-maquinas/sessao/:id`
- **Hooks:** `useSessionMode`, `useSessionArchetypes`, `useSessoesLabirinto`
- **Edge Functions:** `motor-sessao-vivo`, `motor-sintese`
- **Status:** experimental
- **Risco:** alto

### 4.3 Notas de Sessão
- **Rota:** `/casa-maquinas/notas`
- **Tabelas:** `co_session_notes`
- **Status:** manter
- **Risco:** alto (dados sensíveis)

### 4.4 Mapa Vivo do Cliente
- **Componentes:** `MapaVivoV2`, `MapaVivoCidadela`, `MapaVivoLive`
- **Hooks:** `useMapaVivo`, `useMapaVivoCidadela`, `useMapaVivoLive`
- **Status:** **duplicado** (3 engines de mapa vivo)
- **Risco:** alto
- **Negócio:** unificar após decisão arquitetural.

### 4.5 Gestos de Integração
- **Tabelas:** `co_gestos_integracao`
- **Status:** manter
- **Risco:** médio

---

## 5. JARDINS

### 5.1 Jardim da Heroína (cliente)
- **Rota:** `/jardim`, `/jardim/heroina`
- **Hooks:** `useJardimHeroina`, `useJardimHeroinaNovo`, `useMapaHeroina`, `useHeroinaFaseAtiva`
- **Tabelas:** `co_jardins`, `co_garden_flowers`, `heroina_insights`, `heroina_arquetipo_registros`
- **Usuário:** cliente (assinante), aluna
- **Status:** crítico
- **Risco:** alto (privacidade)

### 5.2 Jardim do Ofício (terapeuta)
- **Rota:** `/jardim/oficio`
- **Hooks:** `useJardimGrupo`
- **Status:** manter
- **Risco:** médio

### 5.3 Canteiro (compartilhamento simbólico)
- **Rota:** `/canteiro`
- **Hooks:** `useCanteiroReactions`, `useSubmitPartilha`, `useMinhasPublicacoesCanteiro`
- **Status:** manter
- **Risco:** médio

### 5.4 QA Jardins (debug de vínculos)
- **Rota:** `/admin/qa-jardins`
- **Hooks:** `useQaJardimData`
- **Status:** **laboratório**
- **Risco:** baixo
- **Negócio:** ferramenta interna; pode ser ocultada para não-admin.

---

## 6. cidaDELA / CARTOGRAFIA

### 6.1 Mandala da Cidadela
- **Rota:** `/cidadela`, `/cidadela/mandala`
- **Componentes:** `MandalaCidadela.tsx`
- **Hooks:** `useCidadelaEstado`, `useCidadelaMap`, `useCidadelaOracle`
- **Tabelas:** `user_cidadela_estado`
- **Status:** crítico
- **Risco:** alto
- **Negócio:** experiência principal; diferencial metodológico.

### 6.2 Cartografia Psíquica (Behavioral Reading)
- **Hooks:** `useCartografiaProfile`, `useCartografiaCatalogos`, `useCartografiaGPS`
- **Tabelas:** `co_cartografia_profile`
- **Status:** crítico
- **Risco:** crítico

### 6.3 Revelação da Cidadela
- **Rota:** `/cidadela/revelacao`
- **Status:** manter
- **Risco:** médio

### 6.4 Mapas duplicados — diagnóstico
- `MapaOracula` · `MapaCidadela` · `MapaVivoV2` · `MandalaCidadela` · `MapaVivoLive`
- **Status:** **duplicado**
- **Risco:** alto
- **Negócio:** consolidar em engine única após Fase 3.

---

## 7. ORÁCULOS

### 7.1 Sorteio de Cartas
- **Rota:** `/oraculos`, `/oraculos/sorteio`
- **Hooks:** `useOracles`, `useOraculoPortais`, `useOracularSeasons`
- **Tabelas:** `decks`, `cards`, `oracle_draws`
- **Edge Functions:** `oracle-draw`, `oracle-synthesis`
- **Status:** crítico
- **Risco:** alto
- **Negócio:** identidade do produto.

### 7.2 Templo da Escuta (áudio simbólico)
- **Rota:** `/templo-escuta`
- **Hooks:** `useAudioProgress`, `useOnboardingAudio`
- **Edge Functions:** `eleven-tts`
- **Status:** manter
- **Risco:** médio
- **Negócio:** experiência sensorial diferencial.

### 7.3 Portais Oraculares
- **Rota:** `/oraculos/portais`
- **Tabelas:** `oraculo_portais`
- **Status:** manter
- **Risco:** médio

---

## 8. BIBLIOTECA

### 8.1 Biblioteca Unificada (Acervo)
- **Rota:** `/biblioteca`
- **Status:** manter (candidata a oficial)
- **Risco:** baixo

### 8.2 Biblioteca das Travessias
- **Rota:** `/biblioteca-travessias`
- **Status:** **duplicado**
- **Risco:** médio

### 8.3 Biblioteca de Casos (profissional)
- **Rota:** `/biblioteca/casos`
- **Hooks:** `useBibliotecaCasos`
- **Status:** manter (escopo distinto: clínico)
- **Risco:** alto (sensível)

### 8.4 Bibliotecas duplicadas — diagnóstico
- `BibliotecaUnificada` · `BibliotecaDasTravessias` · `BibliotecaTravessias`
- **Status:** **duplicado**
- **Negócio:** decidir biblioteca oficial; manter as outras como redirect.

---

## 9. SYNTHEIA (IA)

### 9.1 Syntheia Chat (Hub)
- **Rota:** `/syntheia`
- **Componentes:** `SyntheiaChat`, `SyntheiaInterface`
- **Hooks:** `useSyntheiaChat`, `useTextModel`
- **Services:** `syntheiaChat.ts`, `syntheiaContextAdapter.ts`
- **Edge Functions:** `syntheia-chat` (Lovable AI Gateway, Gemini 2.5-flash)
- **Usuário:** aluna, oracula, assinante, admin
- **Status:** crítico
- **Risco:** alto
- **Negócio:** suporte formativo; **não clínica**.

### 9.2 Syntheia Voice
- **Rota:** `/syntheia/voz`
- **Hooks:** `useSyntheiaVoice`, `useUserVoz`
- **Edge Functions:** `eleven-tts`, `voice-stream`
- **Status:** **experimental**
- **Risco:** alto
- **Negócio:** pode ser ocultada temporariamente.

### 9.3 Converse com o Livro
- **Modo:** `converse_com_livro` (syntheiaChat)
- **Edge Functions:** `clube-knowledge-retrieval`
- **Status:** manter
- **Risco:** médio

---

## 10. ADMIN GUARDIÃ

### 10.1 Painel Admin (Hub)
- **Rota:** `/admin`
- **Componentes:** `AdminLayout`, abas dinâmicas
- **Hooks:** `useAdminBlocks`, `useTodasRotas`
- **Status:** crítico
- **Risco:** alto

### 10.2 Gestão de Usuárias / Matrículas
- **Rota:** `/admin?tab=users`, `/admin?tab=enrollments`
- **Tabelas:** `profiles`, `user_roles`, `user_courses`
- **Status:** crítico
- **Risco:** crítico (privilégios)

### 10.3 Editor de Blocos / Ferramentas / Salas / Portais
- **Rota:** `/admin?tab=content`
- **Tabelas:** `salas`, `sala_ferramentas`, `conteudo_travessias`, `content_blocks`
- **Status:** crítico
- **Risco:** alto
- **Negócio:** **fonte única de verdade**; UI 100% data-driven.

### 10.4 Central de Jornadas / Ciclos
- **Rota:** `/admin?tab=journeys`
- **Status:** manter
- **Risco:** médio

### 10.5 Preview Bar (troca de perfil)
- **Componentes:** `AdminPreviewContext`
- **Status:** **laboratório** (testes)
- **Risco:** baixo

### 10.6 QA / Diagnósticos
- **Rotas:** `/admin/qa-*`
- **Status:** laboratório
- **Risco:** baixo

---

## 11. PAINEL MESTRE / FOUNDER DASHBOARD

### 11.1 Founder Dashboard
- **Rota:** `/admin?tab=founder`
- **Componentes:** `AdminFounderDashboardTab.tsx`
- **Hooks:** `useFounderAlerts`
- **Tabelas:** `view_founder_real_financial_summary`, `view_founder_alerts`, `ai_interaction_logs`
- **Edge Functions:** —
- **Usuário:** **apenas admin**
- **Status:** **crítico**
- **Risco:** **crítico**
- **Negócio:** visão estratégica/financeira da guardiã; **não pode ser removido**; isolar em `src/domains/painel-mestre` na Fase 3.

### 11.2 Simulador What-If
- **Componente:** parte do `AdminFounderDashboardTab`
- **Status:** manter
- **Risco:** médio
- **Observação:** `revenue_formacao` está hardcoded `= 0`; corrigir na Fase 4.

### 11.3 Alertas Premium
- **Hooks:** `useFounderAlerts`
- **Categorias:** IA, retenção, receita, operações
- **Status:** manter
- **Risco:** médio
- **Observação:** thresholds atuais (churn>4, margin<25, ia_pct>15) são heurísticos; revisar com dados reais.

---

## 12. RADIESTESIA PORTAL

### 12.1 Portal de Radiestesia (Hub)
- **Rota:** `/radiestesia`
- **Componentes:** `RadiestesiaPortal`
- **Hooks:** `useRadiestesiaConfig`
- **Status:** **experimental**
- **Risco:** médio
- **Negócio:** estratégico ou laboratório? **decisão pendente** (ver Discovery).

### 12.2 Subferramentas
- Leitura 5 Camadas · Mesa Radiônica · Catálogo de Gráficos · Gráfico Detalhe · Pantáculos · Cristais e Campos · Escala Narrativa · Diário de Práticas
- **Rotas:** `/radiestesia/*`
- **Status:** experimental
- **Risco:** médio
- **Negócio:** **pode ser ocultada temporariamente** sem impacto em receita principal.

---

## 13. ROTAS LEGADAS / REDIRECTS

| Rota antiga | Destino | Status | Risco |
|---|---|---|---|
| `/clube-livro/*` | `/clube` | legado | médio |
| `/cursos-antigos/*` | `/cursos` | legado | baixo |
| `/aulas/:id` | `/cursos/:id` | legado | baixo |
| `/portal-mentorada` | `/dashboard-membro` | legado | baixo |
| `/portal-iniciada` | `/dashboard-membro` | legado | baixo |

- **Negócio:** preservar redirects (regra de ouro: nunca remover rotas).

---

## 14. TIPOS DE PORTAL LEGADOS

| Tipo | Normaliza para | Status | Risco |
|---|---|---|---|
| `mentorada` | `aluna` | legado | médio |
| `aluna_formacao` | `aluna` | legado | médio |
| `pre_iniciada` | `aluna` | legado | médio |
| `iniciada` | `oracula` | legado | médio |

- **Observação:** normalização ativa em `normalizePortalType()`; manter até auditoria completa de usuárias afetadas.

---

## 15. CHECKOUTS / PAGAMENTOS

| Fluxo | Rota | Status | Risco |
|---|---|---|---|
| Planos gerais | `/planos` | duplicado | alto |
| Planos Clube Oracular | `/planos-clube-oracular` | duplicado | alto |
| Convite/Onboarding pago | `/convite/:token` | manter | alto |
| Stripe webhooks | edge `stripe-webhook` | crítico | crítico |

- **Negócio:** **gera receita direta**; consolidar UI mantendo edge functions intactas.

---

## 16. RESUMO POR CRITICIDADE

### Crítico (não tocar sem rollback documentado)
- Painel Mestre / Founder Dashboard
- Casa das Máquinas / Cabine
- Cartografia Psíquica
- Clube v3 (motor MRR)
- Sistema de Oráculos
- Travessia 00 (gating)
- Stripe webhooks
- Gestão de usuárias/roles

### Duplicado (consolidar na Fase 3 com plano)
- Bibliotecas (3)
- Mapas (5 engines)
- Checkouts (2)

### Experimental (pode ser ocultado)
- Syntheia Voice
- Radiestesia Portal
- Modo Sessão Imersivo

### Legado (preservar com redirect)
- Clube do Livro v1/v2
- Portais `mentorada`, `pre_iniciada`, `iniciada`, `aluna_formacao`
- Rotas `/aulas`, `/cursos-antigos`, `/portal-*`

### Laboratório (uso interno)
- QA Jardins
- Preview Bar
- Rotas `/admin/qa-*`

---

## 17. PERGUNTAS PARA DECISÃO (Fase 3)

1. Qual biblioteca é a **oficial**? (Unificada vs Travessias)
2. Qual engine de mapa será **canônica**? (MapaVivoLive parece a mais recente)
3. Radiestesia é produto estratégico ou laboratório?
4. Checkouts devem ser unificados em uma única rota `/planos` com tabs?
5. Quais tabelas `_deprecated_club_*` podem ser arquivadas?
6. Founder Dashboard recebe domínio próprio `src/domains/painel-mestre` já na Fase 3?

---

*Inventário gerado em 11/05/2026 — Fase 2 (somente diagnóstico).*
*Nenhuma alteração de código, banco, RLS, Edge Functions ou Auth foi realizada.*
