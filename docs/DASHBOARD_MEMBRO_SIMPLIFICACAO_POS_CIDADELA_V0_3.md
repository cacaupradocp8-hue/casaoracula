# Plano de Simplificação do Dashboard Membro após Cidadela V0.3

## 1. Status

**Status**: `DASHBOARD_MEMBRO_SIMPLIFICATION_PLANNED`

Este documento registra o planejamento estratégico para a simplificação futura do `/dashboard-membro`, visando reduzir a densidade informacional e delegar a profundidade do percurso à nova `/cidadela`. Não há alterações de código neste ciclo.

## 2. Papel atual do Dashboard Membro

O Dashboard atua hoje como a porta de entrada principal da habitante, acumulando múltiplas funções:
- Central narrativa e leitura simbólica do momento;
- Área de atalhos operacionais;
- Exibição de progresso fragmentado;
- Onboarding de novos membros;
- Sugestão de próximos passos via IA (Syntheia).

## 3. Papel recomendado para o Dashboard

O Dashboard deve evoluir para ser o **"Painel do Agora"**:
- Foco em atalhos rápidos e ações imediatas do dia;
- Ponto de retorno para continuar atividades em andamento;
- Espaço para alertas e convites pontuais da Casa;
- Interface leve que não tenta explicar todo o percurso, mas sim facilitar o acesso.

## 4. Papel da Cidadela

A `/cidadela` assume o papel de **"Centro de Percurso"**:
- Visão agregada de marcos, travessias e progresso pedagógico;
- Mapa simbólico pessoal completo;
- Próximo passo determinístico baseado em regras de percurso;
- Domínio estritamente pessoal e read-only (`CIDADELA_PESSOAL_ALUNA`).

## 5. Papel da Minha Jornada

A `/minha-jornada` permanece como **"Legado de Estágios"**:
- Mapa linear de conta e acessos;
- Rota preservada para garantir links internos;
- Sem alterações ou fusão imediata para preservar isolamento de domínios profissionais.

## 6. Componentes auditados e Classificação

| Componente | Função Atual | Risco | Recomendação Futura | Classificação |
| :--- | :--- | :--- | :--- | :--- |
| `BussolaAtual` | Leitura simbólica/narrativa | Mistura terminológica | Revisar p/ evitar "clínico" | `KEEP_ON_DASHBOARD` |
| `ProximoPasso` | Sugestão via Syntheia (IA) | Conflito com Cidadela | Unificar lógica determinística | `NEEDS_IA_DECISION` |
| `MiniMapaCidadela` | Mapa SVG dos distritos | Duplicação de visual | Manter como atalho visual | `KEEP_ON_DASHBOARD` |
| `JornadaRecomendada`| Sugestão de leitura | Baixo | Simplificar para CTA direto | `SIMPLIFY_TO_CTA` |
| `SuaVozResumo` | Perfil arquetípico | Sobreposição | Mover p/ percurso (Cidadela) | `MOVE_TO_CIDADELA_LATER` |
| `HomeOnboardingBlocks`| Guia de primeiros passos | Redundância | Substituir links p/ Cidadela | `MOVE_TO_CIDADELA_LATER` |
| `AlertaOracular` | Avisos de tensão | Baixo | Manter como canal operacional | `KEEP_ON_DASHBOARD` |

## 7. Próximo Passo e Conflito de Lógica

Identificou-se um conflito potencial:
- **Dashboard**: Usa ou pode usar Syntheia (IA) para inferir o próximo passo.
- **Cidadela**: Usa regras determinísticas pedagógicas via `useCidadelaOverview`.

**Recomendação**: Preferir a lógica determinística para o núcleo da jornada pessoal. O uso de IA deve ser explícito, opcional e focado em apoio operacional, nunca substituindo o mapa de percurso aprovado.

## 8. Syntheia e IA no Dashboard

- Nenhuma ampliação de uso da Syntheia neste ciclo;
- Syntheia não deve alimentar a Cidadela V0.3;
- Proibida geração de recomendações clínicas ou diagnósticos por IA;
- Qualquer nova integração exige auditoria ética e técnica própria.

## 9. Estratégia de simplificação futura (Fases)

1.  **Fase 1**: Ajuste semântico no Dashboard para remover qualquer vestígio de linguagem clínica ou diagnóstica.
2.  **Fase 2**: Unificação da lógica de "Próximo Passo", decidindo se o Dashboard consome o resumo gerado pelo hook da Cidadela.
3.  **Fase 3**: Rebaixamento de blocos densos (como resumos arquetípicos) para CTAs que apontem para a Cidadela.
4.  **Fase 4**: Ciclo exclusivo para revisão da Syntheia sob perspectiva ética e de posicionamento.

## 10. O que NÃO fazer agora (Guardrails)

- Não remover componentes ou funcionalidades do Dashboard;
- Não redirecionar rotas principais;
- Não mexer na Casa das Máquinas ou Jardim da Heroína;
- Não tentar fundir o Dashboard com a Cidadela.

## 11. Riscos Identificados

- Dashboard excessivamente denso dificultando a navegação;
- Inconsistência entre sugestões de IA e regras de percurso;
- Confusão da usuária sobre qual página é sua referência principal de progresso.

## 12. Decisão final

`DASHBOARD_MEMBRO_SIMPLIFICATION_PLANNED`

O Dashboard deve evoluir para ser o suporte operacional diário, enquanto a Cidadela brilha como o espelho simbólico da jornada da habitante.
