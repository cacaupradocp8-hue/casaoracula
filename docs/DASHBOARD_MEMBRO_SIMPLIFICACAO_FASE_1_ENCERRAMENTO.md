# Encerramento da Fase 1 de Simplificação do Dashboard Membro

## 1. Status final

**Status**: `DASHBOARD_MEMBRO_SIMPLIFICATION_PHASE_1_CLOSED`

A Fase 1 da simplificação do Dashboard Membro foi concluída com sucesso técnico e estratégico, garantindo a harmonia entre o painel operacional e a nova Cidadela.

## 2. Objetivo da Fase 1

O objetivo central desta fase foi reduzir o conflito informacional e técnico entre o Dashboard e a Cidadela. O Dashboard foi refinado para atuar como o **"Painel do Agora"**, enquanto a Cidadela assumiu oficialmente o papel de **fonte de verdade do percurso simbólico** da habitante.

## 3. O que foi alterado

O componente `src/components/dashboard/ProximoPasso.tsx` foi simplificado:
- **Antes**: Utilizava o hook `useSintheyaNextStep`, chamava a Edge Function da Syntheia, possuía fallback local interpretativo e exibia selos de IA.
- **Depois**: Transformado em um **CTA direto para a `/cidadela`**. Não chama mais IA, não realiza cálculos próprios de percurso e utiliza linguagem estritamente pedagógica.

## 4. O que foi preservado

Permanecem intactos e operacionais:
- Rotas principais: `/dashboard-membro`, `/cidadela`, `/minha-jornada`, `/cidadela/revelacao`.
- Infraestrutura de IA: Syntheia global, hook `useSintheyaNextStep` e edge function `sintheya-next-step` (preservados para outros contextos).
- Base de dados: Supabase, RLS, schema e migrations não sofreram alterações.
- Componentes estratégicos: `MiniMapaCidadela` e `BussolaAtual`.

## 5. MiniMapaCidadela

**Decisão**: `MINIMAPA_CIDADELA_APPROVED`
O MiniMapa permanece no Dashboard como uma **âncora visual do agora**. Ele serve como atalho rápido para a identidade simbólica da habitante, oferecendo acesso imediato tanto à visão geral (`/cidadela`) quanto ao mapa ampliado (`/cidadela/revelacao`).

## 6. Syntheia

- A Syntheia foi **desacoplada** do núcleo do percurso no Dashboard para evitar orientações divergentes.
- Qualquer retorno futuro da IA à jornada pessoal exigirá uma nova auditoria ética e técnica.
- Mantém-se o guardrail: IA não gera diagnósticos, prontuários ou recomendações terapêuticas.

## 7. Papel final após Fase 1

| Área | Papel após Fase 1 |
| :--- | :--- |
| **Dashboard Membro** | Painel do Agora, atalhos operacionais e continuidade. |
| **Cidadela** | Fonte única de verdade do percurso simbólico e pedagógico. |
| **Minha Jornada** | Legado funcional temporário para estágios de conta e acesso. |
| **MiniMapaCidadela** | Atalho visual estratégico e âncora de identidade. |
| **Syntheia** | Desacoplada do Próximo Passo operacional do Dashboard. |

## 8. Guardrails preservados

A Fase 1 respeitou rigorosamente:
- Isolamento de dados de clientes e domínios profissionais (Casa das Máquinas).
- Ausência de linguagem clínica, diagnósticos ou scores psicológicos.
- Integridade técnica do banco de dados e políticas de segurança (RLS).

## 9. Validação técnica final

- `npx tsc --noEmit`: Sucesso.
- Build de produção: Sucesso.
- Rotas e navegação: Testadas e operacionais.

## 10. Pendências opcionais futuras (Melhorias)

- Revisar semântica e termos de `BussolaAtual` e `JornadaRecomendada`.
- Mover o bloco "Sua Voz" (resumo arquetípico) para a Cidadela.
- Simplificação visual geral do Dashboard para reduzir a carga cognitiva.

## 11. O que NÃO fazer sem novo ciclo

- Redirecionar `/dashboard-membro` ou `/minha-jornada`.
- Reativar IA no fluxo de percurso pessoal sem auditoria.
- Misturar contextos da Casa das Máquinas ou Jardim da Heroína no Dashboard da habitante.

## 12. Decisão final

`DASHBOARD_MEMBRO_SIMPLIFICATION_PHASE_1_CLOSED`

O ambiente está estável, documentado e liberado para o planejamento de novos ciclos estruturais ou expansões da Cidadela.
