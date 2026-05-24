# Encerramento de Ciclo: Rotas da Casa V0.2

Este documento registra formalmente a conclusão e o congelamento das implementações referentes ao ciclo **Rotas da Casa V0.2**.

## 1. Estado final

As Rotas da Casa V0.2 estão encerradas, documentadas e congeladas como camada persistente de jornada simbólica, leitura, travessia e obras regentes da Casa Orácula 2.0.

## 2. Escopo concluído

- Preservação das rotas técnicas `/clube`;
- Preservação das tabelas técnicas `clube_*`;
- Alinhamento textual visual para “Rotas da Casa”;
- Progresso por item de rota (granularidade por atividade);
- Cálculo de conclusão de estação baseado em itens obrigatórios;
- Ponte idempotente com a Cidadela através do DAL;
- Registro automático de travessias no `historico_travessias` do estado unificado;
- Idempotência garantida pela chave `contexto`;
- Ausência total de integração com Atlas ou IA neste ciclo;
- Isolamento de dados clínicos e de clientes;
- Documentação técnica consolidada em `docs/ROTAS_DA_CASA_V0_2.md`.

## 3. Componentes fechados

| Área | Ficheiro ou Tabela | Estado | Observação |
| :--- | :--- | :--- | :--- |
| Database | `clube_estacoes` | Congelado | Estrutura de metadados das estações. |
| Database | `clube_rota_itens` | Congelado | Definição granular da estrada. |
| Database | `clube_rota_progresso` | Congelado | Rastreio de status da usuária. |
| Database | `clube_jornadas` | Legado | Mantida para compatibilidade V0.1. |
| Database | `user_cidadela_estado` | Integrado | Recebe os disparos das Rotas via DAL. |
| Frontend (Hook) | `useTodasRotas` | Congelado | Catálogo e lógica de Lock Progressivo. |
| Frontend (Hook) | `useRotaOracular` | Congelado | Cérebro da estrada e gatilho de conclusão. |
| DAL | `cidadelaEstado.ts` | Congelado | Ponte segura e idempotente com o mapa. |
| Documentação | `docs/ROTAS_DA_CASA_V0_2.md` | Congelado | Referência técnica completa. |

## 4. Guardrails congelados

Fica proibido, dentro do contexto da V0.2:
- Renomear tabelas `clube_*` ou rotas `/clube`;
- Alterar políticas de RLS ou criar migrations sem abertura de novo ciclo específico;
- Integrar IA, Syntheia ou Atlas Orácula diretamente nestes componentes;
- Manipular dados clínicos, de clientes ou gerar prontuários/relatórios;
- Misturar lógica de progresso das Rotas com a Sala de Treinamento;
- Alterar o núcleo da Cidadela sem nova auditoria técnica e ética.

## 5. Integração Cidadela-Rotas congelada

A integração oficial da V0.2 consiste em:
1. Conclusão de item de rota via `useRotaOracular`;
2. Verificação de 100% dos itens obrigatórios da estação;
3. Registro de travessia na Cidadela via `addTravessiaToHistorico`;
4. Uso da chave idempotente `contexto = rota_estacao_{estacaoId}`;
5. Travas de duplicação implementadas no DAL para evitar poluição do histórico.

## 6. Ficheiros principais do ciclo

- `src/hooks/useTodasRotas.ts`
- `src/hooks/useRotaOracular.ts`
- `src/lib/dal/cidadelaEstado.ts`
- `docs/ROTAS_DA_CASA_V0_2.md`
- `docs/CICLO_ROTAS_DA_CASA_V0_2_ENCERRAMENTO.md`

## 7. Estado de portabilidade

A implementação está preparada para uma eventual portabilidade fora do ecossistema Lovable, mantendo:
- Rotas técnicas e nomes de tabelas estáveis;
- Dependências baseadas em Supabase/Postgres padrão;
- Hooks React e DAL TypeScript limpos de lógica proprietária da plataforma;
- Documentação residente no repositório em formato Markdown.

## 8. Próximos ciclos possíveis

- Formação Orácula V0.2 (Eixo pedagógico);
- Auditoria e limpeza de código legado (V0.1);
- Documentação específica e exaustiva da Cidadela;
- Otimização de performance no cálculo de progresso (Views/RPCs);
- Testes automatizados de integração e idempotência.

## 9. Decisão final

`ROTAS_DA_CASA_V0_2_CLOSED`

---
*Documento de encerramento gerado em Maio/2026.*
