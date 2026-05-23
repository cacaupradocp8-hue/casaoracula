# Atlas Orácula V0 - Documentação Técnica e Ética

## 1. Visão Geral
O Atlas Orácula é o eixo integrador da Casa das Máquinas, funcionando como um copiloto de formulação clínico-simbólica para suporte ao raciocínio profissional.

**Limites Éticos e Funcionais:**
- **Não diagnostica:** O sistema não emite laudos ou diagnósticos.
- **Não substitui profissionais:** É uma ferramenta de apoio à decisão, não um tomador de decisão.
- **Não prescreve:** Sugere caminhos baseados em modelos conceituais, sem obrigatoriedade.
- **Não gera prontuário oficial:** Nesta versão, os dados são voláteis e pedagógicos.
- **Não usa dados reais:** Versão focada em interface e fluxo (Mock).
- **Não usa IA:** Sem processamento automatizado de linguagem ou decisões algorítmicas nesta etapa.

## 2. Objetivo do Atlas v0
A versão v0 tem como propósito validar:
- A experiência de navegação e ergonomia da interface.
- A consistência da linguagem ética e não-patologizante.
- A estrutura lógica do raciocínio clínico-simbólico proposto.
- A sequência dos fluxos de trabalho.
- A utilidade pedagógica da Casa Orácula 2.0.

## 3. Rotas Existentes
Todas as rotas abaixo são protegidas e acessíveis apenas através da Casa das Máquinas:
- `/casa-das-maquinas/atlas`: Painel principal.
- `/casa-das-maquinas/atlas/entender-caso`: Fluxo de organização inicial.
- `/casa-das-maquinas/atlas/levantar-hipoteses`: Exploração de leituras possíveis.
- `/casa-das-maquinas/atlas/observar-cautela`: Apoio à prudência e supervisão.
- `/casa-das-maquinas/atlas/definir-direcao`: Escolha de eixo condutor.
- `/casa-das-maquinas/atlas/escolher-intervencao`: Conexão com práticas e recursos.
- `/casa-das-maquinas/atlas/acompanhar-evolucao`: Monitoramento de ajustes e respostas.
- `/casa-das-maquinas/atlas/demo`: Modo demonstrativo com caso fictício.

## 4. Arquitetura de Ficheiros
Ficheiros que compõem o ecossistema do Atlas Orácula:
- `src/pages/casa-maquinas/AtlasOracula.tsx`: Componente principal.
- `src/data/atlasModules.ts`: Definições conceituais dos módulos.
- `src/pages/casa-maquinas/atlas/EntenderCasoPage.tsx`: Interface do fluxo 1.
- `src/pages/casa-maquinas/atlas/LevantarHipotesesPage.tsx`: Interface do fluxo 2.
- `src/pages/casa-maquinas/atlas/ObservarCautelaPage.tsx`: Interface do fluxo 3.
- `src/pages/casa-maquinas/atlas/DefinirDirecaoPage.tsx`: Interface do fluxo 4.
- `src/pages/casa-maquinas/atlas/EscolherIntervencaoPage.tsx`: Interface do fluxo 5.
- `src/pages/casa-maquinas/atlas/AcompanharEvolucaoPage.tsx`: Interface do fluxo 6.
- `src/pages/casa-maquinas/atlas/CasoDemonstrativoPage.tsx`: Lógica do modo demo.
- `src/routes/casaMaquinasRoutes.tsx`: Configuração de roteamento.

## 5. Fluxos do Atlas
1. **Entender o Caso:** Organização da queixa, sinais clínicos e camadas contextuais.
2. **Levantar Hipóteses:** Exercício de brainstorming clínico sem conclusões fechadas.
3. **Observar Sinais de Cautela:** Foco em ética, riscos, contratransferência e necessidade de encaminhamento.
4. **Definir Direção:** Estabelecimento de um norte provisório para a condução do processo.
5. **Escolher Intervenção:** Seleção de recursos técnicos alinhados à direção escolhida.
6. **Acompanhar Evolução:** Registro de percepções sobre o movimento do caso e ajustes necessários.

## 6. Módulos Conceituais
Módulos estáticos integrados visualmente ao Atlas:
- Big Five | Cartografia Psíquica | R.O.T.A.I (Crenças) | Torre Viva | Labirinto | Complexos | Sonhos (Lab Onírico) | 7 Vozes | Portas | Mapa Vivo | Biblioteca de Intervenções.

## 7. Caso Demonstrativo (Marina)
Caso fictício criado para fins pedagógicos:
- **Status:** 100% fictício.
- **Objetivo:** Demonstrar o preenchimento e a transição entre os seis fluxos.
- **Dados:** Sem informações sensíveis ou reais.

## 8. Limites Técnicos da v0
A versão atual **não possui**:
- Persistência em base de dados (Supabase).
- Integração com IA (OpenAI/Syntheia).
- Geração de documentos (PDF/Relatórios).
- Acesso a dados de clientes ou sessões reais da plataforma.
- Modificações em ferramentas legadas/antigas.

## 9. Guardrails (Controle de Alterações)
**Requer aprovação explícita para:**
- Integração com dados reais de clientes/sessões.
- Criação de tabelas ou migrações de banco de dados.
- Ativação de chamadas de API para IA.
- Alterações em sistemas de autenticação ou permissões.
- Conexão funcional com a Biblioteca de Intervenções.

## 10. Próximas Etapas (Futuro)
- Testes de usabilidade em ambiente controlado.
- Revisão por comitê de ética profissional.
- Planejamento de arquitetura para persistência segura.
- Design da integração assistida por IA (Syntheia).
