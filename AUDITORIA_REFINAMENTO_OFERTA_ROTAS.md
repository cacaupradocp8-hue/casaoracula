# Relatório de Auditoria e Refinamento: Rotas da Casa Orácula

## 1. Problemas Encontrados (Pré-refinamento)
- **Visual Engessado:** Excesso de seções centralizadas sem variação de ritmo.
- **Hierarquia Editorial Fraca:** Falta de destaque para os pilares principais das Rotas.
- **Terminologia Legada:** Persistência de termos como "Clube Oracular" e "Clube de Leitura".
- **Condução Comercial:** CTAs pouco persuasivos e falta de um fluxo lógico de decisão.
- **Layout de Template:** A página parecia uma sequência de blocos genéricos, sem o toque "premium" e editorial desejado.

## 2. Arquivos Alterados
- `src/pages/Planos.tsx`: Organização geral e fluxo da página.
- `src/components/planos/PlanosHero.tsx`: Redesenho completo do Hero com novos CTAs e impacto visual.
- `src/components/planos/PlanosProblema.tsx`: Ajuste para layout de duas colunas com foco em "atravessar vs acumular".
- `src/components/planos/PlanosExplicacao.tsx`: Refinamento da explicação do método e funcionamento em grid editorial.
- `src/components/planos/PlanosRotasDetalhes.tsx`: Reestruturação completa das estações, benefícios e entregáveis.
- `src/components/planos/PlanosClubeCards.tsx`: Atualização dos cards de planos com foco em "Habitar as Rotas" e nomenclatura oficial.
- `src/components/planos/PlanosFormacao.tsx`: Refinamento do bloco de upgrade para a Formação.

## 3. Nova Hierarquia Visual & Seções
- **Hero de Impacto:** Headline focada em "rota" vs "conteúdo solto".
- **Problema Editorial:** Layout assimétrico em duas colunas.
- **Método & Direção:** Seção "Como funcionam as Rotas" com grid de 4 pilares.
- **Primeira Estação (Lobos):** Destaque visual para "Mulheres que Correm com os Lobos" com a pergunta central.
- **O que está incluso:** 4 blocos robustos (Mapa, Leitura, Prática, Registro).
- **Planos Premium:** Cards com melhor contraste, CTAs claros e nomenclatura de "Habitar".
- **Próximo Nível (Formação):** Convite estratégico para quem quer conduzir.

## 4. Checklist de CTAs
- **Mantidos/Refinados:** "Entrar nas Rotas" (Scroll), "Ver como funciona" (Scroll), "Conhecer a Formação".
- **Nomenclatura Atualizada:** 
  - "Entrar no Clube" -> "Entrar nas Rotas" / "Habitar por um ano"
  - "Clube Oracular" -> "Rotas da Casa Orácula"
  - "Clube Mensal/Anual" -> "Rotas Mensais/Anuais"
- **Removidos:** Termos genéricos e placeholders técnicos.

## 5. Pontos de Dependência (Banco/Admin)
- As ofertas reais (preços, links de checkout) continuam sendo puxadas pelo hook `useOfertas`, garantindo integridade técnica.
- Sugestão: Atualizar os campos `nome` e `texto_botao` no banco (via Admin) para refletir a nova nomenclatura ("Rotas Mensais", "Habitar por um ano", etc.).

## 6. Checklist de Experiência
- **Mobile:**
  - Fontes ajustadas para leitura fluida em telas pequenas.
  - CTAs empilhados com largura total para facilitar o toque.
  - Grid responsivo (1 coluna).
- **Desktop:**
  - Uso de grids de 2, 3 e 4 colunas para ritmo visual.
  - Efeitos de hover e animações de entrada (`framer-motion`).
  - Margens generosas (respiro editorial).

---
**Critério de Aprovação:** A página agora conduz a visitante através de uma narrativa de travessia, saindo do "acúmulo de conteúdo" para a "habitação de uma jornada" com método claro.
