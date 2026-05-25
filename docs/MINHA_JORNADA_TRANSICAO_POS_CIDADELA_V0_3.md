# Transição de Minha Jornada após Cidadela V0.3

## 1. Status

**Status**: `MINHA_JORNADA_KEEP_TEMPORARILY`

A rota `/minha-jornada` deve ser mantida como legado funcional temporário. Não deve ser removida, redirecionada ou fundida com a `/cidadela` neste momento, garantindo a estabilidade do fluxo de acesso e a separação estrita de domínios.

## 2. Papel atual de /minha-jornada

A página funciona como um mapa linear de estágios da conta e da presença da usuária na plataforma, rastreando acessos e participações nos seguintes estágios:
- **Sala de Visitas**: Quiz inicial e primeiro contato.
- **Clube**: Estudo simbólico.
- **Formação**: Programa profissional.
- **Treinamento**: Ambiente de prática.
- **Casa das Máquinas**: Uso do SaaS profissional (detecção de clientes).
- **Comunidade**: Participação no fórum/feed.
- **Especialização**: Portais avançados.

## 3. Papel atual de /cidadela

A `/cidadela` (V0.3) é o centro pessoal simbólico da habitante, focada no percurso pedagógico e simbólico:
- **Estado Atual**: Posição simbólica.
- **Travessias**: Histórico de marcos acesos.
- **Conteúdo**: Resumo de Rotas, Treinamento e Formação.
- **Próximo Passo**: Sugestão determinística baseada em dados pedagógicos.
- **Domínio**: Estritamente `CIDADELA_PESSOAL_ALUNA`, operando em modo read-only.

## 4. Diferença entre as rotas

| Aspecto | /minha-jornada | /cidadela |
| :--- | :--- | :--- |
| **Função** | Mapa linear de estágios de conta | Centro simbólico e agregador pessoal |
| **Dados** | Acessos, conta e atividade funcional | Percurso, marcos e progresso pedagógico |
| **Domínio** | Legado funcional misto | CIDADELA_PESSOAL_ALUNA |
| **Risco** | Toca levemente em contagem de clientes | Isolado, seguro e read-only |
| **Status** | Manter temporariamente | Aprovado e integrado V0.3 |

## 5. Por que não redirecionar agora

O redirecionamento imediato é contraindicado pelos seguintes motivos:
- **Dependências**: Existem múltiplos links internos ativos apontando para `/minha-jornada`.
- **Cobertura**: A Cidadela V0.3 ainda não representa estágios funcionais como "Comunidade" ou "Especialização".
- **Isolamento**: A `/minha-jornada` realiza contagem de clientes para validar o estágio "Casa das Máquinas", o que violaria o guardrail de isolamento total de dados de terceiros da Cidadela.
- **Lógica de Conta**: A lógica de acesso por portal/feature é centralizada na página antiga.

## 6. Guardrails

Nenhuma migração futura poderá:
- Misturar contagem ou dados de clientes na Cidadela pessoal da habitante.
- Puxar ferramentas da Casa das Máquinas ou Jardim da Heroína para o domínio pessoal.
- Integrar Atlas, IA ou Syntheia sem auditoria ética e técnica específica.
- Transformar o percurso pedagógico em linguagem diagnóstica ou prontuário.

## 7. Estratégia futura recomendada

A transição deve ocorrer em quatro fases:
1.  **Fase 1 (Atual)**: Coexistência pacífica. `/cidadela` como centro pessoal e `/minha-jornada` como mapa funcional.
2.  **Fase 2**: Migração de elementos seguros (Sala de Visitas, Clube, Treinamento) para blocos visuais dentro da Cidadela.
3.  **Fase 3**: Separação do domínio profissional. Elementos da Casa das Máquinas migram para um "Painel da Terapeuta" ou "Cidadela Profissional" isolada.
4.  **Fase 4**: Redirecionamento ou arquivamento de `/minha-jornada` após a absorção total de suas funções pelos novos centros.

## 8. Links internos conhecidos

Identificados e preservados:
- Redirect `/jornada` → `/minha-jornada`.
- Link em `HomeOnboardingBlocks.tsx`.
- Referência em `MapaCasaOracula.tsx`.
- Referência em `SalaDeTreinamentoPage.tsx`.

## 9. Decisão para o ciclo atual

- **NÃO** redirecionar `/minha-jornada`.
- **NÃO** remover links existentes.
- **NÃO** fundir componentes ou hooks.
- **NÃO** alterar o DashboardMembro em relação a esses links.
- **PRESERVAR** o isolamento do domínio profissional.

## 10. Pendências futuras (V0.4+)

- Avaliar se "Minha Jornada" deve virar uma aba de "Histórico Linear" dentro da Cidadela.
- Planejar a separação de estágios profissionais em domínio próprio.
- Revisar a comunicação visual da página de estágios para alinhamento estético.

## 11. Decisão final

`MINHA_JORNADA_KEEP_TEMPORARILY_DOCUMENTED`
