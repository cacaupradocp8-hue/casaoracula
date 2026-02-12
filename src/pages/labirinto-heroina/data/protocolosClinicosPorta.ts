// ============================================
// DADOS CLÍNICOS POR PORTA — LABIRINTO DA HEROÍNA
// Roteiro clínico, versão de grupo e indicações
// ============================================

export interface IndicacaoClinica {
  quandoUsar: string;
  cuidados: string;
  constelacao: string;
}

export interface EtapaGrupo {
  titulo: string;
  descricao: string;
  tempo?: string;
}

export interface ProtocoloPorta {
  orientacaoGrupo: string;
  etapasGrupo: EtapaGrupo[];
  roteiroClinico: string[];
  indicacao: IndicacaoClinica;
  seguranca: string;
}

// Roteiro clínico padrão (aplicável a todas as portas)
export const ROTEIRO_CLINICO_BASE = [
  "Abertura clínica (5 min) — Checagem de presença corporal. Nomeação da Porta (sem explicação longa).",
  "Revelação da Porta (5 min) — Mostrar a carta (imagem completa). Ler Tema Central + Pergunta-chave.",
  "Exercício guiado (15–20 min) — Execução do exercício do caderno. Silêncio ativo. Facilitadora observa, não conduz demais.",
  "Elaboração (10–20 min) — Individual: aprofundar respostas. Grupo: partilha mediada sem análise cruzada.",
  "Integração ritual (5 min) — Ritual breve da Porta. Ancoragem corporal.",
  "Registro (5 min) — Modo Profissional: salvar no Mapa (crença, emoção, padrão, direção). Modo Pessoal: registro simples.",
  "Fechamento (5 min) — Retorno ao corpo. Orientação de cuidado pós-sessão.",
];

// Estrutura fixa de grupo (serve para todas as Portas)
export const ESTRUTURA_GRUPO_BASE = [
  { titulo: "Abertura", descricao: "Aterramento + enunciação da Porta.", tempo: "5min" },
  { titulo: "Ativação coletiva", descricao: "Pergunta-chave lida em voz alta.", tempo: "10min" },
  { titulo: "Trabalho individual silencioso", descricao: "Escrita/desenho.", tempo: "10–15min" },
  { titulo: "Partilha mediada", descricao: "Escuta sem debate.", tempo: "20–30min" },
  { titulo: "Integração", descricao: "Gesto simbólico / ritual breve.", tempo: "5min" },
  { titulo: "Fechamento", descricao: "Retorno ao corpo.", tempo: "5min" },
];

// Indicações clínicas por faixa de portas
export const INDICACOES_POR_FAIXA = [
  { faixa: "P1–P2", label: "Início de processo", descricao: "Triagem, transição, abertura de ciclo." },
  { faixa: "P3–P8", label: "Trabalho de base", descricao: "Trauma leve/moderado, defesas, descida." },
  { faixa: "P9–P12", label: "Consciência e expressão", descricao: "Consciência, decisão, expressão." },
  { faixa: "P13–P14", label: "Encerramento", descricao: "Alta simbólica, integração, encerramento." },
];

// Critérios de segurança obrigatórios
export const CRITERIOS_SEGURANCA = [
  "Não avançar de P3–P8 sem checagem de recursos.",
  "P7 (Ferida) NUNCA é primeira sessão.",
  "Sempre fechar com integração corporal.",
  "Ninguém interpreta a fala da outra. A facilitadora costura, não explica.",
];

// Uso em Constelação Simbólica (orientação geral)
export const CONSTELACAO_ORIENTACAO = {
  campo: "Porta atua como campo-tema.",
  exercicio: "Exercício feito antes da movimentação.",
  ritual: "Ritual usado como ancoragem pós-campo.",
};

