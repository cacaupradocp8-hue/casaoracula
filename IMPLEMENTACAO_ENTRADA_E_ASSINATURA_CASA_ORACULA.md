# IMPLEMENTAÇÃO: ENTRADA E ASSINATURA CASA ORÁCULA

Este documento resume as alterações realizadas para separar a experiência gratuita da assinatura, garantindo um fluxo fluido e estratégico.

## 1. Alterações Realizadas

### Arquivos Alterados
*   `src/App.tsx`: Liberação de rotas públicas e ajuste de redirecionamentos.
*   `src/pages/QuizPage.tsx`: Lógica para visitantes anônimas, resultado resumido e novos CTAs.
*   `src/pages/Welcome.tsx`: Redirecionamento de usuários não logados para a Sala da Visitante.
*   `src/pages/CartografiaPsiquicaPage.tsx`: Implementação de gating de assinatura para a CidaDELA.
*   `src/pages/TravessiaDetalhe.tsx`: Ajuste de CTAs na Jornada 00.
*   `src/components/layout/Navigation.tsx`: Rebranding do "Clube" para "Rotas da Casa Orácula".
*   `src/hooks/auth/useRouteGuard.ts`: Remoção das rotas de jornada do bypass de onboarding (forçando login).
*   `src/pages/Auth.tsx`: Suporte a parâmetro de redirecionamento pós-login.

### Rotas Públicas (Sem Login)
*   `/sala-da-visitante`: Boas-vindas e micro-ritual.
*   `/quiz/:quizId`: Diagnóstico arquetípico.
*   `/quiz/:quizId/resultado`: Resultado resumido.
*   `/auth`: Login/Cadastro.
*   `/comece-aqui` & `/experiencia-gratuita`: Redirecionam para as portas de entrada.

### Rotas Protegidas
*   `/travessia/travessia-zero-o-limiar-da-casa`: Exige login para salvar progresso.
*   `/ferramenta/cartografia-psiquica-oracula`: Exige assinatura ativa (nível 'aluna' ou superior).
*   `/clube/*`: Exige assinatura (Rotas da Casa Orácula).

## 2. Comportamento por Perfil

### Visitante Anônima
1.  Acessa a Sala da Visitante.
2.  Responde ao Quiz.
3.  Vê resultado resumido.
4.  Ao clicar em "Guardar minha Voz", é levada ao login/cadastro.
5.  Pós-login, é redirecionada automaticamente para a Jornada 00.

### Visitante Logada (Gratuita)
1.  Acessa a Jornada 00 e salva progresso.
2.  Ao tentar acessar a CidaDELA, vê a tela de bloqueio com convite para assinatura.
3.  Vê o rebranding "Rotas da Casa Orácula" nos menus.

### Assinante
1.  Acesso total a todas as ferramentas, incluindo CidaDELA Interior e Rotas de Leitura.
2.  CTAs na Jornada 00 mudam para "Revelar minha CidaDELA Interior".

## 3. Testes Verificados
*   [x] Visitante anônima acessa `/sala-da-visitante` sem ser barrada.
*   [x] Quiz funciona sem login e exibe resultado.
*   [x] Botão de redirecionamento do Quiz para Jornada 00 via Auth funciona.
*   [x] Bloqueio da CidaDELA para não-assinantes exibe tela de vendas elegante.
*   [x] Rebranding textual aplicado no menu de navegação.
*   [x] Redirects legados de cartografia e ferramentas mantidos.
