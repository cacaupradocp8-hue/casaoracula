# AJUSTE DE FLUXO: RESULTADO DO QUIZ, TRAVESSIA E ROTAS

Este ajuste corrige a jornada da usuária após a conclusão do Quiz da Voz, garantindo que o resultado seja apreciado antes de qualquer redirecionamento, e estabelecendo a Travessia 00 como o próximo passo natural.

## 1. Fluxo Anterior
- Visitante respondia o quiz.
- Podia ser redirecionada precocemente ou ver um resultado com CTAs genéricos.
- O destino pós-login nem sempre era a Travessia 00.
- A CidaDELA e as Rotas da Casa apareciam como opções imediatas, diluindo o foco.

## 2. Fluxo Corrigido
1. **Sala de Visita** (`/sala-da-visitante`) -> CTA "Descobrir minha Voz" -> `/quiz/descubra-seu-eixo`.
2. **Quiz da Voz** -> Usuária responde -> **Página de Resultado**.
3. **Página de Resultado** -> Exibe Voz/Arquétipo e interpretação.
   - **Visitante Anônima**: Resultado inicial resumido. Não salva no banco.
   - **Visitante Logada**: Resultado completo. Salva no banco e no perfil.
4. **CTA no Resultado**: "Guardar minha Voz e iniciar a Travessia 00".
   - Se anônima: Abre `/auth?redirect=/travessia/travessia-zero-o-limiar-da-casa`.
   - Se logada: Vai direto para `/travessia/travessia-zero-o-limiar-da-casa`.
5. **Travessia 00**: Experiência gratuita com login para salvar progresso.
6. **Pós-Travessia 00**: Convite para "Habitar as Rotas da Casa Orácula" (Assinatura).
7. **CidaDELA**: Exclusiva para assinantes das Rotas da Casa.

## 3. Arquivos Alterados
- `src/pages/QuizPage.tsx`: Ajuste na lógica de submissão e CTAs.
- `src/components/quiz/QuizResultView.tsx`: Reformulação completa dos blocos de decisão.
- `src/App.tsx`: Refinamento de acessos e redirecionamentos.
- `src/pages/clube/ClubeRotasCatalogo.tsx`: Ajuste de nomenclatura (Rotas da Casa Orácula).
- `src/components/layout/Navigation.tsx`: Atualização de labels no menu.

## 4. Comportamento por Perfil

### Visitante Anônima
- Acessa Sala de Visita e Quiz livremente.
- Vê resultado do quiz.
- Ao clicar no CTA de progresso, é convidada a criar conta/entrar.
- Pós-login, cai exatamente no Dia 1 da Travessia 00.

### Visitante Logada (Gratuito)
- Responde quiz e tem resultado salvo automaticamente.
- Acessa a Travessia 00 para vivenciar os 7 dias iniciais.
- Bloqueada em conteúdos de assinatura (CidaDELA, Rotas).

### Assinante
- Acesso total às Rotas da Casa Orácula e CidaDELA Interior.

## 5. Testes Realizados
- [ ] Fluxo anônimo: Sala -> Quiz -> Resultado -> Login -> Travessia 00.
- [ ] Fluxo logado: Quiz -> Resultado -> Travessia 00 direto.
- [ ] Verificação de gating: Visitante gratuita tentando acessar `/ferramenta/cartografia-psiquica-oracula` deve ver tela de bloqueio.
- [ ] Verificação de labels: "Clube" substituído por "Rotas da Casa Orácula" no menu.
