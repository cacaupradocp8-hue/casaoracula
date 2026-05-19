# Correção CidaDELA Interior: Perguntas e Resultados

## Problemas Encontrados
- **Stepper subjetivo**: A implementação anterior focava excessivamente em perguntas abertas, perdendo a força diagnóstica do Método Orácula.
- **Resultado genérico**: Placeholder vazios (""), campos zerados (0/12) e seções "Não explorado" apareciam para a usuária final.
- **Erros de navegação**: O CTA da Clínica dos Contos levava a uma rota inexistente (404).

## Solução Implementada

### 1. Núcleo Estruturado (30 Perguntas)
- **Restauração**: Adaptamos as 30 perguntas objetivas inspiradas nos 5 grandes traços, integrando-as diretamente no fluxo da CidaDELA Interior.
- **Interface**: Criamos um stepper de escala (1-5) para estas perguntas, garantindo dados robustos para o Mapa Vivo.
- **Privacidade**: Toda a linguagem técnica foi removida da interface, mantendo a abordagem simbólica da Casa Orácula.

### 2. Integração dos Territórios
- Os 6 territórios (Sintoma, História, Traços/Núcleo, Crenças, Recursos, Segurança) agora funcionam de forma híbrida:
  - **Objetivas**: Geram o motor psíquico e a derivação da CidaDELA.
  - **Qualitativas**: Enriquecem a leitura psíquica.

### 3. Refinamento do Mapa Vivo
- **Proteção de Interface**: Adicionamos travas para que campos vazios ou aspas sejam substituídos por mensagens elegantes como "Em aprofundamento" ou "Aguardando travessia".
- **Ocultação Inteligente**: Seções sem dados suficientes agora são ocultadas ou mostram mensagens de convite ao aprofundamento.

### 4. Continuidade e Rotas
- **Rotas da Casa Orácula**: O CTA principal agora aponta corretamente para `/clube`, a rota real do antigo Clube.
- **Clínica dos Contos**: Como a rota específica ainda não está ativa, o CTA foi unificado às Rotas da Casa, evitando erros 404.

## Arquivos Alterados
- `src/hooks/useCartografiaEstrutural.ts`: Alteração do estado e lógica de salvamento para suportar o núcleo estruturado.
- `src/components/cartografia/CartografiaEstruturalStepper.tsx`: Nova UI para as 30 perguntas e correção dos CTAs de resultado.
- `src/lib/cartografia/montarProfileJson.ts`: Ajuste no motor de geração para evitar campos vazios e placeholders técnicos.

## Testes Realizados
1. ✅ Travessia completa com todas as respostas.
2. ✅ Verificação de ausência de aspas vazias no resultado.
3. ✅ Teste de navegação do botão "Entrar nas Rotas" (leva ao /clube).
4. ✅ Validação de bloqueio para visitantes (mantido via RouteGuard).
5. ✅ Confirmação de que o Big Five original não foi afetado.

## Riscos Pendentes
- Usuárias com rascunhos antigos podem precisar reiniciar a travessia devido à mudança na estrutura de respostas (de `big5` para `objetivas`). Adicionamos tratamento básico, mas o reinício é recomendado para quem estava no meio do processo antigo.
