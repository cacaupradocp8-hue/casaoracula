# IMPLEMENTAÇÃO STEPPER CARTOGRAFIA ESTRUTURAL ORÁCULA™

## Arquivos Alterados
- `src/pages/CartografiaPsiquicaPage.tsx`: Refatorada integralmente para usar o novo Stepper.
- `src/hooks/useCartografiaEstrutural.ts`: Novo hook para gerenciar o estado do stepper qualitativo e integração com o motor central.
- `src/components/cartografia/CartografiaEstruturalStepper.tsx`: Componente visual do novo Stepper Premium.

## Componentes Refatorados
- **CartografiaPsiquicaPage**: Deixou de ser um formulário linear de Big Five para se tornar o host da experiência Cartografia Estrutural Orácula™.
- **CartografiaEstruturalStepper**: Implementa a UX mobile-first com progress bar, uma etapa por tela e integração dos 6 territórios.

## Estrutura do Stepper
1. **Intro**: Pacto ético e explicação do método.
2. **Sintoma**: Mapeamento de desconfortos e padrões.
3. **História**: Contextualização biográfica e narrativa.
4. **Traços**: Integração qualitativa (com apoio do motor Big Five no backend).
5. **Crenças**: Identificação de narrativas governantes.
6. **Recursos**: Mapeamento de forças e práticas.
7. **Segurança**: Nível de Atenção e Segurança (Linguagem não alarmista).
8. **Mapa Vivo**: Resultado final com Saída Simbolica e Camadas Técnicas.

## Persistência e Motor Central
- **Progresso**: O estado é mantido em memória durante a sessão. A persistência final ocorre na tabela `cartografia_psiquica` e no `co_cartografia_profile`.
- **Geração do Mapa**: Utiliza `montarProfileJson`, garantindo que a CidaDELA e a Leitura Psíquica sejam derivadas de forma determinística.
- **Integração Big Five**: O motor do Big Five é usado como "background" para a derivação dos traços, sem exigir que a usuária veja a ferramenta separada.
- **Atlas**: Integrado na camada de formulação através do `montarProfileJson`.

## Regras de Acesso
- **Visitantes**: Bloqueadas por `useEffectivePortal` com tela de convite para assinatura.
- **Assinantes**: Acesso total à CidaDELA Interior.
- **Admin**: Acesso preservado.

## Validações Realizadas
- [x] Renomeação para Cartografia Estrutural Orácula™ / CidaDELA Interior.
- [x] Remoção de linguagem de diagnóstico clínico.
- [x] Preservação das rotas oficiais.
- [x] Estética Premium e tom de voz Oracular.

## Riscos Pendentes
- A persistência de rascunhos (drafts) para continuar em outra sessão futura pode ser expandida na Fase 5, caso necessário. Atualmente, o salvamento ocorre na finalização.
