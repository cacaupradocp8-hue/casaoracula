# AJUSTE TEMPLATE RESULTADO QUIZ VOZ

Este documento detalha as melhorias realizadas na página de resultado do Quiz da Voz para alinhar com a nova arquitetura da Casa Orácula.

## 1. Arquivos Alterados
- `src/pages/QuizPage.tsx`: Refatoração da estrutura da página para priorizar o fluxo simbólico e a transição para a Travessia 00.
- `src/components/quiz/QuizResultView.tsx`: Redesign completo do template visual do resultado.

## 2. Melhorias no Template
- **Hierarquia Visual:** Título simbólico centralizado com tipografia de destaque.
- **Voz de Apoio:** Exibição elegante do resultado secundário como "Voz de apoio".
- **Conteúdo Dinâmico:** Priorização total do conteúdo vindo do banco (imagem, texto interpretativo, mídia e blocos modulares).
- **Remoção de Ruído:** Retirada de textos hardcoded legados como "Clube do Livro Oracular".

## 3. Comportamento por Perfil

### Visitante Anônima
- Visualiza o resultado completo configurado.
- CTA principal: **"Guardar minha Voz e iniciar a Travessia 00"**.
- Ao clicar, abre tela de login/cadastro e redireciona para a Travessia 00 pós-sucesso.
- Aviso discreto sobre a necessidade de conta gratuita para salvar o progresso.

### Visitante Logada
- Resultado salvo automaticamente no perfil.
- Sincronização da "Voz" no sistema.
- CTA principal leva direto para a Travessia 00.
- Opção de aprofundamento com Syntheia (Arcane).

### Assinante
- Acesso total ao resultado.
- CTAs para Rotas da Casa e CidaDELA aparecem como benefícios discretos mas acessíveis.
- Não há bloqueio ou pressão de venda, mantendo o foco na jornada simbólica.

## 4. Novos CTAs e Rotas
- **Principal:** `Guardar minha Voz e iniciar a Travessia 00` -> `/travessia/travessia-zero-o-limiar-da-casa`
- **Secundário:** `Rotas da Casa Orácula` -> `/planos`
- **Assinatura:** `CidaDELA Interior` -> `/planos` (ou `/ferramenta/cartografia-psiquica-oracula` se já assinante)

## 5. Testes Realizados
- [x] Resposta do quiz como anônima -> Visualização correta -> Redirecionamento para Auth.
- [x] Resposta do quiz como logada -> Salvamento no banco -> Redirecionamento direto para Travessia.
- [x] Verificação de conteúdo modular extra aparecendo abaixo do resultado fixo.
- [x] Teste de responsividade (Mobile-first).

O template agora funciona como um espelho simbólico da visitante, criando um desejo natural de prosseguir para a Travessia 00.
