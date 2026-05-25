# Planejamento: Primeira Leitura Orácula

## 1. Status do planejamento

**`PRIMEIRA_LEITURA_ORACULA_PLANNED`**

Este documento estabelece as bases técnicas, narrativas e estratégicas para a criação da **Primeira Leitura Orácula**. Esta etapa é estritamente de planejamento e documentação, sem qualquer alteração de código, criação de rotas ou modificação de banco de dados.

## 2. Decisão estratégica

A arquitetura de experiências da Casa Orácula é organizada de forma a preservar a profundidade de cada portal, evitando sobreposições funcionais:

| Experiência | Função |
| :--- | :--- |
| **Primeira Leitura Orácula** | Porta pública gratuita da Casa; experiência narrativa e de percepção inicial. |
| **Quiz da Voz** | Onboarding identitário da Escola/Formação; focado na identidade pedagógica. |
| **Cidadela** | Cartografia profunda da habitante; espaço de revelação e GPS simbólico. |
| **Clube / Rotas da Casa** | Travessias, acervo e experiência recorrente; sustentação do processo. |
| **Sala de Visita** | Limiar público e espaço de entrada; ante-sala sensorial da Casa. |
| **Experiência Gratuita** | Roadmap informativo de entrada; guia visual do caminho da habitante. |

## 3. Rota recomendada

A rota principal futura proposta é:

` /sala-da-visitante/primeira-leitura `

**Justificativa:** Esta estrutura preserva a **Sala de Visita** como o espaço simbólico de entrada ("Limiar"), tratando a Primeira Leitura como uma subexperiência de recepção. Futuramente, pode-se avaliar o uso de um alias curto como `/primeira-leitura` para facilitar o compartilhamento em redes sociais, mas a estrutura lógica deve permanecer vinculada à Sala de Visita.

## 4. Princípios da experiência

A Primeira Leitura Orácula deve seguir rigorosamente os seguintes princípios:

- **Pública e Gratuita:** Acessível sem necessidade de login imediato.
- **Simbólica e Contemplativa:** Uso de imagens e metáforas em vez de dados técnicos.
- **Pedagógica:** Introduz o modo de pensar e ler da Casa Orácula.
- **Premium:** Acabamento visual de alta qualidade, condizente com a marca.
- **Curta e Visual:** Experiência de poucos minutos com foco em interface limpa.
- **Estado Local:** Processamento exclusivamente no frontend (React State) na fase inicial.
- **Segurança de Dados:** Sem persistência inicial no Supabase, sem IA/Syntheia e sem rastreamento de dados sensíveis.

## 5. O que a experiência NÃO é

É imperativo que a experiência **não** seja descrita ou tratada como:

- Diagnóstico clínico ou psicológico.
- Teste de personalidade clínico.
- Avaliação de saúde mental.
- Triagem terapêutica ou prontuário.
- Laudo ou score psicológico.
- Recomendação de tratamento ou cura.
- Substituto para acompanhamento profissional qualificado.

## 6. Narrativa base

A narrativa desloca o foco da "identidade" para a "percepção":

> “Antes de entrar na Casa, a visitante observa uma situação simbólica e percebe como sua escuta se organiza diante dela.”

Em vez de perguntar "Quem você é?", a experiência pergunta: **“Como você tende a ler uma travessia?”** ou **“Onde seu olhar pousa quando o mistério se apresenta?”**.

## 7. Fluxo proposto

1.  **Limiar:** Boas-vindas sensorial e convite ao silêncio.
2.  **Caso Simbólico Ficcional:** Apresentação de uma cena curta e arquetípica.
3.  **Primeira Pergunta de Leitura:** Reação espontânea da visitante diante da cena.
4.  **Segunda Pergunta Condicional:** Refinamento da percepção baseada na primeira resposta.
5.  **Resultado Simbólico:** Apresentação de uma tendência de leitura (ex: "A Escuta das Sombras", "O Olhar da Teia", etc.).
6.  **Escolha de Caminho:** CTAs claros para o Quiz da Voz (Escola) ou Planos (Clube/Cidadela).

## 8. Componentes futuros propostos

A estrutura de arquivos prevista para a implementação futura (Fase 3) é:

- `src/pages/PrimeiraLeituraPage.tsx`: Container da página e gerencial de estado local.
- `src/components/primeira-leitura/LimiarIntro.tsx`: Tela de abertura e contexto.
- `src/components/primeira-leitura/CasePresentation.tsx`: Exposição da narrativa/imagem central.
- `src/components/primeira-leitura/QuestionStep.tsx`: Componente genérico para as escolhas.
- `src/components/primeira-leitura/ResultCard.tsx`: Exibição da tendência oracular revelada.
- `src/components/primeira-leitura/PathSelector.tsx`: Seção final de direcionamento na Casa.

## 9. Próximo passo recomendado

Iniciar o design visual e a redação do "Caso Simbólico Ficcional", definindo as tendências de leitura que serão apresentadas no resultado final.
