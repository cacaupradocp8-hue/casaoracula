# Encerramento do Ciclo Cidadela V0.3

## 1. Status final

**Status**: `CIDADELA_V0_3_CLOSED`

A Cidadela V0.3 foi concluída com sucesso como o centro pessoal, simbólico e read-only da habitante dentro da Casa Orácula.

## 2. Objetivo do ciclo

O objetivo deste ciclo foi criar a primeira camada funcional da Cidadela pessoal da habitante, consolidando dados pedagógicos e simbólicos em uma interface única e agregadora, garantindo o isolamento total de contextos clínicos, profissionais ou coletivos.

## 3. Domínio aprovado

A implementação pertence exclusivamente ao domínio:
- `CIDADELA_PESSOAL_ALUNA`

**Exclusões explícitas deste ciclo**:
- Cidadela da cliente (domínio terapêutico);
- Cidadela da terapeuta (domínio profissional);
- Mapa coletivo de clientes (Atlas Coletivo);
- Jardim da Heroína;
- Casa das Máquinas;
- IA Syntheia;
- Dados clínicos, prontuários, diagnósticos ou scores psicológicos.

## 4. Documentos criados ou atualizados

- `docs/CIDADELA_V0_3_PLANO_IMPLEMENTACAO.md`: Plano diretor da etapa.
- `docs/CIDADELA_V0_3_DOMINIOS_E_MAPAS.md`: Definição de isolamento de contextos.
- `docs/CICLO_CIDADELA_V0_3_ENCERRAMENTO.md`: Este documento de fechamento formal.

## 5. Ficheiros criados

- `src/hooks/useCidadelaOverview.ts`: Hook agregador principal.
- `src/hooks/useTrainingOverview.ts`: Hook agregador de métricas da Sala de Treinamento.
- `src/types/cidadelaOverview.ts`: Definições de tipos para a visão geral.
- `src/pages/CidadelaPage.tsx`: Interface informativa da Cidadela.

## 6. Ficheiros alterados

- `src/services/trainingService.ts`: Adição de leitura global de progresso (`listAllProgress`).
- `src/routes/jornadaRoutes.tsx`: Registro da rota protegida `/cidadela`.
- `src/components/layout/Navigation.tsx`: Integração no menu de Aluna/Assinante.
- `src/components/bussola-home/MiniMapaCidadela.tsx`: Adição de atalho para "Visão Geral".

## 7. Rota criada

- **Rota**: `/cidadela`
- **Características**: Protegida (autenticação exigida), read-only, sem mutations, sem acesso direto ao Supabase (via hook).

## 8. Blocos da página

A `CidadelaPage` exibe de forma consolidada:
- **Estado Atual**: Posição simbólica na jornada.
- **Travessias Recentes**: Histórico de marcos acesos.
- **Rotas da Casa**: Progresso nas estações do Clube.
- **Sala de Treinamento**: Módulos e exercícios concluídos.
- **Formação Orácula**: Cursos e aulas em andamento.
- **Próximo Passo**: Sugestão determinística de percurso.

## 9. Hook agregador: useCidadelaOverview

Papel: Camada de composição que reúne dados de:
- `useJornadaHabitante`
- `useCidadelaEstado`
- `useTodasRotas`
- `useTrainingOverview`
- `useFormationProgress`

**Guardrail**: Zero acesso a `Atlas`, `IA` ou dados de terceiros.

## 10. Sala de Treinamento

- Implementação do `useTrainingOverview` para leitura global.
- `trainingService.ts` atualizado apenas com `SELECT`.
- **Integridade**: Sem migrations, sem alteração de RLS, sem alteração funcional na V0.2 existente.

## 11. Navegação

- Link "Cidadela" inserido após "Dashboard" no menu principal.
- Visível apenas para perfis: **Aluna** e **Assinante**.
- Atalho "Visão Geral" adicionado ao mini-mapa do dashboard.

## 12. Rotas preservadas

Permanecem intactas e operacionais:
- `/dashboard-membro`
- `/minha-jornada`
- `/cidadela/revelacao`
- `/clube`
- `/sala-de-treinamento`
- `/cursos`

## 13. Segurança e guardrails

- **Read-only**: Nenhuma alteração de estado é feita via Cidadela.
- **Simbólico**: Linguagem estritamente pedagógica e de jornada.
- **Isolamento**: Ausência total de termos clínicos, diagnósticos ou recomendações terapêuticas.

## 14. Validação técnica final

- `npx tsc --noEmit`: Sucesso.
- `npm run build`: Sucesso.
- Ambiente estável, sem vazamento de domínios ou quebras de RLS.

## 15. Pendências opcionais futuras (Melhorias)

- Ajustar label "Visão Geral" para "Abrir Cidadela".
- Substituir termo técnico "Domínio" por "Área" na interface.
- Enriquecimento visual e simbólico na V0.4.
- Planejamento de transição de `/minha-jornada`.

## 16. O que NÃO fazer automaticamente (Sem novo ciclo)

- Redirecionar fluxos de jornada legados.
- Conectar contextos de clientes (Jardim/Máquinas).
- Ativar IA ou Atlas Coletivo na Cidadela pessoal.

## 17. Decisão final

`CIDADELA_V0_3_CLOSED`

O ciclo está oficialmente encerrado. O ambiente está estável e liberado para a definição do próximo ciclo estrutural da Casa Orácula.
