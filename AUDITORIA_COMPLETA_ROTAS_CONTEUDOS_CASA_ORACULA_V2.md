# Relatório de Auditoria: Casa Orácula V2
**Data:** 17 de Maio de 2026  
**Status:** Concluído - Auditoria Refinada (Evidência Direta)

## 1. Resumo Executivo
Esta auditoria foi realizada através da análise direta dos arquivos de rotas (`src/App.tsx`, `src/routes/*`) e componentes de navegação (`src/components/layout/Navigation.tsx`). O mapeamento identifica a coexistência de três domínios principais (Visitante/Aluna, Casa das Máquinas e Admin) e uma camada significativa de rotas legadas e redirecionamentos.

---

## 2. Mapa Completo de Rotas (Evidência Direta)

| Rota Exata | Componente Renderizado | Arquivo de Declaração | Wrapper / Proteção | minPortal | Domínio | No Menu Principal? | No Link Interno? | Status Sugerido | Observação Técnica |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| `/` | `Auth` | `src/App.tsx` | `PublicRoute` | - | Entrada | Não | Sim | Manter | Tela de login/cadastro. |
| `/auth` | `Auth` | `src/App.tsx` | `PublicRoute` | - | Entrada | Não | Sim | Manter | Redundância necessária. |
| `/reset-password` | `ResetPassword` | `src/App.tsx` | Sem Wrapper | - | Público | Não | Sim | Manter | Recuperação de senha. |
| `/install` | `InstallApp` | `src/App.tsx` | Sem Wrapper | - | Público | Não | Sim | Manter | PWA/Instalação. |
| `/explorar-a-casa` | `ExplorarACasa` | `src/App.tsx` | Sem Wrapper | - | Visitante | Sim | Sim | Manter | Menu Visitante. |
| `/vitrine` | `Vitrine` | `src/App.tsx` | Sem Wrapper | - | Visitante | Sim | Sim | Manter | Menu Visitante/Assinante. |
| `/desbloqueie` | `DesbloqueiePage` | `src/App.tsx` | Sem Wrapper | - | Público | Não | Não | Revisar | Gating de vendas/planos. |
| `/onboarding` | `Onboarding` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Fluxo inicial pós-login. |
| `/sala-da-visitante` | `SalaDaVisitante` | `src/App.tsx` | `ProtectedRoute` | visitante | Visitante | Não | Sim | Manter | Landing page do visitante. |
| `/welcome` | `Welcome` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Boas-vindas. |
| `/mapa-casa` | `MapaCasaOracula` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Navegação visual. |
| `/convite-clube` | `ConviteClube` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Link de convite. |
| `/dashboard-membro` | `DashboardMembro` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Sim | Sim | Manter | Landing page do Clube/Aluna. |
| `/portais` | `Portais` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Hub de portais. |
| `/portal-junguiano` | `PortalJunguiano` | `src/App.tsx` | `ProtectedRoute` | aluna_formacao | Formação | Não | Sim | Revisar | Usa minPortal legado. |
| `/portal-junguiano/porta/:id` | `PortalJunguianoPorta` | `src/App.tsx` | `ProtectedRoute` | aluna_formacao | Formação | Não | Sim | Revisar | Usa minPortal legado. |
| `/confirmar-profissional` | `ConfirmarProfissional` | `src/App.tsx` | `ProtectedRoute` | visitante | Profissional | Não | Sim | Manter | Gating para CM. |
| `/casa-tecelas` | `CasaTecelaAtrio` | `src/App.tsx` | `ProtectedRoute` | oracula | Formação | Não | Sim | Manter | Acesso profissional/avançado. |
| `/circulo-oracular` | `CirculoOracularPage` | `src/App.tsx` | `ProtectedRoute` | assinante | Clube | Sim | Sim | Manter | Menu Assinante. |
| `/meu-jardim` | `JardimHeroinaClientePage` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Jardim da cliente. |
| `/jardim` | `JardimHeroina` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Dashboard de jardins. |
| `/sala-das-maquinas/cabine` | `CabineTerapeuta` | `src/App.tsx` | `ProtectedRoute` | oracula | Casa das Máquinas | Não | Sim | Fundir | Existe `/casa-das-maquinas/cabine` também. |
| `/mapa-vivo` | `CoMapaVivoPage` | `src/App.tsx` | `ProtectedRoute` | oracula | Casa das Máquinas | Não | Sim | Manter | Editor de mapa vivo. |
| `/aceitar-convite` | `AceitarConvitePage` | `src/App.tsx` | Suspense (No Auth?) | - | Público | Não | Sim | Manter | Convites externos. |
| `/casa` | `CasaAtrio` | `src/App.tsx` | `ProtectedRoute` | oracula | Casa das Máquinas | Não | Sim | Manter | Atrio da CM. |
| `/oracula` | `OraculaPage` | `src/App.tsx` | Sem Wrapper | - | Visitante | Sim | Sim | Manter | Landing institucional. |
| `/portal-oracula` | `PortalOraculaPage` | `src/App.tsx` | `ProtectedRoute` | aluna | Formação | Não | Sim | Manter | Conteúdo formativo. |
| `/metodo` | `Metodo` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Base teórica. |
| `/labirinto-heroina` | `LabirintoHeroinaPage` | `src/App.tsx` | `ProtectedRoute` | aluna_formacao | Formação | Não | Sim | Revisar | Usa minPortal legado. |
| `/cartas-jornada` | `CartasJornadaPage` | `src/App.tsx` | `ProtectedRoute` | pre_iniciada | Legado | Não | Sim | Revisar | Usa minPortal legado. |
| `/mapa-heroina` | `MapaHeroinaPage` | `src/App.tsx` | `ProtectedRoute` | aluna_formacao | Formação | Não | Sim | Revisar | Usa minPortal legado. |
| `/narroterapia` | `NarroterapiaHub` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Hub de narroterapia. |
| `/narroterapia/clinica` | `BibliotecaClinica` | `src/App.tsx` | `ProtectedRoute` | aluna_formacao | Formação | Não | Sim | Revisar | Usa minPortal legado. |
| `/biblioteca` | `BibliotecaUnificada` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Novo Hub Unificado. |
| `/laboratorio-leitura` | `LaboratorioLeitura` | `src/App.tsx` | `ProtectedRoute` | mentorada | Legado | Não | Sim | Revisar | Usa minPortal legado. |
| `/agentes` | `Agentes` | `src/App.tsx` | `ProtectedRoute` | mentorada | Legado | Não | Sim | Revisar | Usa minPortal legado. |
| `/ferramentas` | `FerramentasHub` | `src/App.tsx` | `ProtectedRoute` | visitante | Aluna | Sim | Sim | Manter | Hub de ferramentas. |
| `/session-room` | `SessionRoomHome` | `src/App.tsx` | `ProtectedRoute` | mentorada | Legado | Não | Sim | Fundir | Migrar para CM. |
| `/session-room/:caseId` | `SessionRoomCase` | `src/App.tsx` | `ProtectedRoute` | mentorada | Legado | Não | Sim | Fundir | Migrar para CM. |
| `/atlas-arquetipos` | `AtlasArquetiposFemininos` | `src/App.tsx` | `ProtectedRoute` | oracula | Casa das Máquinas | Não | Sim | Manter | Ferramenta avançada. |
| `/ferramentas/mapa-vivo` | `MapaVivoList` | `src/App.tsx` | `ProtectedRoute` | mentorada | Legado | Não | Sim | Revisar | Usa minPortal legado. |
| `/ferramenta/cartografia-psiquica-oracula` | `CartografiaPsiquicaPage` | `src/App.tsx` | `ProtectedRoute` | visitante | Visitante | Não | Sim | Manter | Porta de entrada. |
| `/revelacao-cidadela` | `RevelacaoCidadelaPage` | `src/App.tsx` | `ProtectedRoute` | visitante | Visitante | Não | Sim | Manter | Porta de entrada. |
| `/templates/big5/:sessionId` | `Big5TemplateEditor` | `src/App.tsx` | `ProtectedRoute` | mentorada | Profissional | Não | Sim | Revisar | Parâmetro sensível + Portal legado. |
| `/radiestesia` | `RadiestesiaPortal` | `src/App.tsx` | `ProtectedRoute` | mentorada | Legado | Não | Sim | Revisar | Usa minPortal legado. |
| `/syntheia` | `Syntheia` | `src/App.tsx` | `ProtectedRoute` | mentorada | Experimental | Não | Sim | Revisar | Agente IA. Portal legado. |
| `/quiz/:quizId` | `QuizPage` | `src/App.tsx` | `ProtectedRoute` | visitante | Visitante | Não | Sim | Manter | Parâmetro sensível. |
| `/cliente/:clienteId` | `ClientePerfil` | `src/App.tsx` | `ProtectedRoute` | mentorada | Legado | Não | Sim | Arquivar | Existe `/casa-das-maquinas/clientes/:clienteId`. |
| `/minha-jornada` | `MinhaJornada` | `src/routes/jornadaRoutes.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Extracao ok. |
| `/travessia/:slug` | `TravessiaDetalhe` | `src/routes/jornadaRoutes.tsx` | `ProtectedRoute` | visitante | Aluna | Não | Sim | Manter | Parâmetro sensível. |
| `/clube` | `ClubeRotasCatalogo` | `src/routes/jornadaRoutes.tsx` | `ProtectedRoute` | visitante | Clube | Sim | Sim | Manter | Hub do Clube. |
| `/casa-das-maquinas` | `CasaDasMaquinas` | `src/routes/casaMaquinasRoutes.tsx` | `ProtectedRoute` | oracula | Casa das Máquinas | Sim | Sim | Manter | Dashboard Profissional. |
| `/casa-das-maquinas/cabine` | `CabineTerapeutaPage` | `src/routes/casaMaquinasRoutes.tsx` | `ProtectedRoute` | oracula | Casa das Máquinas | Sim | Sim | Manter | Acesso principal Cabine. |
| `/casa-das-maquinas/clientes/:clienteId` | `ClienteDetailPage` | `src/routes/casaMaquinasRoutes.tsx` | `ProtectedRoute` | oracula | Casa das Máquinas | Não | Sim | Manter | Parâmetro sensível. |
| `/casa-das-maquinas/sessao/:clienteId` | `ModoSessaoImersivo` | `src/routes/casaMaquinasRoutes.tsx` | `ProtectedRoute` | oracula | Casa das Máquinas | Não | Sim | Manter | Imersão clínica. |
| `/admin` | `Admin` | `src/routes/adminRoutes.tsx` | `ProtectedRoute` | admin | Admin | Sim | Sim | Manter | Painel Gestão. |

---

## 3. Seções Específicas

### 3.1 Rotas Públicas (Sem Gating de Login)
- `/` (Auth)
- `/auth`
- `/reset-password`
- `/install`
- `/explorar-a-casa`
- `/vitrine`
- `/desbloqueie`
- `/oracula`
- `/aceitar-convite`
- `/planos`

### 3.2 Rotas Protegidas sem minPortal Explícito (Default: visitante)
- `/onboarding`
- `/dashboard-membro`
- `/biblioteca`
- `/ferramentas`
- `/clube`
- `/travessia/:slug`
- `/minha-jornada`

### 3.3 Rotas com minPortal Legado
Estas rotas usam permissões que o `normalizePortalType` mapeia para `aluna` ou `oracula`, mas o código ainda as referencia explicitamente:
- **mentorada**: `/laboratorio-leitura`, `/agentes`, `/session-room`, `/ferramentas/mapa-vivo`, `/templates/*`, `/radiestesia/*`, `/syntheia`, `/minhas-clientes`, `/cliente/:clienteId`.
- **aluna_formacao**: `/portal-junguiano`, `/labirinto-heroina`, `/mapa-heroina`, `/narroterapia/clinica`, `/academia`, `/casa-das-maquinas/clientes/:clienteId/jornada-alma`.
- **pre_iniciada**: `/cartas-jornada`, `/ferramentas/escala-maia`.
- **iniciada**: (Mapeado para `oracula`, usado em lógica interna mas pouco em rotas diretas agora).

### 3.4 Rotas com Parâmetros Sensíveis
- **:clienteId**: `/cliente/:clienteId`, `/casa-das-maquinas/clientes/:clienteId/*`, `/casa-das-maquinas/sessao/:clienteId`.
- **:sessionId**: `/templates/big5/:sessionId`, `/templates/enneagram/:sessionId`, etc.
- **:groupId**: `/casa-das-maquinas/grupos/:groupId`, `/session-room/group/:groupId`.
- **:caseId**: `/session-room/:caseId`.
- **:id**: `/salas/:id`, `/portal/:id`, `/cursos/:id`, `/mapas-pessoais/:id`.
- **:slug**: `/travessia/:slug`, `/clube/rota/:slug`, `/ferramentas/:slug`.

### 3.5 Redirecionamentos Legados (Aliasing)
- `/formacao` → `/cursos`
- `/dashboard` → `/dashboard-membro`
- `/ferramentas-metodo` → `/ferramentas`
- `/saas/*` → `/casa-das-maquinas/*` (vários sub-redirecionamentos)
- `/admin/clube-livro` → `/admin/clube`

### 3.6 Rotas Registradas mas Ausentes do Menu Principal
- `/mapa-casa` (Acesso via Dashboard/Cards)
- `/onboarding` (Automático)
- `/casa/*` (Sub-rotas da Casa das Máquinas)
- `/templates/*` (Acesso via Ferramentas)
- `/radiestesia/*` (Acesso via Ferramentas)

### 3.7 Rotas da Casa das Máquinas (Foco em Cliente Real)
- `/casa-das-maquinas/clientes`
- `/casa-das-maquinas/clientes/:clienteId`
- `/casa-das-maquinas/sessao/:clienteId` (Sessão Imersiva)
- `/casa-das-maquinas/campo-clientes`

### 3.8 Rotas do Clube
- `/clube`
- `/clube/rota/:slug`
- `/convite-clube`
- `/circulo-oracular`

---

## 4. Plano de Limpeza em 3 Fases

### Fase 1: Travar Riscos (Imediato)
- **Ação**: Normalizar todos os `minPortal` para a nova hierarquia (visitante, aluna, oracula, assinante, admin) em `src/App.tsx` e `src/routes/*`.
- **Foco**: Eliminar as referências a `mentorada` e `aluna_formacao` nas definições de rotas para garantir que o RLS e o `useRouteGuard` operem sobre tipos consistentes.

### Fase 2: Organizar Navegação (Curto Prazo)
- **Ação**: Unificar as rotas de sessão. Temos `/session-room` (legado) e `/casa-das-maquinas/cabine` + `/casa-das-maquinas/sessao/:clienteId`.
- **Foco**: Consolidar tudo sob o namespace `/casa-das-maquinas/` para usuários profissionais.

### Fase 3: Consolidar Arquitetura (Médio Prazo)
- **Ação**: Remover fisicamente componentes e páginas marcados como "Arquivar" ou "Remover" na tabela.
- **Foco**: Limpeza de diretórios como `src/pages/labirinto` (se redundante) e arquivos de redirecionamento legados em `src/App.tsx`.

---
**Relatório gerado por Lovable AI - V2 com Evidência Direta.**\",file_path: