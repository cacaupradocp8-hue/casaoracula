# Relatório de Revisão de Perguntas: CidaDELA Interior

## Objetivo
Restaurar a profundidade e a qualidade das perguntas da cartografia, mantendo a estrutura técnica da CidaDELA Interior e do Método Orácula™.

## Localização das Perguntas
- **Perguntas Atuais:** Estavam definidas no banco de dados, na tabela `big5_oracular_perguntas`, e eram carregadas pelo hook `useBig5Oracular.ts`.
- **Perguntas Antigas:** Foram localizadas no histórico do banco e em versões anteriores da ferramenta (Big Five Oracular), que serviram de base para a restauração.

## Comparação e Mudanças
- **Antes (Fraca):** "Você se considera uma pessoa criativa?" ou perguntas abertas genéricas.
- **Agora (Profunda):** "Quando uma situação perde o sentido habitual, você costuma imaginar novos caminhos ou tenta se adaptar ao que já existe?"
- **Estratégia:** Substituímos perguntas óbvias por dilemas de funcionamento, removendo qualquer tom clínico ou diagnóstico.

## Lista Final de Perguntas (30 totais)

### 1. Abertura Simbólica (Fator: porta_possivel)
*Justificativa: Mapeia a capacidade de imaginação e abertura ao mistério.*
1. Quando uma situação perde o sentido habitual, você costuma imaginar novos caminhos ou tenta se adaptar ao que já existe?
2. Você percebe que a linguagem dos símbolos e contos toca você de forma mais profunda do que explicações lógicas?
3. Diante do desconhecido, sua curiosidade sobre o que pode emergir é maior do que o medo de perder o controle?
4. Você se interessa mais por perguntas que abrem novos horizontes do que por respostas prontas e definitivas?
5. Você sente que existe uma multiplicidade de versões de si mesma esperando para serem exploradas?
6. Mudanças de perspectiva interna costumam atrair você, mesmo quando trazem certa dose de insegurança?

### 2. Estabilidade Interna (Fator: porta_abalo)
*Justificativa: Mapeia a regulação emocional e a reação ao estresse.*
7. Quando algo abala você, sua tendência é pausar e compreender o que aconteceu ou reagir antes de conseguir nomear o que sente?
8. Pequenos imprevistos ou mudanças de planos geram em você uma sensação de desestabilização que demora a passar?
9. Você percebe que seu corpo reage com intensidade física (aperto, cansaço, agitação) diante de tensões emocionais?
10. Em momentos de incerteza, você sente que sua estrutura interna permanece firme ou se vê inundada por dúvidas e ruminações?
11. Você sente que precisa de um esforço constante para manter suas emoções sob controle?
12. Após um conflito ou estresse, você consegue retornar ao seu estado de equilíbrio com relativa facilidade?

### 3. Direção e Iniciativa (Fator: voz_mundo)
*Justificativa: Mapeia o movimento e a ocupação de espaço no mundo.*
13. Quando sente um chamado interno para algo novo, você costuma dar um primeiro passo concreto ou espera ter certeza absoluta antes de se mover?
14. Você se sente confortável ocupando seu espaço e expressando sua verdade, mesmo quando não há uma plateia validando você?
15. Em grupos ou situações sociais, você tende a esperar que os outros tomem a iniciativa ou se sente à vontade para propor o movimento?
16. O medo do julgamento alheio é um fator que frequentemente silencia sua voz ou impede sua ação no mundo?
17. Você sente que sua energia vital se renova quando você está em movimento e realizando suas intenções?
18. Falar o que pensa e sente é para você um ato de presença e afirmação de quem você é?

### 4. Vínculo e Responsividade (Fator: campo_outro)
*Justificativa: Mapeia a relação com o outro e a capacidade de diferenciação.*
19. Você percebe quando está se adaptando excessivamente aos desejos dos outros para evitar conflitos ou garantir pertencimento?
20. Dizer "no" para uma demanda externa gera em você um sentimento de culpa imediato ou uma sensação de deslealdade?
21. Você se sente responsável por sustentar o bem-estar emocional das pessoas ao seu redor, às vezes negligenciando o seu?
22. Em suas relações, você sente que consegue manter sua individualidade ou tende a se diluir nas necessidades do outro?
23. A necessidade de aprovação externa costuma ser o motor principal de suas escolhas relacionais?
24. Você sente as dores e emoções alheias como se fossem suas, tendo dificuldade em estabelecer limites claros?

### 5. Continuidade e Estrutura (Fator: torre_interna)
*Justificativa: Mapeia a constância e o compromisso com processos.*
25. Você consegue sustentar o compromisso com um processo pessoal mesmo quando o entusiasmo inicial ou a novidade desaparecem?
26. A organização de uma rotina é sentida por você como um suporte que te fortalece ou como uma amarra que te limita?
27. Quando inicia algo importante, você consegue criar a estrutura necessária para levar o projeto até o fim?
28. Você costuma cumprir os acordos e promessas que faz para si mesma com a mesma seriedade que cumpre os feitos aos outros?
29. Sua tendência é agir de forma consistente e metódica ou você depende de picos de inspiração para realizar suas tarefas?
30. Diante de uma tarefa complexa, você consegue dividi-la em passos menores e executá-los com constância?

## Impacto Esperado no Mapa Vivo
- **Precisão:** O motor de cálculo volta a receber dados granulares e profundos.
- **Personalização:** A derivação da CidaDELA (cor, símbolo, clima) torna-se mais fiel ao momento psíquico real.
- **Narrativa:** A saída simbólica deixa de ser genérica, pois as tensões (ex: torre alta vs abalo alto) são detectadas com mais clareza.

**Status:** Implementação Concluída no Banco de Dados.
