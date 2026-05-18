# Ajuste de Fluxo: Resultado do Quiz, Travessia e Rotas

Este documento detalha os ajustes realizados no fluxo de conversão e experiência da usuária, priorizando a visualização do resultado do quiz e a transição consciente para a Travessia 00 e Assinatura.

## Fluxo Corrigido

1.  **Sala de Visita** (`/sala-da-visitante`)
    *   **CTA:** "Descobrir minha Voz"
    *   **Destino:** `/quiz/descubra-seu-eixo`

2.  **Quiz da Voz** (`/quiz/descubra-seu-eixo`)
    *   Abertura pública e gratuita.
    *   Ao finalizar, a usuária é levada para a **Página de Resultado**.

3.  **Página de Resultado do Quiz**
    *   Exibe o arquétipo/voz revelado, texto interpretativo e mídias associadas.
    *   **CTA Principal:** "Guardar minha Voz e iniciar a Travessia 00".
    *   **Comportamento Visitante Anônima:** Redireciona para login/cadastro com retorno para `/travessia/travessia-zero-o-limiar-da-casa`.
    *   **Comportamento Visitante Logada:** Redireciona diretamente para a Travessia 00.

4.  **Travessia 00: O Limiar da Casa** (`/travessia/travessia-zero-o-limiar-da-casa`)
    *   Primeira etapa gratuita da jornada (requer login).
    *   Foco em sintonização (7 dias).
    *   Ao final (ou durante), apresenta o convite para a assinatura.

5.  **Assinatura: Rotas da Casa Orácula**
    *   O antigo "Clube" agora é formalmente apresentado como **Rotas da Casa Orácula**.
    *   A **CidaDELA Interior / Cartografia Psíquica** é posicionada como benefício exclusivo da assinatura.

## Arquivos Alterados

*   `src/pages/QuizPage.tsx`: Ajuste do CTA principal e fluxos de redirecionamento.
*   `src/components/quiz/QuizResultView.tsx`: Atualização de textos, nomenclatura das Rotas e CTAs de conversão.
*   `src/pages/TravessiaDetalhe.tsx`: Refinamento do convite para assinatura pós-travessia.
*   `src/App.tsx`: Reforço das regras de acesso (RLS/Gating) para cartografia e rotas.

## Comportamento por Perfil

| Etapa | Visitante Anônima | Visitante Logada | Assinante |
| :--- | :--- | :--- | :--- |
| Sala de Visita | Acesso livre | Acesso livre | Acesso livre |
| Quiz | Acesso livre (sem salvar) | Acesso livre (salva) | Acesso livre (salva) |
| Resultado Quiz | Ver resultado resumido | Ver resultado completo | Ver resultado completo |
| Travessia 00 | Login Obrigatório | Acesso livre | Acesso livre |
| CidaDELA | Bloqueado (ir para Planos) | Bloqueado (ir para Planos) | Acesso livre |
| Rotas (Clube) | Bloqueado (ir para Planos) | Bloqueado (ir para Planos) | Acesso livre |

## Testes Realizados

1.  **Acesso Anônimo:** Verificado que `/sala-da-visitante` e `/quiz` funcionam sem login.
2.  **Resultado Pós-Quiz:** Confirmado que a usuária vê o resultado antes de qualquer pedido de autenticação.
3.  **CTA "Guardar minha Voz":** Validado o redirecionamento para login com `redirect` para a Travessia 00.
4.  **Gating de Assinatura:** Validado que links para a CidaDELA levam à página de planos para quem não possui assinatura ativa.
5.  **Nomenclatura:** Substituição de "Clube" por "Rotas da Casa Orácula" em pontos estratégicos de conversão.
