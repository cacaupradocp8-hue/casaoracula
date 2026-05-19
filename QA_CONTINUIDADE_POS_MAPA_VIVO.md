# Relatório QA: Camada de Continuidade Pós-Mapa Vivo

Este relatório valida a implementação da camada de continuidade da CidaDELA Interior, garantindo que a usuária seja guiada de forma personalizada e segura para as próximas etapas de sua travessia na Casa Orácula.

## 1. Origem da Recomendação
**Status: Aprovado**
- A lógica reside em `src/lib/cartografia/montarProfileJson.ts`.
- As recomendações são derivadas diretamente da **Tensão Central** (`tensao_central`), que por sua vez é calculada a partir das médias dos 5 eixos estruturais (Traços de Personalidade/Big Five Oracular).
- **Personalização Encontrada:** O sistema mapeia cada uma das 6 tensões possíveis para um conjunto específico de rotas, práticas e passos clínicos.

## 2. Personalização e UX
**Status: Aprovado**
- A usuária recebe exatamente:
  - **Duas Rotas da Casa Orácula** recomendadas.
  - **Duas Práticas Iniciais** focadas no seu momento.
  - **Um Convite Personalizado** para a Clínica dos Contos.
  - **Um Botão Principal** de retorno ao Dashboard.
- **Evitar Excesso:** A interface em `CartografiaEstruturalStepper.tsx` organiza as opções em um card limpo, sem sobrecarga visual ou sensação de catálogo.

## 3. Linguagem e Ética
**Status: Aprovado**
- A microcopy utiliza termos como "Travessia Guiada", "Ahabitar sua CidaDELA", "Acolhimento".
- **Linguagem Segura:** Não foram encontrados termos diagnósticos (ex: ansiedade, depressão) ou promessas de cura.
- **Nota Ética:** Mantida a seção de "Nível de Atenção e Segurança" com aviso explícito sobre suporte profissional em caso de crise.

## 4. Fluxo e Acesso
**Status: Aprovado**
- **CTAs:** O botão da Clínica dos Contos aponta corretamente para `/clinica-dos-contos`.
- **Gating:** O acesso à ferramenta de cartografia (`CartografiaEstruturalStepper`) já possui guards de rascunho e conclusão. Visitantes gratuitas são bloqueadas pelas rotas de portal no `App.tsx`.
- **Admin:** Possui bypass total como esperado.

## 5. Arquivos Verificados
- `src/lib/cartografia/montarProfileJson.ts`: Lógica de recomendação por tensão.
- `src/components/cartografia/CartografiaEstruturalStepper.tsx`: Renderização do card de continuidade.
- `src/lib/cartografia/leituraComportamental.ts`: Motor de cálculo da Tensão Central.
- `src/App.tsx` & `src/routes/jornadaRoutes.tsx`: Configuração de rotas e acessos.

## 6. Riscos Pendentes e Recomendações
- **P1 - Rota Específica da Clínica:** Atualmente o botão aponta para `/clinica-dos-contos`. Se houver necessidade de filtrar a Clínica por "Porta Psíquica" automaticamente, a rota poderia ser expandida para algo como `/clinica-dos-contos?porta=Torre+Interna`.
- **P2 - Link Direto para Rotas:** Os nomes das rotas no card são textuais. No futuro, podem ser transformados em links diretos para as páginas de conteúdo correspondentes.
- **P0 - Consistência de Naming:** Confirmado que o termo "Clube de Leitura Oracular" não está sendo usado como nome principal na interface de resultado.

## Conclusão
A camada de continuidade está **funcional, personalizada e segura**, respeitando os princípios da Cartografia Estrutural Orácula™.
