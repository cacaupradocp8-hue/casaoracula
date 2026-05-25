# Encerramento do Alinhamento Dashboard Membro + Cidadela

## 1. Status final

`DASHBOARD_MEMBRO_ALIGNMENT_CLOSED`

O Dashboard Membro foi alinhado à Cidadela com sucesso técnico, consolidando uma navegação coerente e semântica. O processo foi realizado de forma cirúrgica, sem alteração de banco de dados, rotas globais ou domínios sensíveis, garantindo a estabilidade e a integridade do sistema.

## 2. Objetivo do ciclo

O objetivo central deste ciclo foi reduzir conflitos de orientação e redundâncias entre o Dashboard Membro e a Cidadela. Foram removidas duplicações de lógica, reorientados os CTAs (Calls to Action) e consolidada a Cidadela como o centro simbólico e geográfico do percurso pessoal da habitante dentro da Casa Orácula.

## 3. Papel final das áreas

| Área | Papel final |
| :--- | :--- |
| Dashboard Membro | Painel do Agora, atalhos e continuidade diária |
| Cidadela | Centro simbólico do percurso da habitante |
| Minha Jornada | Legado funcional temporário de estágios |
| Quiz | Porta de entrada para leitura inicial |
| MiniMapaCidadela | Atalho visual do mapa |
| Bússola Atual | Sinal simbólico leve do momento |
| Sua Voz | Badge de identidade simbólica |
| Syntheia | Preservada fora do núcleo do percurso |

## 4. Blocos consolidados

### ProximoPasso
- Virou CTA principal para `/cidadela`.
- Não chama Syntheia.
- Não usa IA.
- Não calcula orientação própria (consome o estado da bússola).
- Reforça a Cidadela como fonte de verdade do percurso.

### MiniMapaCidadela
- Permanece no Dashboard como atalho visual.
- Aponta para `/cidadela`.
- Preserva acesso ao mapa ampliado em `/cidadela/revelacao`.
- Comportamento de apenas leitura (não altera dados).

### BussolaAtual
- Permanece como sinal simbólico leve.
- Usa linguagem puramente simbólica (Territórios, Tensões, Integração).
- Não gera diagnóstico ou terminologia clínica.
- Não chama IA para interpretação.

### AlertaOracular
- Usa terminologia como `AvisoDeTensao` ou equivalente.
- Isento de linguagem clínica ou alarmismo.
- Permanece como aviso simbólico de pontos de atenção no mapa.

### HomeOnboardingBlocks
- Continua como guia de entrada e boas-vindas.
- CTAs de percurso agora apontam para `/cidadela`.
- Blocos de Quiz, Rotas, Sala de Treinamento e Formação foram preservados.
- A rota `/minha-jornada` não foi removida, mantendo suporte ao legado.

### SuaVozResumo
- Permanece como badge de identidade simbólica.
- CTA principal alterado de `/quiz` para `/cidadela` (aprofundamento).
- O `/quiz` foi preservado para o fluxo de entrada inicial de novas habitantes.

### JornadaRecomendada
- Permanece operacional e segura.
- Não usa IA nem altera dados.
- Recomendação de revisão futura apenas em caso de sobreposição excessiva com a Cidadela.

## 5. Rotas preservadas

As seguintes rotas seguem operacionais e inalteradas em sua estrutura:
- `/dashboard-membro`
- `/cidadela`
- `/cidadela/revelacao`
- `/minha-jornada`
- `/quiz`
- `/clube`
- `/sala-de-treinamento`
- `/cursos`

## 6. Syntheia e IA

- Syntheia não foi removida do projeto, permanecendo disponível para outros contextos.
- Syntheia **não** conduz mais o Próximo Passo do Dashboard.
- Syntheia **não** alimenta os dados da Cidadela V0.3.
- Qualquer uso futuro de IA no percurso da habitante exige um novo ciclo de auditoria ética e técnica dedicado.
- A IA não deve ser usada para gerar diagnósticos, prontuários, scores psicológicos ou recomendações terapêuticas.

## 7. Guardrails preservados

O ciclo de alinhamento respeitou rigorosamente os seguintes limites:
- Não acessou dados de clientes.
- Não acessou a Casa das Máquinas.
- Não acessou o Jardim da Heroína.
- Não utilizou o Atlas.
- Não integrou IA no fluxo principal.
- Não chamou Syntheia para lógica de percurso.
- Não criou diagnósticos, prontuários, scores ou recomendações terapêuticas.
- Não alterou Supabase (Schema, RLS ou Migrations).

## 8. Validação técnica final

- `npx tsc --noEmit`: Sucesso (Zero erros).
- Build de produção: Sucesso.
- Sem imports quebrados ou regressões em `/dashboard-membro` e `/cidadela`.

## 9. Pendências opcionais futuras (Roadmap)

- Avaliar simplificação visual geral do Dashboard para maior leveza.
- Revisar `JornadaRecomendada` em ciclo próprio para evitar redundância.
- Revisar o papel futuro e a eventual descontinuação de `/minha-jornada`.
- Avaliar evolução visual para Cidadela V0.4.
- Auditar Syntheia em ciclo ético e técnico próprio para novas funcionalidades.
- Decidir a futura relação entre Dashboard, Cidadela e o Jardim da Heroína.
- Documentar padrões de linguagem simbólica para novos componentes e comunicações.

## 10. O que não fazer automaticamente (Restrições)

Sem um novo ciclo de decisão e auditoria, não se deve:
- Substituir a rota `/dashboard-membro` por `/cidadela`.
- Redirecionar forçadamente a rota `/minha-jornada`.
- Remover o acesso ao `/quiz`.
- Remover Syntheia do código global.
- Conectar a Casa das Máquinas ao Dashboard da habitante.
- Conectar o Jardim da Heroína ou o Atlas sem autorização.
- Integrar IA em fluxos de percurso ou criar mapas coletivos/de clientes.

## 11. Decisão final

`DASHBOARD_MEMBRO_ALIGNMENT_CLOSED`

O ambiente está consolidado, estável e pronto para a escolha do próximo ciclo estrutural.
