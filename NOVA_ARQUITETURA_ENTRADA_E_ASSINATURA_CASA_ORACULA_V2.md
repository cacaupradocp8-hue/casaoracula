# NOVA ARQUITETURA: ENTRADA E ASSINATURA CASA ORÁCULA (V2)

Este documento refina a estratégia da Casa Orácula com base nas rotas reais do sistema, definindo as regras de acesso e a jornada de conversão.

## 1. Estrutura de Fluxos e Acessos

### A. Fluxo Público (Sem Login)
Experiência de "degustação" e diagnóstico para atrair novas moradoras.
*   **Sala de Visita:** `/sala-da-visitante` -> **Pública** (Remover ProtectedRoute).
*   **Quiz da Voz:** `/quiz/descubra-seu-eixo` -> **Público** (Permitir resposta sem login).
*   **Resultado Inicial:** Resumo da voz arquetípica revelada no quiz.

### B. Fluxo Gratuito (Com Login)
Experiência de entrada profunda (Onboarding).
*   **Jornada Inicial 00:** `/travessia/travessia-zero-o-limiar-da-casa`.
*   **Recursos:** Salvamento de progresso e desbloqueio diário de conteúdos da Jornada 00.

### C. Fluxo de Assinatura (Rotas da Casa Orácula)
Experiência completa e contínua para assinantes.
*   **Produto:** Rotas da Casa Orácula.
*   **CidaDELA Interior:** `/ferramenta/cartografia-psiquica-oracula` (Mapa simbólico profundo).
*   **Clínica dos Contos:** Núcleo de interpretação e profundidade.
*   **Ecossistema:** Áudios, Práticas, Encontros, Lab 80/20 e Mapa de Progresso total.

## 2. Mapeamento de Rotas e Redirecionamentos

| Tipo | Rota Real / Atual | Novo Status / Papel |
| :--- | :--- | :--- |
| **Entrada** | `/sala-da-visitante` | Pública (Porta de Entrada) |
| **Quiz** | `/quiz/descubra-seu-eixo` | Público (Diagnóstico) |
| **CidaDELA** | `/ferramenta/cartografia-psiquica-oracula` | **Assinatura** (Protegido) |
| **Legado** | `/ferramentas/cartografia-psiquica-oracula` | Redirect para `/ferramenta/...` |
| **Legado** | `/cartografia` | Redirect para `/ferramenta/...` |
| **Rotas/Clube** | `/app/clube` | Parte das "Rotas da Casa Orácula" |
| **Rotas/Clube** | `/clube-livro/:id` | Parte das "Rotas da Casa Orácula" |
| **Rotas/Clube** | `/clube-livro/travessias` | Parte das "Rotas da Casa Orácula" |

## 3. Estratégia de CTAs (Conversão)

1.  **Na Sala de Visita:**
    *   Botão: "Descobrir minha Voz" -> Direciona para `/quiz/descubra-seu-eixo`.
2.  **No Resultado do Quiz:**
    *   Botão: "Guardar minha Voz e iniciar a Jornada 00".
    *   Lógica: Se sem login -> Abre Auth. Se logada -> Redireciona para `/travessia/travessia-zero-o-limiar-da-casa`.
3.  **Na Jornada 00 (Fim ou Intermediário):**
    *   Botão: "Habitar minha CidaDELA" -> Direciona para Vitrine de Planos/Assinatura.
4.  **Após Assinatura:**
    *   Botão: "Revelar minha CidaDELA Interior" -> Direciona para `/ferramenta/cartografia-psiquica-oracula`.

## 4. Regras de Acesso por Etapa

*   **Público:** `/sala-da-visitante`, `/quiz/*` (somente visualização/resposta inicial).
*   **Visitante (Logado Gratuito):** Acesso à `/travessia/travessia-zero-*`. Bloqueio ao tentar acessar `/ferramenta/cartografia-*` ou `/clube-*`.
*   **Assinante:** Acesso total a todas as rotas mencionadas.

## 5. Plano de Implementação (Commits)

1.  **Commit 1: Liberação da Entrada.** Alterar `src/App.tsx` para tornar `/sala-da-visitante` e `/quiz/:quizId` públicos.
2.  **Commit 2: Proteção da CidaDELA.** Ajustar `ProtectedRoute` ou lógica interna para que `/ferramenta/cartografia-psiquica-oracula` exija nível de assinatura.
3.  **Commit 3: Rebranding Visual.** Atualizar textos de "Clube de Leitura" para "Rotas da Casa Orácula" e slogans.
4.  **Commit 4: Lógica de Redirecionamento.** Implementar redirects de rotas legadas no `App.tsx` ou via `Navigate`.
5.  **Commit 5: Fluxo de Checkout/Conversão.** Ajustar os botões de CTA para respeitar a nova lógica de login e redirecionamento pós-quiz.
