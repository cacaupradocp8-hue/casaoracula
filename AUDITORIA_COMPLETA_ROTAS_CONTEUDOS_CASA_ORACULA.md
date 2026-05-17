# AUDITORIA COMPLETA: ROTAS E CONTEÚDOS CASA ORÁCULA

## 1. Resumo Executivo
Esta auditoria mapeou a arquitetura de rotas, permissões e integridade de conteúdo da Casa Orácula. Foi identificada uma densidade crítica de rotas legadas, duplicadas e órfãs, além de inconsistências na matriz de permissões entre os diferentes portais. O sistema apresenta sinais de transições arquiteturais incompletas, resultando em "ruído" no código e potenciais riscos de UX e segurança.

---

## 2. Mapa de Rotas e Classificação de Uso

| Rota | Arquivo do Componente | Nível Mínimo | Menu? | Status Sugerido | Domínio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/sala-da-visitante` | `pages/SalaDaVisitante.tsx` | Visitante | Sim | Manter | Visitante |
| `/dashboard-membro` | `pages/DashboardMembro.tsx` | Aluna | Sim | Manter | Aluna |
| `/casa-das-maquinas` | `pages/casa-maquinas/CasaDasMaquinas.tsx` | Orácula | Sim | Manter | Casa das Máquinas |
| `/casa-das-maquinas/cabine`| `pages/casa-maquinas/CabineTerapeutaPage.tsx` | Orácula | Sim | **Protagonista** | Casa das Máquinas |
| `/session-room/*` | `pages/SessionRoom*.tsx` | Orácula | Não | **Remover (Legado)** | Legado |
| `/labirinto` | `pages/labirinto/LabirintoHome.tsx` | Aluna | Sim | Revisar | Clube/Legado |
| `/labirinto-heroina` | `pages/labirinto-heroina/...` | Aluna | Sim | **Manter (Novo)** | Clube |
| `/portal-junguiano` | `pages/PortalJunguiano.tsx` | Aluna | Não | Esconder/Fundir | Experimental |
| `/ferramenta/big5-simbolico`| `pages/Big5Simbolico.tsx` | Aluna | Não | Fundir | Experimental |
| `/ferramenta/big5-funcional`| `pages/Big5Funcional.tsx` | Aluna | Não | Fundir | Experimental |
| `/admin/*` | `pages/Admin.tsx` | Admin | Sim | Manter | Admin |
| `/saas/*` | (Redirecionamentos) | - | Não | Remover | Legado |
| `/app/clientes/*` | (Redirecionamentos) | - | Não | Remover | Legado |

---

## 3. Rotas Escondidas e Conteúdo Órfão

### 3.1 Páginas sem Link Direto (Acessíveis apenas por URL)
- `/quiz/:quizId`: Sistema de quizzes funcional mas sem hub central visível.
- `/agentes`: Página de Agentes (Analista, Curador, Simbólico) parece experimental e desconectada do fluxo principal.
- `/templo-de-escuta`: Audioteca meditativa sem CTA claro no menu principal.

### 3.2 Arquivos Órfãos (Existentes mas não usados)
- `src/pages/ExperienciaGratuita.tsx`: Legado de fluxos de marketing antigos.
- `src/pages/RelatorioAuditoriaBotoes.tsx`: Ferramenta interna de dev esquecida.
- `src/pages/casa-maquinas/SectionPlaceholder.tsx`: Arquivo de mockup.

---

## 4. Identificação de Duplicações Críticas

### 4.1 Sessão / Atendimento
- **`session-room` (Legado)**: `/session-room`, `/session-room/:caseId`. Usa componentes em `src/pages/SessionRoom...`.
- **`casa-das-maquinas/cabine` (Novo)**: `/casa-das-maquinas/cabine`. Usa `CabineTerapeutaPage.tsx`.
- **`ModoSessaoPage`**: `/casa-das-maquinas/nova-sessao`.
- **`ModoSessaoImersivo`**: `/casa-das-maquinas/sessao/:clienteId`.
- *Risco*: Confusão de fluxos e fragmentação de logs de atendimento.

### 4.2 Labirinto e Jornada
- **`LabirintoHome`**: `/labirinto`.
- **`LabirintoHeroinaPage`**: `/labirinto-heroina`.
- **`PortalJunguiano`**: `/portal-junguiano`.
- *Conclusão*: Três implementações diferentes para a mesma jornada simbólica de portas e distritos.

### 4.3 Big5 e Cartografia
- **Variantes**: `Big5` (Salas), `Big5Simbolico`, `Big5Funcional`, `Big5Oracular`.
- **Consolidação**: A `CartografiaPsiquicaPage` tenta unificar, mas as rotas individuais ainda existem e são acessíveis.

---

## 5. Auditoria de Permissões e Segurança

### 5.1 Inconsistências na Hierarquia
A matriz em `portal.ts` define: `visitante < aluna < oracula < assinante < admin`.
- **Erro Detectado**: Rotas sensíveis de clientes em `/casa-das-maquinas/clientes/:clienteId/jornada-alma` estão marcadas como `minPortal="aluna_formacao"` (nível 2), permitindo que alunas vejam dados profundos de clientes antes de serem certificadas como `oracula` (nível 3).
- **Risco de RLS**: Algumas páginas de ferramentas (ex: `BussolaOniricaPage`) dependem de parâmetros de URL (`clienteId`) sem validar via query se a usuária logada é a terapeuta responsável por aquele cliente.

### 5.2 Segurança de Dados
- **Vulnerabilidade**: Uso de `:clienteId` e `:sessionId` em rotas sem verificação de vínculo no frontend (dependência total do RLS). Se o RLS falhar ou estiver mal configurado, uma usuária `oracula` poderia acessar dados de clientes de outras terapeutas via URL.

---

## 6. Plano de Limpeza em 3 Fases

### Fase 1: Travar Riscos (Imediato)
1. Corrigir permissões de rotas `/casa-das-maquinas/clientes/*` para `minPortal="oracula"`.
2. Implementar `verifyTherapistOwnership` em hooks de leitura de cliente.
3. Desativar rotas `/saas/*` e redirecionar permanentemente para `/casa-das-maquinas/*`.

### Fase 2: Organizar Navegação (Médio Prazo)
1. Unificar menus em `Navigation.tsx`.
2. Remover duplicidade de links no dropdown de perfil.
3. Criar hub de Quizzes e Audioteca no Dashboard Aluna.

### Fase 3: Consolidação Arquitetural (Longo Prazo)
1. Deletar pasta `src/pages/SessionRoom...` e migrar lógica para `src/pages/casa-maquinas/`.
2. Consolidar `Labirinto` em uma única experiência (Labirinto Heroína).
3. Transformar `Big5` e outras salas em módulos da `Cartografia Psíquica`.

---
*Relatório gerado em 17/05/2026 por Lovable AI.*
