# Relatório de Continuidade: CidaDELA Interior

Este documento detalha a implementação da camada de continuidade pós-travessia da CidaDELA Interior, transformando o "Mapa Vivo" em um ponto de partida para a jornada na Casa Orácula.

## 1. Estrutura de Recomendação Inteligente
Implementamos um motor determinístico em `src/lib/cartografia/montarProfileJson.ts` que deriva recomendações personalizadas com base na **Tensão Central** identificada na cartografia.

### Mapeamento de Tensões e Rotas
- **Controle vs Colapso**: Foca em Aterramento e Contenção.
- **Estrutura vs Expressão**: Foca em Voz Autêntica e Criatividade.
- **Pertencimento vs Autonomia**: Foca em Diferenciação e Solitude.
- **Expansão vs Segurança**: Foca em Movimento e Coragem.
- **Expressão vs Aceitação**: Foca em Autenticidade e Verdade.
- **Segurança vs Movimento**: Foca em Fluidez e Iniciativa.

## 2. Seção "Próximo Passo"
A interface de resultado (`src/components/cartografia/CartografiaEstruturalStepper.tsx`) agora inclui um card premium de continuidade:
- **Rotas da Casa**: Sugestões de trilhas de conteúdo.
- **Práticas Iniciais**: Exercícios simples para começar a habitar a CidaDELA.
- **Clínica dos Contos**: Convite suave para aprofundamento terapêutico guiado.

## 3. Arquivos Alterados
- `src/lib/cartografia/montarProfileJson.ts`: Inclusão da lógica de recomendações e tipos.
- `src/components/cartografia/CartografiaEstruturalStepper.tsx`: UI da camada de continuidade no resultado.

## 4. Testes Realizados
- [x] Geração de recomendações corretas para cada uma das 6 tensões.
- [x] Exibição fluida do card de próximo passo após a revelação do mapa.
- [x] Redirecionamento correto para Clínica dos Contos e Dashboard.
- [x] Manutenção da linguagem de travessia guiada (não agressiva).

## 5. Riscos e Recomendações
- **Risco**: Sobrecarga de informações no final da jornada.
- **Mitigação**: O card é visualmente leve e focado em apenas 2 rotas e 2 práticas por vez.
- **Próxima Sprint**: Monitorar o engajamento com as rotas sugeridas a partir da CidaDELA.
