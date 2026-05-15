# SPRINT_10_CASA_DAS_MAQUINAS_SALA_DE_SESSAO_PLAN.md

## 1. Mapeamento da Estrutura Atual (Auditoria)

### Rotas e Páginas
A estrutura de rotas está centralizada em `src/routes/casaMaquinasRoutes.tsx`.
- **Dashboard Principal**: `/casa-das-maquinas` (`CasaDasMaquinas.tsx`)
- **Gestão de Clientes**: 
  - Lista: `/casa-das-maquinas/clientes` (`ClientesPage.tsx`)
  - Detalhe: `/casa-das-maquinas/clientes/:clienteId` (`ClienteDetailPage.tsx`)
- **Sala de Sessão**:
  - Lista de Sessões: `/casa-das-maquinas/sessoes` (`SessoesPage.tsx`)
  - Modo Condução (Stepper): `/casa-das-maquinas/nova-sessao` (`ModoSessaoPage.tsx`)
  - Cabine Imersiva: `/casa-das-maquinas/cabine` (`CabineTerapeutaPage.tsx`)
- **Conhecimento e Ferramentas**:
  - Biblioteca de Intervenções: `/casa-das-maquinas/biblioteca` (`BibliotecaIntervPage.tsx`)
  - 7 Vozes: `/casa-das-maquinas/7-vozes` (`VozesHomePage.tsx`)
- **Inteligência Clínica**:
  - Painel de Dados: `/casa-das-maquinas/painel-clinico` (`PainelClinicoPage.tsx`)

### Estrutura de Banco de Dados (Tabelas Identificadas)
- `clientes`: Cadastro principal, objetivos e observações seguras.
- `sessoes_casa_maquinas` / `sessions`: Registro de atendimentos (identificada possível duplicidade ou uso paralelo).
- `journeys` / `journey_districts`: Rastreamento do progresso simbólico da cliente na Cidadela.
- `client_city_state`: Estado atual (distrito/arquétipo) da cliente.
- `interventions`: Banco de dados da biblioteca de intervenções.
- `gestos_integracao`: Ações práticas pós-sessão.

### Componentes Core
- `CasaMaquinasLayout`: Layout padrão com sidebar profissional.
- `DashboardQuickActions`: Atalhos para nova cliente/sessão.
- `SessionModeSelector`: Escolha entre modos de condução (Orácula vs. Livre).
- `GpsSuggestionCard`: IA que sugere distritos e ferramentas.

---

## 2. Diagnóstico Técnico

### O que já está funcional
- CRUD de clientes com envio de convite por e-mail.
- Dashboard com estatísticas e alertas clínicos.
- Biblioteca de intervenções com busca e filtros por Voz/Distrito/Arquétipo.
- Registro de sessões com integração ao "Mapa Vivo".

### Oportunidades de Melhoria (Gaps)
- **Duplicidade de Tabelas**: `sessions` e `sessoes_casa_maquinas` parecem coexistir com propósitos similares. Necessário padronizar o consumo na UI.
- **Imersão na Sala de Sessão**: O `ModoSessaoPage` é funcional (stepper), mas a UI pode ser mais "limpa" para focar na condução.
- **Vínculo Jardim da Heroína**: O link entre a sessão profissional e o progresso no Jardim (lado da cliente) está via trigger, mas a visualização para a facilitadora é limitada.
- **Painel Editorial**: Atualmente focado em áudios, precisa de uma "ponte" clara para intervenções clínicas personalizadas.

---

## 3. Proposta de Arquitetura Visual (Sprint 10)

### [A] Dashboard Profissional (Upgrade)
- Refinar o `CasaDasMaquinas.tsx` para incluir um "Fechamento de Ciclo" visual.
- Widget de "Próximas Sessões" integrado ao calendário (UI apenas).

### [B] Sala de Sessão Imersiva
- Evoluir o `ModoSessaoImersivo.tsx` para ser o hub central durante o atendimento.
- Integrar notas rápidas que não poluem a tela de condução.

### [C] Jornada da Cliente (Visão Facilitadora)
- Criar uma "Linha do Tempo Simbólica" que une Sessões + Mapas Vivos + Gestos de Integração.

### [D] Biblioteca de Intervenções
- Adicionar funcionalidade de "Criar Intervencão Própria" (Apenas UI/State por enquanto, salvando localmente ou via tabela existente se houver).

---

## 4. Classificação

**PRONTO PARA IMPLEMENTAÇÃO VISUAL**

A estrutura de banco e rotas é robusta o suficiente para permitir o refinamento da experiência do usuário sem alterações estruturais no backend.

---
*Gerado em: 15/05/2026*
