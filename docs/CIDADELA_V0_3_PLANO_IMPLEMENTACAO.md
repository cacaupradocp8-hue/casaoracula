# Plano de Implementação da Cidadela V0.3

## 1. Status do planejamento
`CIDADELA_V0_3_PLANNED`

Esta etapa é exclusivamente documental e estratégica. Nenhuma alteração de código, rota, banco de dados ou lógica de permissões foi realizada nesta fase.

## 2. Visão estratégica
A Cidadela V0.3 funcionará como o centro pessoal simbólico da habitante dentro da Casa Orácula. Ela responde às perguntas fundamentais:
- Onde estou agora?
- O que já atravessei?
- O que está em andamento?
- Qual é meu próximo passo seguro?

Diferenciação de conceitos:
- **Cidadela**: Centro pessoal orientador (o coração da experiência da usuária).
- **Dashboard Membro**: Painel operacional denso (acesso rápido, dados de conta, suporte).
- **Minha Jornada**: Registro linear e simplista do progresso (legado).
- **Mapa Vivo / Revelação**: Subexperiência imersiva e simbólica da cartografia inicial.
- **Rotas da Casa / Sala de Treinamento / Formação**: Trilhas pedagógicas específicas.

## 3. Problema atual
Fragmentação da experiência. Os dados de progresso estão espalhados entre o `DashboardMembro`, a `MinhaJornada` e a página de `RevelacaoCidadelaPage`. A usuária não possui um ponto de convergência que traduza seu estado simbólico e pedagógico de forma unificada.

## 4. Papel final das rotas (Proposta V0.3)

| Rota | Papel atual | Papel proposto V0.3 | Ação recomendada |
| :--- | :--- | :--- | :--- |
| `/cidadela` | Ausente ou incompleta | Centro pessoal da habitante | Criar em etapa futura |
| `/minha-jornada` | Legado/simplista | Redirecionar ou virar seção interna | Decidir em etapa futura |
| `/dashboard-membro` | Dashboard operacional denso | Área operacional secundária | Decidir em etapa futura |
| `/cidadela/revelacao` | Mapa Vivo / Revelação | Manter como subexperiência | Não quebrar |

## 5. Arquitetura proposta

### Página
- `src/pages/CidadelaPage.tsx` (a ser criada em etapa futura).

### Componentes sugeridos (apenas proposta)
- `CidadelaHeader`: Saudação personalizada e estado da habitante.
- `EstadoDaHabitanteCard`: Distrito atual, voz ativa e tom simbólico.
- `TravessiasRecentesCard`: Histórico das últimas ações significativas.
- `ProximosPassosCard`: Recomendação de continuidade imediata.
- `TrilhasEmAndamento`: Agregação de Rotas, Sala e Formação.

### Hook agregador sugerido
- `useCidadelaOverview`: Camada de composição que busca dados de `user_cidadela_estado`, matrículas e progresso pedagógico sem realizar escritas ou cálculos complexos.

### Camada de dados
- Utilizar `src/lib/dal/cidadelaEstado.ts` e services de progresso existentes.
- **Não criar novo schema sem justificativa técnica em ciclos futuros.**

## 6. Dados permitidos na V0.3

| Dado | Fonte provável | Seguro? | Observação |
| :--- | :--- | :--- | :--- |
| Estado simbólico | `user_cidadela_estado` | ✅ | Distrito e voz |
| Histórico de travessias | `user_cidadela_estado` | ✅ | Apenas do próprio usuário |
| Progresso Rotas | Hooks existentes | ✅ | Leitura de status |
| Progresso Sala | Services de progresso | ✅ | Status de conclusão |
| Progresso Formação | `matriculas` / `academy_progress` | ✅ | Status de conclusão |
| Próximos passos | Lógica de overview | ✅ | Sugestão pedagógica |

## 7. Dados proibidos ou adiados
- **NÃO ENTRA**: Dados de clientes da terapeuta.
- **NÃO ENTRA**: Prontuários ou relatórios clínicos.
- **NÃO ENTRA**: Ferramentas operacionais da Casa das Máquinas.
- **NÃO ENTRA**: Atlas ou IA (Syntheia).
- **NÃO ENTRA**: Scores psicológicos ou diagnósticos médicos.
- **NÃO ENTRA**: Linguagem de performance (rankings, notas).

## 8. Escopo mínimo seguro da V0.3

### Deve entrar na primeira implementação
- Criação da rota `/cidadela`.
- Layout básico com saudação e estado simbólico.
- Cards de "Onde estou" e "O que atravessei".
- Link seguro para "Continuar agora".
- Reuso integral de dados e hooks existentes.

### Deve ficar para depois
- Widgets customizáveis e gamificação (selos, recompensas).
- Timeline interativa avançada.
- Recomendações baseadas em comportamento complexo.

### Não deve entrar neste ciclo
- Integração com Casa das Máquinas.
- Funcionalidades de prontuário ou gestão clínica.

## 9. Estratégia para `/minha-jornada`
Recomenda-se manter a rota ativa temporariamente e, após a estabilização da Cidadela V0.3, transformá-la em uma seção interna ou redirecionar permanentemente para o histórico dentro da Cidadela.

## 10. Estratégia para `/dashboard-membro`
O Dashboard deve ser mantido como uma área operacional e de gestão de conta. A Cidadela deve ser promovida como o "Home" real da habitante ativa, deixando o Dashboard para questões técnicas, administrativas e de suporte.

## 11. Estratégia para `/cidadela/revelacao`
Deve ser preservada como a experiência de "nascimento" ou "revelação" do mapa. A Cidadela pode oferecer um link para "Revisitar a Revelação", mas as experiências devem permanecer distintas para preservar o impacto simbólico da revelação inicial.

## 12. Riscos técnicos
- Duplicação de lógica entre hooks de home e cidadela.
- Performance na agregação de múltiplos estados de progresso.
- Inconsistência de dados se o `user_cidadela_estado` não estiver sincronizado.
- Regressões em rotas protegidas por guards de acesso.

## 13. Riscos simbólicos e éticos
- Transformar a jornada simbólica em um painel de "tarefas a fazer".
- Uso de linguagem excessivamente clínica ou de performance.
- Exposição acidental de dados sensíveis se a camada de overview não for rigorosa.

## 14. Ordem recomendada de implementação
1. Implementar `useCidadelaOverview` (composição de dados).
2. Criar `CidadelaPage` e registrar rota básica.
3. Desenvolver componentes visuais mínimos (Header e Cards de Estado).
4. Integrar feeds de Rotas, Sala e Formação.
5. Realizar testes de regressão no Dashboard e Minha Jornada.
6. Documentar o encerramento da V0.3.

## 15. Critérios de aceite da V0.3
- Rota `/cidadela` acessível e funcional.
- `/dashboard-membro` e `/minha-jornada` permanecem operacionais.
- Nenhum dado clínico ou de terceiros é exposto.
- Sem novas migrations ou alterações de RLS.
- Sucesso nos testes de `tsc` e build.

## 16. Decisão final
`CIDADELA_V0_3_PLAN_READY`