export const PROTOCOLOS_POR_PORTA: Record<string, ProtocoloPorta> = {
  "O Chamado": {
    orientacaoGrupo: "Porta de abertura ideal para grupos iniciantes. O tema é acessível e não exige vulnerabilidade profunda. Permita que cada participante nomeie seu incômodo sem precisar explicar.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Círculo de pé. Pés no chão. 3 respirações coletivas.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "'O que em mim pede passagem agora?' Silêncio de 2 minutos.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Cada participante escreve em silêncio sobre o chamado que ouve.", tempo: "20min" },
      { titulo: "Partilha mediada", descricao: "Cada uma compartilha UMA palavra ou frase. Sem comentários das demais.", tempo: "20min" },
      { titulo: "Ritual de integração", descricao: "Cada participante lê uma frase (não a história).", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Mãos no coração. Respiração de encerramento em grupo.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura suave — esta porta não exige exposição profunda.",
      "Revelação lenta — permita que o tema 'incômodo' ressoe antes de guiar.",
      "Exercício focado na escuta interna, não na narrativa.",
      "Elaboração breve — o chamado não precisa ser explicado, apenas nomeado.",
      "Integração corporal — mãos nos ouvidos, depois no coração.",
      "Registro mínimo — uma frase é suficiente.",
      "Orientação: 'Nos próximos dias, observe o que insiste em aparecer.'",
    ],
    indicacao: {
      quandoUsar: "Início de processo. Primeira sessão ou reabertura de ciclo.",
      cuidados: "Ideal como primeira porta. Não forçar nomeação — o chamado pode ser vago.",
      constelacao: "Posicionar como porta de entrada no campo. Observar para onde o corpo se inclina.",
    },
    seguranca: "Porta segura para uso inicial. Baixo risco de ativação intensa.",
  },

  "A Ruptura": {
    orientacaoGrupo: "Porta que pode gerar desconforto. A facilitadora deve sustentar o campo sem tentar 'resolver'. O tema da quebra é universal mas mobilizante.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Sentadas em círculo. Pés plantados. Respiração profunda com som na expiração.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "Listar pactos invisíveis (silencioso).", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Escrever ou desenhar o que se quebrou. Permitir emoção sem intervir.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Cada uma compartilha se desejar. Regra: 'Eu ouço sem consertar.'", tempo: "25min" },
      { titulo: "Ritual de integração", descricao: "Rasgar papel em conjunto (ritual coletivo).", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Abraço em si mesma. Respiração de recolhimento.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com checagem de recursos — pergunte se a cliente se sente pronta.",
      "Revelação direta — o tema da ruptura pede clareza, não suavização.",
      "Exercício focado em nomear a quebra, não em explicá-la.",
      "Elaboração com atenção ao corpo — observe sinais de dissociação.",
      "Integração com gesto de soltura (mãos abertas).",
      "Registro: o que se partiu e o que permanece.",
      "Orientação: 'Não tente reconstruir antes de sentir o vazio.'",
    ],
    indicacao: {
      quandoUsar: "Quando a cliente relata uma perda, separação ou desmoronamento recente.",
      cuidados: "Checar se há rede de apoio. Não usar em luto agudo recente (menos de 30 dias).",
      constelacao: "A carta pode representar o ponto de cisão. Observar o que fica de cada lado.",
    },
    seguranca: "Risco moderado. Checar recursos antes. Não apressar a travessia.",
  },

  "A Descida": {
    orientacaoGrupo: "Porta de profundidade. Requer grupo já vinculado. Não indicada para primeiros encontros. A facilitadora deve estar presente e firme.",
    etapasGrupo: [
      { titulo: "Aterramento profundo", descricao: "Meditação guiada de descida: escada, caverna ou rio. Olhos fechados.", tempo: "15min" },
      { titulo: "Ativação coletiva", descricao: "Nomear emoção evitada (sem relato). Silêncio longo.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Desenho ou escrita simbólica do que encontram ao descer. Sem palavras racionais.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Partilha voluntária. Ninguém é obrigada a falar. Presença é suficiente.", tempo: "20min" },
      { titulo: "Ritual de integração", descricao: "Respiração guiada curta.", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Movimento de ascensão: levantar-se lentamente. Espreguiçar. Abrir os olhos.", tempo: "10min" },
    ],
    roteiroClinico: [
      "Abertura com protocolo de segurança — recurso de âncora (objeto, memória segura).",
      "Revelação lenta — permitir que a imagem da descida se forme antes de guiar.",
      "Exercício com linguagem simbólica, não racional.",
      "Elaboração com atenção redobrada ao corpo e ao ritmo respiratório.",
      "Integração obrigatória com retorno consciente ('subir a escada').",
      "Registro simbólico — imagens, não explicações.",
      "Orientação: autocuidado reforçado. Hidratação, descanso, natureza.",
    ],
    indicacao: {
      quandoUsar: "Meio de processo. Quando a cliente já demonstrou capacidade de sustentar desconforto.",
      cuidados: "NÃO usar como primeira sessão. Checar histórico de trauma. Ter plano de contenção.",
      constelacao: "Posicionar no centro do campo como eixo gravitacional. Observar o que resiste a descer.",
    },
    seguranca: "Risco alto. Exige checagem de recursos. Ter protocolo de contenção disponível.",
  },

  "O Labirinto": {
    orientacaoGrupo: "Porta que trabalha repetição e confusão. Excelente para grupos que se percebem 'andando em círculos'. A facilitadora não oferece saída — sustenta a desorientação.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Caminhar em círculo no espaço, lentamente, sem destino.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "Desenhar o ciclo repetitivo.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Mapear 3 padrões repetitivos. Desenhar o labirinto pessoal.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Compartilhar o padrão mais visível. Sem conselho.", tempo: "20min" },
      { titulo: "Ritual de integração", descricao: "Marcar a saída possível no desenho. Gesto de saída.", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Parar. Ficar de pé. Sentir os pés. 'Eu estou aqui agora.'", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com reconhecimento: 'Repetir não é falhar, é buscar compreensão.'",
      "Revelação com mapa visual — convidar a cliente a desenhar seus ciclos.",
      "Exercício focado em padrão, não em culpa.",
      "Elaboração com curiosidade, não frustração.",
      "Integração: nomear a saída que 'finjo não ver'.",
      "Registro dos padrões identificados.",
      "Orientação: 'Observe sem tentar mudar esta semana.'",
    ],
    indicacao: {
      quandoUsar: "Quando a cliente relata estagnação, repetição ou 'andar em círculos'.",
      cuidados: "Cuidado com autoculpabilização. Reforçar que repetir é humano.",
      constelacao: "Dispor a carta em espiral. Observar onde o movimento para.",
    },
    seguranca: "Risco moderado. Pode gerar frustração. Sustentar sem resolver.",
  },

  "O Osso": {
    orientacaoGrupo: "Porta de essência e nudez psíquica. Grupo precisa de confiança estabelecida. Trabalho silencioso e profundo.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Meditação de 'tirar camadas': cada respiração solta uma proteção.", tempo: "15min" },
      { titulo: "Ativação coletiva", descricao: "Três palavras essenciais.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Escrever sobre o que é irredutível em si. O que resta quando tudo cai.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Partilha breve e essencial. Uma frase por participante.", tempo: "15min" },
      { titulo: "Ritual de integração", descricao: "Guardar as palavras (bolso/envelope). Sentir a estrutura que sustenta.", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Postura ereta. Dignidade do osso. Silêncio.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com convite à nudez simbólica — tirar disfarces com gentileza.",
      "Revelação com pausa longa — deixar o silêncio trabalhar.",
      "Exercício de subtração: o que sobra quando tiro tudo?",
      "Elaboração mínima — o osso não precisa de muitas palavras.",
      "Integração tátil — tocar a própria estrutura.",
      "Registro: uma verdade irredutível.",
      "Orientação: 'Viva esta semana a partir do osso, não da máscara.'",
    ],
    indicacao: {
      quandoUsar: "Meio a fim de processo. Quando já houve descida e fragmentação.",
      cuidados: "Pode gerar vulnerabilidade intensa. Checar se a cliente tem onde se apoiar.",
      constelacao: "Posicionar como centro fixo. O que gravita ao redor do osso?",
    },
    seguranca: "Risco alto de vulnerabilidade. Não usar sem vínculo terapêutico estabelecido.",
  },

  "A Memória": {
    orientacaoGrupo: "Porta ancestral. Excelente para círculos de mulheres. O trabalho é coletivo por natureza — todas carregam heranças.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Invocar as ancestrais: 'Eu venho de...' Cada uma nomeia uma mulher da sua linhagem.", tempo: "15min" },
      { titulo: "Ativação coletiva", descricao: "Escrever 'essa história é de quem?'", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Escrever sobre a herança emocional carregada. O que é meu e o que é herdado?", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Partilha em duplas primeiro, depois no círculo.", tempo: "25min" },
      { titulo: "Ritual de integração", descricao: "Frase de liberação em coro: 'Eu honro o que veio antes. Eu escolho o que levo adiante.'", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Reverência. Inclinação do tronco. Gratidão ao que sustenta.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com genograma simbólico breve — quem são as mulheres da linhagem?",
      "Revelação com conexão ancestral — a porta não é só sobre a cliente.",
      "Exercício de diferenciação: o que é meu, o que é herança?",
      "Elaboração com cuidado — memórias podem ativar traumas transgeracionais.",
      "Integração de honra e escolha — honrar sem repetir.",
      "Registro da herança consciente.",
      "Orientação: 'Observe o que muda quando você separa sua história da história delas.'",
    ],
    indicacao: {
      quandoUsar: "Qualquer momento do processo. Especialmente potente em temas familiares.",
      cuidados: "Atenção a traumas transgeracionais. Não forçar memórias.",
      constelacao: "Ideal para constelação. A carta pode representar as ancestrais no campo.",
    },
    seguranca: "Risco moderado. Pode ativar conteúdo transgeracional intenso.",
  },

  "A Ferida": {
    orientacaoGrupo: "Porta de alta intensidade. NUNCA usar como primeira aplicação em grupo. Requer grupo maduro e facilitadora experiente.",
    etapasGrupo: [
      { titulo: "Aterramento reforçado", descricao: "Recurso de âncora: cada participante segura um objeto pessoal de segurança.", tempo: "15min" },
      { titulo: "Ativação coletiva", descricao: "Identificar a dor sem narrar fatos. Silêncio de 3 minutos.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Carta curta não compartilhada. Localizar a ferida no corpo.", tempo: "30min" },
      { titulo: "Partilha mediada", descricao: "Partilha voluntária e breve. A facilitadora sustenta sem interpretar.", tempo: "20min" },
      { titulo: "Ritual de integração", descricao: "Mãos sobre a parte do corpo onde a ferida vive. 'Eu te vejo. Eu te sustento.'", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Autoabraço prolongado. Respiração de colo. Cobertor simbólico.", tempo: "10min" },
    ],
    roteiroClinico: [
      "Abertura com protocolo de segurança completo — âncora, recurso, plano de contenção.",
      "Revelação NUNCA abrupta — preparar o campo antes de nomear a ferida.",
      "Exercício somático — localizar no corpo antes de verbalizar.",
      "Elaboração mínima — não explorar a ferida, apenas reconhecê-la.",
      "Integração obrigatória — não encerrar sem gesto de cuidado.",
      "Registro: 'A ferida que vi' e 'O que ela precisa'.",
      "Orientação: autocuidado intensivo. Contato em 24h se necessário.",
    ],
    indicacao: {
      quandoUsar: "Meio de processo. APÓS descida e APÓS checagem de recursos.",
      cuidados: "NUNCA como primeira sessão. NUNCA sem vínculo. Ter plano de contenção.",
      constelacao: "Posicionar com cuidado. Pode ser representada mas não confrontada diretamente.",
    },
    seguranca: "⚠️ RISCO ALTO. Porta de descida profunda. Checagem de recursos obrigatória. Não avançar sem integração.",
  },

  "A Defesa": {
    orientacaoGrupo: "Porta de reconhecimento, não de desmonte. O grupo NÃO deve pressionar ninguém a 'baixar a guarda'. A defesa foi necessária — honrá-la antes de questioná-la.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Postura de proteção consciente: braços cruzados, depois abertos. Sentir a diferença.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "Listar defesas frequentes.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Para cada defesa: 'O que protege?' e 'O que impede?'", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Compartilhar UMA defesa reconhecida. Grupo acolhe sem sugerir mudança.", tempo: "20min" },
      { titulo: "Ritual de integração", descricao: "Agradecer a defesa + nomear novo recurso: 'Obrigada por me proteger.'", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Abrir e fechar as mãos alternadamente. 'Eu posso proteger E abrir.'", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura honrando a defesa — 'Sua armadura teve função. Estamos aqui para conhecê-la, não arrancá-la.'",
      "Revelação com gentileza — a defesa resiste a ser nomeada.",
      "Exercício de mapeamento: quais defesas, quando surgiram, o que protegem.",
      "Elaboração com curiosidade, não julgamento.",
      "Integração de gratidão — honrar antes de soltar.",
      "Registro: armaduras reconhecidas e o que protegem.",
      "Orientação: 'Observe quando a defesa ativa esta semana. Não tente mudar, apenas observe.'",
    ],
    indicacao: {
      quandoUsar: "Após trabalho com a ferida. Quando padrões defensivos são visíveis.",
      cuidados: "Não forçar soltura. A defesa cai quando não é mais necessária, não quando é arrancada.",
      constelacao: "A carta pode representar a guardiã da porta. O que ela protege?",
    },
    seguranca: "Risco moderado. Respeitar o ritmo. Não desmontar defesas sem recurso alternativo.",
  },

  "O Espelho": {
    orientacaoGrupo: "Porta de autorreconhecimento. Pode gerar desconforto com a autoimagem. A facilitadora sustenta o olhar sem corrigir.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Olhar as próprias mãos por 2 minutos em silêncio. Depois, fechar os olhos.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "Responsabilidade sem culpa: 'O que vocês veem quando se olham sem julgamento?'", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Autodescrição em terceira pessoa: 'Ela é...' Sem censura.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Opcionalmente, em duplas: cada uma lê sua descrição para a outra. Sem comentário.", tempo: "20min" },
      { titulo: "Ritual de integração", descricao: "Olhar no espelho (ou objeto refletivo). Dizer uma qualidade que aceita em si.", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Mãos no rosto. Toque gentil. 'Eu me vejo.'", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura sem espelho literal — o espelho é interno.",
      "Revelação com convite à presença, não à análise.",
      "Exercício de autodescrição sem filtro crítico.",
      "Elaboração do que é difícil de aceitar e do que é fácil de ignorar.",
      "Integração de aceitação — não mudança.",
      "Registro: o que vi quando parei de julgar.",
      "Orientação: 'Pratique se olhar com curiosidade, não com correção.'",
    ],
    indicacao: {
      quandoUsar: "Meio a fim de processo. Quando há material suficiente para auto-observação.",
      cuidados: "Atenção a transtornos de autoimagem. Ajustar abordagem se necessário.",
      constelacao: "Posicionar frente a frente com a cliente no campo. O que o espelho revela?",
    },
    seguranca: "Risco moderado. Pode mobilizar questões de autoimagem e autoestima.",
  },

  "A Escolha": {
    orientacaoGrupo: "Porta de responsabilidade. O grupo sustenta sem opinar. Cada escolha é soberana.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "De pé. Sentir o peso nos dois pés igualmente. Centro de gravidade.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "Decisão mínima possível: 'Qual decisão vocês estão adiando?'", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Escrever a decisão adiada e o que impede. O que preciso abandonar para avançar?", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Compartilhar o compromisso, não o medo. O grupo testemunha.", tempo: "20min" },
      { titulo: "Ritual de integração", descricao: "Datar a escolha. Dar um passo à frente literalmente. 'Eu escolho.'", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Postura firme. Olhar para frente. Respiração de decisão.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com normalização — adiar é humano, mas tem custo.",
      "Revelação focada em responsabilidade, não em culpa.",
      "Exercício de clarificação: o que ganho ficando? O que ganho avançando?",
      "Elaboração sem pressa — a escolha madura não é impulsiva.",
      "Integração com gesto de compromisso.",
      "Registro: a escolha feita e o que foi solto.",
      "Orientação: 'Uma escolha pequena esta semana na direção que você sabe.'",
    ],
    indicacao: {
      quandoUsar: "Transição no processo. Quando há clareza suficiente para decidir.",
      cuidados: "Não pressionar decisão. A escolha é da cliente, não da terapeuta.",
      constelacao: "Posicionar com dois caminhos. A cliente caminha na direção que escolhe.",
    },
    seguranca: "Risco baixo a moderado. Pode gerar ansiedade decisional.",
  },

  "A Integração": {
    orientacaoGrupo: "Porta de reunião. Excelente para grupos em fechamento de ciclo. O trabalho é de acolhimento das partes.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Abraço em si mesma. Reunir braços, pernas, tronco. 'Todo meu corpo está aqui.'", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "Diálogo entre duas partes internas: 'Que parte rejeitada pede para retornar?'", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Listar partes integradas e partes ainda excluídas. Diálogo entre elas.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Cada participante nomeia o que está integrando. O grupo acolhe.", tempo: "20min" },
      { titulo: "Ritual de integração", descricao: "Parágrafo de síntese. Juntar as duas mãos: 'Eu me reúno.'", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Balanço suave do corpo. Embalo. Acolhimento.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com reconhecimento do caminho percorrido.",
      "Revelação como celebração — o que foi separado pode se reunir.",
      "Exercício de diálogo entre partes: luz e sombra, força e fragilidade.",
      "Elaboração da coexistência — não resolver, mas permitir.",
      "Integração simbólica — gesto de união.",
      "Registro: o que se reuniu e o que ainda precisa de tempo.",
      "Orientação: 'Permita que as contradições coexistam.'",
    ],
    indicacao: {
      quandoUsar: "Fim de processo ou fechamento de ciclo.",
      cuidados: "Não forçar integração prematura. Respeitar partes que resistem.",
      constelacao: "Reunir cartas dispersas no campo. O que acontece quando se aproximam?",
    },
    seguranca: "Risco baixo. Porta de acolhimento. Sustentação natural.",
  },

  "A Voz": {
    orientacaoGrupo: "Porta de expressão. Pode ser muito mobilizante em grupo. Garantir espaço seguro para que cada voz seja ouvida sem interrupção.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Humming coletivo (vibrar com a boca fechada). Sentir a vibração no peito.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "Verdade não dita (segura): 'O que vocês precisam dizer que nunca disseram?'", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Escrever a mensagem não dita. Para quem é? O que acontece se eu disser?", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Cada participante lê em voz baixa (ou escrita). Grupo testemunha em silêncio.", tempo: "25min" },
      { titulo: "Ritual de integração", descricao: "Dizer em voz baixa (ou escrita): 'Minha voz importa.' O grupo ecoa.", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Mão na garganta. Respiração. Silêncio honrado.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com permissão — 'Aqui sua voz é segura.'",
      "Revelação com atenção ao corpo — garganta, mandíbula, peito.",
      "Exercício de nomeação: o não-dito e seus destinatários.",
      "Elaboração com cuidado — algumas verdades precisam de contenção antes de expressão.",
      "Integração vocal — som, não necessariamente palavra.",
      "Registro: o que foi dito e como o corpo respondeu.",
      "Orientação: 'Pratique dizer uma verdade pequena por dia.'",
    ],
    indicacao: {
      quandoUsar: "Quando há conteúdo silenciado identificado. Após trabalho com defesa.",
      cuidados: "Atenção a histórico de silenciamento violento. Não forçar expressão.",
      constelacao: "A carta pode representar a voz silenciada. Onde ela está no campo?",
    },
    seguranca: "Risco moderado. Pode ativar memórias de silenciamento. Sustentar.",
  },

  "O Retorno": {
    orientacaoGrupo: "Porta de volta ao mundo. Celebrativa e integradora. Excelente para penúltimos encontros de grupo.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Caminhar pelo espaço como quem chega a um lugar novo. Observar o entorno.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "Onde aplicar o aprendido: 'O que vocês trazem de volta desta travessia?'", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Escrever: O que trago de volta? Como vou viver diferente? Compromisso prático.", tempo: "20min" },
      { titulo: "Partilha mediada", descricao: "Cada participante compartilha seu dom de retorno. O grupo celebra.", tempo: "25min" },
      { titulo: "Ritual de integração", descricao: "Compromisso prático. Cada uma presenteia o grupo com uma palavra.", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "De pé. Postura de quem chegou. Sorriso interno.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com reconhecimento da jornada — 'Você atravessou.'",
      "Revelação como celebração — não como tarefa.",
      "Exercício de nomeação do dom: o que essa jornada me deu?",
      "Elaboração de como viver a partir de agora com o que foi aprendido.",
      "Integração de compromisso consigo mesma.",
      "Registro: o dom do retorno e o compromisso.",
      "Orientação: 'Viva a partir do que aprendeu, não do que sofreu.'",
    ],
    indicacao: {
      quandoUsar: "Fim de processo. Quando há integração suficiente.",
      cuidados: "Não apressar o retorno. Verificar se o processo realmente se fechou.",
      constelacao: "A carta retorna ao ponto de partida. O que mudou?",
    },
    seguranca: "Risco baixo. Porta de celebração e fechamento.",
  },

  "A Guardiã": {
    orientacaoGrupo: "Porta de encerramento e sabedoria incorporada. Ideal para último encontro de grupo ou ritual de formatura.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Meditação da guardiã: 'Imagine a mulher que você se tornou de pé à sua frente.'", tempo: "15min" },
      { titulo: "Ativação coletiva", descricao: "Reconhecer o que agora sustenta: 'Que sabedoria guia os passos de vocês?'", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Carta à mulher que começou. Frase-síntese da jornada. Nomeação da sabedoria.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Cada participante lê sua carta ou compartilha sua sabedoria. Ritual de encerramento.", tempo: "25min" },
      { titulo: "Ritual de integração", descricao: "Cada uma recebe um símbolo (pedra, fita, vela) como marca da travessia completa.", tempo: "10min" },
      { titulo: "Fechamento corporal", descricao: "Círculo final. Mãos dadas. Silêncio. Reverência mútua.", tempo: "10min" },
    ],
    roteiroClinico: [
      "Abertura com solenidade — este é um fechamento sagrado.",
      "Revelação como coroação — a cliente se reconhece como guardiã de si mesma.",
      "Exercício de nomeação: 'A guardiã que nasceu em mim se chama...'",
      "Elaboração da sabedoria incorporada — não teoria, vivência.",
      "Integração com gesto de autoridade gentil.",
      "Registro: a sabedoria da guardiã e o conselho para quem começa.",
      "Orientação: 'Você agora é guardiã da sua própria jornada.'",
    ],
    indicacao: {
      quandoUsar: "Última sessão do ciclo. Fechamento definitivo.",
      cuidados: "Não usar antes do tempo. A guardiã nasce, não é imposta.",
      constelacao: "A carta é colocada atrás da cliente. Apoio e sabedoria incorporada.",
    },
    seguranca: "Risco baixo. Porta de sabedoria e encerramento. Sustentação natural.",
  },
};
