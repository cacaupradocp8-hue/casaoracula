# Auditoria de Integração Atlas + Ferramentas

## 1. Status

`ATLAS_TOOLS_INTEGRATION_AUDIT_DONE`

## 2. Resumo executivo

A integração futura das ferramentas da Casa Orácula ao Atlas Orácula é **altamente recomendada**, mas deve seguir uma transição de "Catálogo de Ferramentas" para "Camadas de Jornada". O Atlas deixará de ser um menu de opções para se tornar um sistema de perguntas estratégicas que orientam a profissional sobre qual ferramenta utilizar em cada estágio do percurso da cliente. A integração deve priorizar a segurança ética e a linguagem simbólica, evitando qualquer viés clínico/patologizante.

## 3. Mapa das ferramentas atuais

| Nome Atual | Origem | Rota Atual | Domínio | Status Sugerido |
| :--- | :--- | :--- | :--- | :--- |
| Big Five (Simbólico) | Banco | `/ferramenta/big5-simbolico` | Habitante | `MERGE` |
| Cartografia da Torre | Banco | `/ferramentas/cartografia-torre` | Habitante | `REDESIGN` |
| Labirinto da Heroína | Banco | `/labirinto-heroina` | Habitante | `MERGE` |
| Inventário de Personas | Hardcoded | `/casa-das-maquinas/ferramentas/inventario-personas` | Profissional | `RENAME_LATER` |
| Mapeamento de Complexos | Hardcoded | `/casa-das-maquinas/ferramentas/mapeamento-complexos` | Profissional | `NEEDS_ETHICAL_REVIEW` |
| Mapa da Sombra | Hardcoded | `/casa-das-maquinas/ferramentas/mapa-sombra` | Profissional | `MERGE` |
| Diagnóstico de Ego | Hardcoded | `/casa-das-maquinas/ferramentas/diagnostico-ego` | Profissional | `RENAME_LATER` |
| Sonho Estruturado | Hardcoded | `/casa-das-maquinas/ferramentas/sonho-estruturado` | Profissional | `KEEP` |
| Imaginação Ativa | Hardcoded | `/casa-das-maquinas/ferramentas/imaginacao-ativa` | Profissional | `KEEP` |
| Escrita Não Censurada | Hardcoded | `/casa-das-maquinas/ferramentas/escrita-nao-censurada` | Profissional | `KEEP` |
| Corpo Inconsciente | Hardcoded | `/casa-das-maquinas/ferramentas/corpo-inconsciente` | Profissional | `RENAME_LATER` |
| Biblioteca de Interv. | Rota/CMPT | `/casa-das-maquinas/biblioteca` | Profissional | `KEEP` |
| Mapa Vivo | Banco/CMPT | `/casa-das-maquinas/clientes/:id/mapa-vivo` | Profissional | `KEEP` (Auditoria Própria) |
| Cidadela | Banco/CMPT | `/casa-das-maquinas/clientes/:id/mapa-cidadela` | Profissional | `KEEP` |
| Syntheia | Banco | `/ferramentas/sintheia` | Híbrido | `KEEP` (IA Inativa) |

## 4. Classificação por jornadas do Atlas

As ferramentas foram reagrupadas segundo a lógica de percurso do Atlas:

### 1. Entender o caso
- **Big Five Simbólico**: Camada de temperamento e base.
- **Cartografia Psíquica**: Visão panorâmica inicial.
- **Portas**: Identificação de resistências e aberturas.

### 2. Levantar hipóteses
- **Inventário de Personas (Mapa de Partes)**: Identificação de vozes ativas.
- **Diagnóstico de Ego (Funcionamento do Ego)**: Estrutura de sustentação.
- **Mapeamento de Complexos**: Núcleos de ativação emocional.

### 3. Observar cautela
- **Torre Viva**: Identificação de mecanismos de proteção.
- **Mapa da Sombra**: Conteúdos não integrados.
- **Sinais de Atenção**: Indicadores de risco e limite de atuação.

