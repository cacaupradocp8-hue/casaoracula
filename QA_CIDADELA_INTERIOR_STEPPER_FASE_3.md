# QA — CidaDELA Interior Stepper (Fase 3)

## 1. Arquivos Testados
- `src/pages/CartografiaPsiquicaPage.tsx` (Access Gate & Page Host)
- `src/components/cartografia/CartografiaEstruturalStepper.tsx` (Componente Stepper)
- `src/hooks/useCartografiaEstrutural.ts` (Lógica e Persistência)
- `src/lib/cartografia/montarProfileJson.ts` (Motor Central)
- `src/components/cartografia-unificada/SaidaSimbolica.tsx` (UI de Resultado)

## 2. Fluxo Testado e Resultados

### 2.1 Acesso e Assinatura
- **Visitante Anônima/Gratuita**: [APROVADO] `CartografiaPsiquicaPage` utiliza `useEffectivePortal` e bloqueia quem não tem nível `aluna`.
- **Tela de Bloqueio**: [APROVADO] Apresenta design elegante com ícone de cadeado dourado, benefícios listados e CTA para `/planos`.
- **CTA**: [APROVADO] Botão "Assinar e revelar minha CidaDELA" direciona corretamente para a vitrine de planos.

### 2.2 Abertura e Pacto Ético
- **Explicação**: [APROVADO] A tela de `intro` explica que é um mapeamento psíquico para auto-observação.
- **Pacto Ético**: [APROVADO] Contém a nota "Experiência segura e não diagnóstica" na intro e um aviso detalhado no resultado final (Card de Segurança).
- **Dados e Pausa**: [APROVADO] Menciona que o usuário pode pausar e continuar depois (embora a persistência de rascunho entre sessões precise de atenção, veja P1).

### 2.3 Stepper dos 6 Territórios
- **Sintoma, História, Crenças, Recursos, Segurança**: [APROVADO] Todos possuem telas dedicadas com perguntas reflexivas (itálico) e Textarea para resposta livre.
- **Território dos Traços**: [APROVADO] Integra perguntas qualitativas (Como você reage sob pressão?) com o motor do Big Five operando no backend.
- **Mobile**: [APROVADO] Design limpo, botões de navegação (Voltar/Próximo) acessíveis e barra de progresso no topo.

### 2.4 Salvamento de Progresso
- **Estado Local**: [APROVADO] O estado é mantido no hook durante a jornada.
- **Persistência Final**: [APROVADO] Salva corretamente em `cartografia_psiquica` (metadata_json) e `co_cartografia_profile` ao clicar em "Revelar meu Mapa Vivo".
- **Rascunhos (Drafts)**: [PENDENTE - P1] O hook `useCartografiaEstrutural.ts` possui um `useEffect` com a lógica de carregamento de rascunhos comentada. Atualmente, se o usuário fechar a aba no meio, os dados não persistidos no DB serão perdidos.

### 2.5 Mapa Vivo Final
- **Síntese e Territórios**: [APROVADO] O resultado exibe a `SaidaSimbolica` (Força, Tensão, Convite) e a `CamadaCidadela` (Mapa SVG, Distrito Dominante).
- **Atenção e Segurança**: [APROVADO] Card específico exibindo o nível derivado deterministicamente do motor central.
- **Nota Ética**: [APROVADO] Exibida de forma clara em todas as camadas de resultado.

## 3. Análise Ética de Linguagem
- **Termos Encontrados**:
  - "diagnóstico": Encontrado apenas em avisos de exclusão ("Este é o seu Mapa Vivo estrutural. Ele não é um diagnóstico..."). [SEGURO]
  - "crise": Encontrado apenas em avisos de segurança ("Em caso de crise... procure um profissional"). [SEGURO]
- **Recomendação**: Manter o termo "Nível de Atenção" no lugar de "Risco Clínico", o que já foi implementado.

## 4. Coerência com Outras Ferramentas
- **Big Five**: [APROVADO] Não foi duplicado. É usado como insumo para o cálculo de médias no backend do stepper.
- **Atlas de Arquétipos**: [APROVADO] Integrado via `montarProfileJson` como camada de personificação, sem gerar conclusões automáticas conflitantes.

## 5. Pendências e Riscos

| Ref | Descrição | Prioridade | Status |
|---|---|---|---|
| **P1** | **Persistência de Rascunho (Draft)**: O carregamento de progresso anterior está desabilitado no hook. Se a usuária sair na metade, perde as respostas. | P1 | Pendente |
| **P2** | **Navegação Progressiva no Mobile**: A barra de progresso não exibe o nome do território atual de forma explícita no mobile (apenas o número). | P2 | Recomendação |
| **P3** | **Validação de Tamanho de Resposta**: Algumas etapas permitem avançar com pouco texto (mínimo 5 caracteres). Para um produto premium, pode ser interessante sugerir mais profundidade. | P2 | Sugestão |

## 6. Conclusão
A Fase 3 está **APROVADA TÉCNICAMENTE**. O sistema de acesso via assinatura está operante e a experiência de mapeamento qualitativo está fluida e integrada ao motor central oracular.

**Próxima Etapa Recomendada**: Reativar a persistência de rascunhos (Drafts) na tabela de metadados para garantir que a promessa de "pausar e continuar depois" seja cumprida entre sessões de navegador diferentes.
