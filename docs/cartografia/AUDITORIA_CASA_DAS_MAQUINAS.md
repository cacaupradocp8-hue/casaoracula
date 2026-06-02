# AUDITORIA DA CASA DAS MÁQUINAS — ETAPA F

Este documento detalha o estado atual da **Casa das Máquinas** e sua prontidão para receber a **CidadELA da Cliente** e a **Camada de Condução Clínica**.

## 1. LOCALIZAÇÃO E DOCUMENTAÇÃO

### 1.1 Onde clientes são cadastradas
- **Página**: `src/pages/casa-maquinas/ClientesPage.tsx`.
- **Fluxo**: Botão "Nova Cliente" que abre um diálogo para capturar nome, email, objetivo terapêutico e dados demográficos.

### 1.2 Onde ficam os dados da cliente
- **Tabela**: `public.clientes`.
- **Campos Principais**: 
    - `nome`, `email`, `objetivo_terapeutico`, `observacao_segura`.
    - `archetypal_profile_json`: Armazena o perfil estruturado (Big Five/Eneagrama).
    - `cartografia_sessao`: Armazena o estado atual do mapa.

### 1.3 Onde existe painel individual da cliente
- **Página**: `src/pages/casa-maquinas/ClienteDetailPage.tsx`.
- **Estrutura**: Abas de Visão Geral, Cidadela, Histórico, Ferramentas e Perfil.

### 1.4 Onde existem sessões, anotações ou registros
- **Tabelas**: 
    - `sessoes_casa_maquinas`: Metadados da sessão (data, movimento percebido).
    - `co_session_notes`: Notas textuais da terapeuta.
    - `jardim_heroina_registros`: Registros simbólicos da travessia.

### 1.5 Onde há histórico longitudinal
- **Tabelas**: `client_live_map_entries` (Mapa Vivo) e `client_live_map_state`.
- **Componentes**: `ClienteJourneyTimeline` e `ClienteHistorico`.

### 1.6 Onde a terapeuta visualiza informações da cliente
- **Principal**: `ClienteDetailPage.tsx`.
- **Cabine (Sessão)**: `CartografiaClinicaPanel.tsx` e `MapaVivoDirecaoClinica.tsx`.

### 1.7 Quais tabelas armazenam dados de cliente
- `public.clientes` (Base)
- `public.cartografia_psiquica` (Snapshots simbólicos)
- `public.client_live_map_entries` (Eventos do Mapa Vivo)
- `public.big5_registros` / `eneagrama_registros` (Perfil Estrutural)

### 1.8 Quais componentes renderizam visão da cliente
- `CidadelaMap.tsx` (Geografia simbólica)
- `MapaVivoCidadela.tsx` (Estado dinâmico)
- `MiniMandalaCidadela.tsx` (Resumo visual)
- `PerfilSimbolicoCliente.tsx` (Leitura arquetípica)

---

## 2. VERIFICAÇÃO DE SUPORTE ATUAL

| Item | Status | Observação |
| :--- | :--- | :--- |
| Mapa da Cliente | ✅ Existente | `MapaVivoCidadela` já renderiza a CidadELA da cliente. |
| Cartografia da Cliente | ✅ Existente | `CartografiaPsiquicaOracula` já gera leituras para clientes. |
| Leitura de Condução | ⚠️ Parcial | Existe em `CartografiaClinicaPanel`, mas precisa de unificação. |
| Perguntas Narrativas | ❌ Ausente | Ainda não integradas no contrato de condução. |
| Cuidados Éticos | ✅ Existente | Avisos presentes em `ClientePerfil` e `CartografiaClinicaPanel`. |
| Ferramentas Sugeridas | ⚠️ Parcial | Listadas em abas, mas sem recomendação dinâmica baseada no mapa. |
| Rota Sugerida | ❌ Ausente | Sugestão de "Próximo Passo" é textual e rudimentar. |
| Histórico de Mudanças | ✅ Existente | Mapa Vivo rastreia mudanças de estado. |
| Estado Atual | ✅ Existente | `client_live_map_state` armazena o estado consolidado. |

---

## 3. IDENTIFICAÇÃO DE ATIVOS E LACUNAS

### 3.1 Componentes Reaproveitáveis
- `CartografiaClinicaPanel`: Base para a futura Camada de Condução.
- `MiniMandalaCidadela`: Excelente para resumos rápidos no painel.
- `MapaVivoDirecaoClinica`: Motor de tradução de estado em ação.

### 3.2 Tabelas Reaproveitáveis
- `client_live_map_entries`: Pode receber novos tipos de eventos de "Condução".
- `cartografia_psiquica`: Já preparada para snapshots de cliente.

### 3.3 Lacunas Técnicas
- **Unificação de Motores**: O motor que calcula o Big Five (`useBig5Oracular`) e o que deriva a CidadELA (`derivacaoCidadela`) precisam falar a mesma língua que o Mapa Vivo de forma nativa.
- **Trigger de Condução**: Falta um serviço que "reage" à mudança no Mapa Vivo e gera as perguntas narrativas.

### 3.4 Lacunas de UI
- A "Condução Clínica" está escondida dentro de abas de ferramentas. Deveria ser o "Copiloto" visível durante a sessão.

### 3.5 Riscos
- **Privacidade**: O uso de `client_user_id` vincula dados ao usuário, mas as anotações clínicas em `co_session_notes` não devem vazar para a visão da cliente (se existir no futuro).
- **Linguagem**: Risco de usar termos como "diagnóstico" ou "transtorno". A auditoria confirma que o código atual prioriza "território", "clima" e "tensão".

---

## 4. RELAÇÃO COM A ARQUITETURA APROVADA

A estrutura atual permite o encaixe perfeito da Etapa E:
1. **Cliente** -> `clientes` table.
2. **Cartografia Psíquica** -> `cartografia_psiquica` (Snapshot).
3. **CidadELA da Cliente** -> `MapaVivoCidadela` (Visualização).
4. **Camada de Condução** -> Evolução do `CartografiaClinicaPanel` consumindo o `Mapa Vivo`.
5. **Painel da Terapeuta** -> `ClienteDetailPage.tsx` consolidado.

**Classificação: CARTOGRAFIA_CLINICA_AUDITADA**