### 4. Definir direção
- **Labirinto**: Mapeamento de repetições e saídas.
- **Caminho da Mulher Inteira**: Fases da jornada da heroína.
- **Espelho de Consciência**: Ponto de virada na percepção.

### 5. Escolher intervenção
- **Biblioteca de Intervenções**: Práticas sugeridas.
- **Imaginação Ativa**: Diálogo com o inconsciente.
- **Sonho Estruturado**: Processamento onírico.
- **Corpo Inconsciente (Escuta Simbólica do Corpo)**: Somatização e presença.

### 6. Acompanhar evolução
- **Mapa Vivo**: Dinâmica de transformação.
- **Cidadela Viva**: Evolução dos distritos psíquicos.
- **Radar do Eixo Interno**: Monitoramento de alinhamento.

## 5. Ferramentas sensíveis

Ferramentas que exigem revisão ética e técnica antes de qualquer automação ou integração profunda:
- **Mapeamento de Complexos**: Alto potencial de desestabilização emocional.
- **Mapa da Sombra**: Exige contenção simbólica rigorosa.
- **Corpo Inconsciente**: Risco de atravessamento somático sem presença física.
- **Diagnóstico de Ego**: Risco de rotulagem determinista.

## 6. Renomeações recomendadas

| Nome Atual | Problema | Nome Seguro Sugerido |
| :--- | :--- | :--- |
| Diagnóstico de Ego | Tom clínico/patologizante | **Funcionamento do Ego** |
| Inventário de Personas | Linguagem de teste/RH | **Mapa de Partes** ou **Perfil de Escuta** |
| Oráculos Terapêuticos | Termo "Terapêutico" em uso aberto | **Oráculos de Formulação** |
| Corpo Inconsciente | Termo vago | **Escuta Simbólica do Corpo** |
| Laboratório Clínico | Termo "Clínico" excessivo | **Laboratório de Leitura de Caso** |

## 7. Riscos

- `DOMAIN_RISK`: Integração de ferramentas profissionais (Casa das Máquinas) na experiência de habitante.
- `ETHICAL_REVIEW_NEEDED`: Uso de ferramentas de sombra e complexos sem supervisão adequada.
- `NOT_SAFE_TO_INTEGRATE`: Automatização da leitura de riscos sem intervenção humana.
- `LOW_RISK`: Ferramentas de autoleitura como Big Five Simbólico e Oráculos.

## 8. Proposta de arquitetura futura

O Atlas deve funcionar como um **Middleware de Decisão**. Em vez de apresentar botões para as ferramentas, o sistema deve:
1. Receber inputs da profissional sobre a fase do caso.
2. Sugerir camadas de observação (ex: "A situação pede uma observação da Torre Viva").
3. Abrir a ferramenta como uma **Camada do Atlas**, mantendo o contexto do caso e salvando os dados diretamente na evolução da cliente, sem que a profissional precise "sair" da jornada para "usar" a ferramenta.

## 9. O que não fazer agora

- Não apagar nenhuma ferramenta legada ou hardcoded.
- Não mover arquivos entre `src/pages` e `src/pages/casa-maquinas` ainda.
- Não alterar rotas no `casaMaquinasRoutes.tsx`.
- Não criar novas tabelas no banco de dados.
- Não integrar Syntheia ou qualquer motor de IA.
- Não expor ferramentas da Casa das Máquinas para usuários sem o portal `oracula`.

## 10. Próxima etapa recomendada

"Etapa 187 — Refatoração Semântica das Ferramentas Hardcoded. Aplicar as renomeações seguras sugeridas nos títulos e metadados das ferramentas da Casa das Máquinas, garantindo conformidade com os guardrails éticos antes da integração técnica ao Atlas."

---

Documentação gerada com base na estrutura atual do sistema e diretrizes de segurança da Casa Orácula.
