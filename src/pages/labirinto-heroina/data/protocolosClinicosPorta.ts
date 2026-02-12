// ============================================
// DADOS CLÍNICOS POR PORTA — LABIRINTO DA HEROÍNA
// Roteiro clínico, versão de grupo e indicações
// Base: Maureen Murdock + Autoeficácia (Bandura) + Andragogia + Pareto (80/20)
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
  "Abertura simbólica (5 min) — Checagem de presença corporal. Nomeação da Porta.",
  "Revelação da Porta (5 min) — Mostrar a carta. Ler Tema Central + Pergunta-chave.",
  "Pergunta-chave + escuta (10 min) — Exercício de escuta ativa sem intervenção.",
  "Exercício central 80/20 (15–20 min) — Execução focada. Silêncio ativo.",
  "Ritual de integração (5–10 min) — Ancoragem corporal e simbólica.",
  "Micro-ação e fechamento (5 min) — Definir ação concreta para a semana.",
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

// Indicações clínicas por faixa de portas (Murdock)
export const INDICACOES_POR_FAIXA = [
  { faixa: "P1–P3", label: "Identidade", descricao: "Separação, adaptação, reconhecimento do custo." },
  { faixa: "P4–P7", label: "Descida e Corpo", descricao: "Vazio, desintegração, sombra, reconexão." },
  { faixa: "P8–P9", label: "Feridas Parentais", descricao: "Materna e paterna. Trabalho profundo." },
  { faixa: "P10–P14", label: "Integração e Retorno", descricao: "Reunião interna, autoridade, retorno, criação, heroína." },
];

// Critérios de segurança obrigatórios
export const CRITERIOS_SEGURANCA = [
  "Portas 5–6 (Desintegração/Descida à Deusa): NÃO usar como primeira sessão.",
  "Portas 8–9 (Feridas Parentais): NUNCA sem vínculo terapêutico. Checar recursos.",
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
  // ─────────── PORTA 1 ───────────
  "O Chamado Interno": {
    orientacaoGrupo: "Porta de abertura ideal para grupos iniciantes. O tema é acessível e não exige vulnerabilidade profunda. Permita que cada participante nomeie seu incômodo sem precisar explicar.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Círculo de pé. Pés no chão. 3 respirações coletivas.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "'O que em mim já não aceita mais viver como antes?' Silêncio de 2 minutos.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Escrever 3 situações onde a vida perdeu vitalidade.", tempo: "20min" },
      { titulo: "Partilha mediada", descricao: "Cada uma compartilha UMA palavra ou frase. Sem comentários.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Rasgar ou queimar simbolicamente uma frase antiga.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Mãos no coração. Respiração de encerramento.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura suave — esta porta não exige exposição profunda.",
      "Revelação lenta — permita que o tema 'desconforto' ressoe.",
      "Exercício: 3 situações de perda de vitalidade + sentimento comum.",
      "Elaboração breve — o chamado não precisa ser explicado, apenas nomeado.",
      "Integração: queimar/rasgar frase antiga que não sustenta mais.",
      "Micro-ação: uma escolha mínima que rompa o automatismo.",
      "Orientação: 'Observe o que insiste em aparecer nos próximos dias.'",
    ],
    indicacao: {
      quandoUsar: "Início de processo. Primeira sessão ou reabertura de ciclo.",
      cuidados: "Ideal como primeira porta. Não forçar nomeação — o chamado pode ser vago.",
      constelacao: "Posicionar como porta de entrada no campo. Observar para onde o corpo se inclina.",
    },
    seguranca: "Porta segura para uso inicial. Baixo risco de ativação intensa.",
  },

  // ─────────── PORTA 2 ───────────
  "A Separação do Feminino": {
    orientacaoGrupo: "Porta que trabalha a alienação do sentir. Pode gerar desconforto ao reconhecer o que foi abandonado. A facilitadora sustenta o campo sem tentar resolver.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Sentadas em círculo. Mãos no ventre. Respiração profunda com som na expiração.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "'O que precisei abandonar em mim para ser aceita?' Silêncio.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Identificar quando começou a se afastar do sentir. Ganhos e perdas.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Cada uma compartilha se desejar. Regra: 'Eu ouço sem consertar.'", tempo: "25min" },
      { titulo: "Ritual", descricao: "Toque consciente no corpo — mãos no ventre ou coração.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Abraço em si mesma. Respiração de recolhimento.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com checagem — pergunte se a cliente se sente conectada ao corpo.",
      "Revelação direta — o tema da separação do feminino pede clareza.",
      "Exercício: Linha da Desconexão — quando começou? O que ganhou e perdeu?",
      "Elaboração com atenção ao corpo — observe sinais de dissociação.",
      "Integração: toque consciente no ventre ou coração.",
      "Micro-ação: prática diária de escuta corporal por 3 minutos.",
      "Orientação: 'Não tente reconectar tudo de uma vez. Escute primeiro.'",
    ],
    indicacao: {
      quandoUsar: "Início de processo. Quando a cliente relata desconexão do corpo ou intuição.",
      cuidados: "Checar se há rede de apoio. Pode mobilizar luto pela feminilidade perdida.",
      constelacao: "A carta pode representar o feminino abandonado. Observar distância no campo.",
    },
    seguranca: "Risco baixo a moderado. Checar recursos antes se houver histórico de trauma corporal.",
  },

  // ─────────── PORTA 3 ───────────
  "A Identificação com o Masculino": {
    orientacaoGrupo: "Porta que trabalha performance e endurecimento. Excelente para grupos de mulheres em burnout ou alta performance. Não patologizar a adaptação — honrá-la antes de questioná-la.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Postura de proteção consciente: braços cruzados, depois abertos. Sentir a diferença.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "'Quem eu precisei me tornar para sobreviver?' Escrita silenciosa.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Descrever a persona funcional. O que protege? O que bloqueia?", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Compartilhar UMA defesa reconhecida. Grupo acolhe sem sugerir mudança.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Retirar simbolicamente um 'uniforme' imaginário.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Abrir e fechar as mãos. 'Eu posso proteger E sentir.'", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura honrando a adaptação — 'Sua persona funcional teve razão de existir.'",
      "Revelação com gentileza — a identificação com o masculino é defesa, não falha.",
      "Exercício: Personagem de Sobrevivência — descrever, reconhecer proteção e bloqueio.",
      "Elaboração com curiosidade, não julgamento.",
      "Integração: retirar o 'uniforme' com gratidão.",
      "Micro-ação: suspender uma exigência desnecessária na semana.",
      "Orientação: 'Observe quando a persona ativa esta semana. Não tente mudar, apenas veja.'",
    ],
    indicacao: {
      quandoUsar: "Quando há excesso de performance, controle ou desconexão emocional.",
      cuidados: "Não desmontar defesas sem recurso alternativo. Respeitar o ritmo.",
      constelacao: "A carta pode representar a guardiã/persona. O que ela protege?",
    },
    seguranca: "Risco moderado. Respeitar o ritmo. Não forçar soltura prematura.",
  },

  // ─────────── PORTA 4 ───────────
  "O Sucesso sem Alma": {
    orientacaoGrupo: "Porta de luto simbólico. Trabalha a dissociação entre conquista e sentido. Excelente para grupos de mulheres em transição de carreira.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Silêncio inicial prolongado. Olhos fechados. Sentir o peso do corpo.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "'O que conquistei que não me preencheu?' Lista silenciosa.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Inventário: conquistas externas × emoções reais associadas.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Partilha voluntária do vazio nomeado. Grupo testemunha.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Silêncio guiado de luto simbólico.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Respiração profunda. 'O que importa de verdade?'", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com normalização — o vazio após conquista é real e legítimo.",
      "Revelação focada no sentir, não no julgamento das conquistas.",
      "Exercício: Inventário do Vazio — conquistas × emoções reais.",
      "Elaboração da dissociação entre status e sentido.",
      "Integração: luto simbólico silencioso.",
      "Micro-ação: revisar uma meta à luz do sentido, não do status.",
      "Orientação: 'Permita que o vazio fale antes de preenchê-lo.'",
    ],
    indicacao: {
      quandoUsar: "Quando há relato de vazio, burnout ou crise de sentido apesar de conquistas.",
      cuidados: "Não invalidar conquistas. O trabalho é de discernimento, não de descarte.",
      constelacao: "Posicionar conquistas no campo. Observar o que gera aproximação e o que gera distância.",
    },
    seguranca: "Risco moderado. Pode gerar luto inesperado. Sustentar sem resolver.",
  },

  // ─────────── PORTA 5 ───────────
  "A Desintegração": {
    orientacaoGrupo: "Porta de profundidade. Requer grupo já vinculado. NÃO indicada para primeiros encontros. A facilitadora deve estar presente e firme.",
    etapasGrupo: [
      { titulo: "Aterramento profundo", descricao: "Meditação guiada de descida. Olhos fechados. Respiração lenta.", tempo: "15min" },
      { titulo: "Ativação coletiva", descricao: "'O que em mim está ruindo — e precisa ruir?' Silêncio longo.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Nomear estruturas internas falidas. Escrita sem censura.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Partilha voluntária. Presença é suficiente.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Respiração profunda + escrita livre.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Levantar-se lentamente. Espreguiçar. Abrir os olhos.", tempo: "10min" },
    ],
    roteiroClinico: [
      "Abertura com protocolo de segurança — recurso de âncora (objeto, memória segura).",
      "Revelação lenta — permitir que o colapso se nomeie sem ser apressado.",
      "Exercício: O Que Não Sustenta Mais — nomear sem tentar consertar.",
      "Elaboração com atenção redobrada ao corpo e ritmo respiratório.",
      "Integração obrigatória com retorno consciente ao presente.",
      "Micro-ação: não 'consertar' algo que está pedindo fim.",
      "Orientação: autocuidado reforçado. Hidratação, descanso, natureza.",
    ],
    indicacao: {
      quandoUsar: "Meio de processo. Quando a cliente demonstra capacidade de sustentar desconforto.",
      cuidados: "NÃO usar como primeira sessão. Checar histórico de trauma. Ter plano de contenção.",
      constelacao: "Posicionar no centro do campo como eixo gravitacional.",
    },
    seguranca: "⚠️ Risco alto. Exige checagem de recursos. Ter protocolo de contenção disponível.",
  },

  // ─────────── PORTA 6 ───────────
  "A Descida à Deusa": {
    orientacaoGrupo: "Porta de alta intensidade emocional. Trabalha emoções reprimidas e a sombra feminina. Requer grupo maduro e facilitadora experiente.",
    etapasGrupo: [
      { titulo: "Aterramento reforçado", descricao: "Recurso de âncora: cada participante segura um objeto pessoal de segurança.", tempo: "15min" },
      { titulo: "Ativação coletiva", descricao: "'Que parte minha foi chamada de exagerada, perigosa ou errada?' Silêncio.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Dar voz à emoção negada. Escrita em primeira pessoa da parte rejeitada.", tempo: "30min" },
      { titulo: "Partilha mediada", descricao: "Partilha voluntária e breve. Facilitadora sustenta sem interpretar.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Escrita em primeira pessoa: 'Eu sou a parte que...'", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Autoabraço prolongado. Respiração de colo.", tempo: "10min" },
    ],
    roteiroClinico: [
      "Abertura com protocolo de segurança — âncora, recurso, plano de contenção.",
      "Revelação cuidadosa — preparar o campo antes de nomear a sombra.",
      "Exercício: Nomear a Sombra — dar voz à parte rejeitada.",
      "Elaboração mínima — não explorar a sombra, apenas reconhecê-la.",
      "Integração obrigatória — não encerrar sem gesto de cuidado.",
      "Micro-ação: permitir uma expressão emocional consciente na semana.",
      "Orientação: autocuidado intensivo. Contato em 24h se necessário.",
    ],
    indicacao: {
      quandoUsar: "Meio de processo. APÓS descida e APÓS checagem de recursos.",
      cuidados: "NUNCA como primeira sessão. NUNCA sem vínculo. Ter plano de contenção.",
      constelacao: "Posicionar com cuidado. Pode ser representada mas não confrontada diretamente.",
    },
    seguranca: "⚠️ RISCO ALTO. Porta de descida profunda. Checagem de recursos obrigatória.",
  },

  // ─────────── PORTA 7 ───────────
  "O Anseio de Reconexão": {
    orientacaoGrupo: "Porta de saudade e desejo. Trabalha a reconexão com o autêntico. Pode ser mobilizante mas de forma positiva.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Meditação de reconexão: olhos fechados, mãos abertas. 'O que minha alma pede?'", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "Escrita silenciosa dos desejos esquecidos.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Mapa do Desejo Vivo: desejos autênticos silenciados ou esquecidos.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Cada participante nomeia um desejo. Grupo acolhe.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Visualização guiada de reconexão com o desejo.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Gesto concreto de cuidado. 'Eu me ouço.'", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com permissão — 'Aqui seu desejo é legítimo.'",
      "Revelação com escuta profunda — o anseio pode estar enterrado.",
      "Exercício: Mapa do Desejo Vivo — mapear o que foi silenciado.",
      "Elaboração com gentileza — alguns desejos geram culpa.",
      "Integração: visualização guiada de reconexão.",
      "Micro-ação: um gesto concreto de cuidado com o desejo.",
      "Orientação: 'Permita que o desejo exista antes de julgá-lo.'",
    ],
    indicacao: {
      quandoUsar: "Qualquer momento do processo. Quando há desconexão do desejo autêntico.",
      cuidados: "Atenção a desejos que geram culpa. Normalizar sem forçar ação.",
      constelacao: "Posicionar como direção. Para onde o corpo se inclina?",
    },
    seguranca: "Risco baixo a moderado. Pode mobilizar luto pelo tempo perdido.",
  },

  // ─────────── PORTA 8 ───────────
  "Cura da Ferida Materna": {
    orientacaoGrupo: "Porta de alta intensidade. Trabalha carência, rejeição e fusão emocional. NUNCA usar como primeira aplicação em grupo. Requer grupo maduro.",
    etapasGrupo: [
      { titulo: "Aterramento reforçado", descricao: "Recurso de âncora. Cada participante segura objeto de segurança.", tempo: "15min" },
      { titulo: "Ativação coletiva", descricao: "'Que tipo de amor materno faltou?' Silêncio de 3 minutos.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "O Feminino Herdado: o que recebeu, o que não recebeu. Padrões em relações femininas.", tempo: "30min" },
      { titulo: "Partilha mediada", descricao: "Partilha voluntária e breve. Facilitadora sustenta sem interpretar.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Carta simbólica à mãe (real ou arquetípica), sem envio.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Autoabraço prolongado. Respiração de colo. Cobertor simbólico.", tempo: "10min" },
    ],
    roteiroClinico: [
      "Abertura com protocolo de segurança completo — âncora, recurso, plano de contenção.",
      "Revelação NUNCA abrupta — preparar o campo antes de nomear a ferida materna.",
      "Exercício: O Feminino Herdado — nomear o que recebeu e o que faltou.",
      "Elaboração somática — localizar no corpo antes de verbalizar.",
      "Integração obrigatória — carta simbólica sem envio.",
      "Micro-ação: um gesto de cuidado materno consigo mesma.",
      "Orientação: autocuidado intensivo. Contato em 24h se necessário.",
    ],
    indicacao: {
      quandoUsar: "Meio de processo. Quando há carência afetiva, culpa feminina ou excesso de doação.",
      cuidados: "NUNCA como primeira sessão. NUNCA sem vínculo. Checar histórico de abandono.",
      constelacao: "A carta pode representar a mãe no campo. Observar distância e direção do olhar.",
    },
    seguranca: "⚠️ RISCO ALTO. Ferida parental. Checagem de recursos obrigatória. Não avançar sem integração.",
  },

  // ─────────── PORTA 9 ───────────
  "Cura da Ferida Paterna": {
    orientacaoGrupo: "Porta que trabalha autoridade, reconhecimento e validação. Pode ativar medo de exposição e síndrome da impostora. Requer grupo com vínculo.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Postura de pé, firme. Sentir o próprio peso. Presença.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "'Onde ainda busco permissão para existir plenamente?' Escrita silenciosa.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "O Olhar que Faltou: onde busca validação externa. Custo na vida adulta.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Partilha voluntária. Grupo testemunha a autoridade de cada uma.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Postura corporal de presença + afirmação simbólica de autoridade interna.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "De pé. Olhar para frente. 'Eu não preciso de permissão.'", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com checagem — pergunte sobre relação com autoridade e validação.",
      "Revelação com cuidado — a ferida paterna pode ser silenciosa e profunda.",
      "Exercício: O Olhar que Faltou — validação externa e seu custo.",
      "Elaboração atenta a medo de errar e síndrome da impostora.",
      "Integração: postura de presença + afirmação de autoridade interna.",
      "Micro-ação: fazer algo sem pedir permissão.",
      "Orientação: 'Observe onde você espera aprovação antes de agir.'",
    ],
    indicacao: {
      quandoUsar: "Quando há medo de errar, síndrome da impostora ou dependência de aprovação.",
      cuidados: "Atenção a histórico de violência paterna. Não forçar confronto.",
      constelacao: "A carta pode representar o pai no campo. Observar postura e distância.",
    },
    seguranca: "⚠️ RISCO ALTO. Ferida parental. Checar recursos e vínculo antes de aplicar.",
  },

  // ─────────── PORTA 10 ───────────
  "A Integração do Masculino e Feminino": {
    orientacaoGrupo: "Porta de reunião interna. Trabalha a polarização entre agir e sentir. Excelente para grupos em processo de equilíbrio.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Respiração alternada (narina direita/esquerda). Sentir dois lados do corpo.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "'Qual parte lidera em excesso — e qual está silenciada?'", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Diálogo Interno: escrita em duas vozes (agir × sentir).", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Cada participante nomeia o que está integrando. Grupo acolhe.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Respiração alternada + gesto simbólico de união (juntar mãos).", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Balanço suave do corpo. Embalo. 'Eu me reúno.'", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com reconhecimento — a polarização é resultado de adaptação.",
      "Revelação focada em equilíbrio, não em 'consertar' um lado.",
      "Exercício: Diálogo Interno — duas vozes, sem hierarquia.",
      "Elaboração da coexistência — não resolver, mas permitir.",
      "Integração: gesto de união simbólica.",
      "Micro-ação: dar espaço ao lado silenciado por um dia.",
      "Orientação: 'Permita que as contradições coexistam.'",
    ],
    indicacao: {
      quandoUsar: "Quando há exaustão, rigidez ou confusão de identidade.",
      cuidados: "Não forçar integração prematura. Respeitar partes que resistem.",
      constelacao: "Reunir representações no campo. O que acontece quando se aproximam?",
    },
    seguranca: "Risco baixo a moderado. Porta de reunião, não de confronto.",
  },

  // ─────────── PORTA 11 ───────────
  "Reivindicação da Autoridade Feminina": {
    orientacaoGrupo: "Porta de autonomia e limites. Trabalha submissões inconscientes. Pode ser muito empoderador para grupos de mulheres.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "De pé. Sentir o peso nos dois pés. Centro de gravidade. Presença.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "'Onde entreguei meu poder para sobreviver?' Escrita silenciosa.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Território Psíquico: invasões emocionais + limites simbólicos.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Cada uma nomeia um limite. Grupo testemunha.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Delimitação espacial consciente: corpo e voz.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Postura firme. Olhar para frente. 'Meu território é sagrado.'", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com normalização — entregar o poder foi sobrevivência, não fraqueza.",
      "Revelação focada em responsabilidade, não em culpa.",
      "Exercício: Território Psíquico — invasões e limites.",
      "Elaboração sem pressa — reivindicar autoridade é processo.",
      "Integração: delimitação espacial com corpo e voz.",
      "Micro-ação: dizer um 'não' necessário ou sustentar uma posição.",
      "Orientação: 'Uma escolha soberana esta semana.'",
    ],
    indicacao: {
      quandoUsar: "Quando há dificuldade de dizer não, autoabandono ou ressentimento.",
      cuidados: "Não pressionar. A autoridade é da cliente, não da terapeuta.",
      constelacao: "Posicionar com território. A cliente caminha e demarca.",
    },
    seguranca: "Risco baixo a moderado. Pode gerar confronto interno com padrões antigos.",
  },

  // ─────────── PORTA 12 ───────────
  "O Retorno ao Mundo": {
    orientacaoGrupo: "Porta de volta ao mundo. Celebrativa e integradora. Excelente para penúltimos encontros de grupo.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Caminhar pelo espaço como quem chega a um lugar novo.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "'Como levo quem me tornei para o mundo real?'", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "3 compromissos inegociáveis com a própria verdade.", tempo: "20min" },
      { titulo: "Partilha mediada", descricao: "Cada participante compartilha seus compromissos. Grupo celebra.", tempo: "25min" },
      { titulo: "Ritual", descricao: "Declaração verbal de compromisso simbólico.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "De pé. Postura de quem chegou. Sorriso interno.", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com reconhecimento da jornada — 'Você atravessou.'",
      "Revelação como celebração — não como tarefa.",
      "Exercício: Nova Ética de Vida — 3 compromissos inegociáveis.",
      "Elaboração de como viver diferente com o que aprendeu.",
      "Integração: declaração verbal de compromisso.",
      "Micro-ação: um ato concreto de nova ética na semana.",
      "Orientação: 'Viva a partir do que aprendeu, não do que sofreu.'",
    ],
    indicacao: {
      quandoUsar: "Fim de processo. Quando há integração suficiente para retornar.",
      cuidados: "Não apressar o retorno. Verificar se o processo realmente se fechou.",
      constelacao: "A carta retorna ao ponto de partida. O que mudou?",
    },
    seguranca: "Risco baixo. Porta de celebração e fechamento.",
  },

  // ─────────── PORTA 13 ───────────
  "A Vida Criativa": {
    orientacaoGrupo: "Porta de expressão criativa e vitalidade. Energizante e mobilizadora. Excelente para grupos em fase de ativação.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Movimento livre pelo espaço. Espreguiçar. Despertar o corpo.", tempo: "10min" },
      { titulo: "Ativação coletiva", descricao: "'O que deseja nascer através de mim?' Escrita rápida.", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Mapa Criativo Essencial: impulsos criativos autênticos.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Cada participante compartilha um impulso criativo. Grupo celebra.", tempo: "20min" },
      { titulo: "Ritual", descricao: "Ação criativa mínima imediata: desenhar, escrever, cantar.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Energia viva. Sorriso. 'Eu sou criação.'", tempo: "5min" },
    ],
    roteiroClinico: [
      "Abertura com energia — esta porta é de ativação, não de introspecção.",
      "Revelação com entusiasmo contido — o impulso criativo é sagrado.",
      "Exercício: Mapa Criativo Essencial — o que quer nascer?",
      "Elaboração focada em materialização, não em plano perfeito.",
      "Integração: ação criativa mínima (24h).",
      "Micro-ação: materializar um impulso criativo concreto.",
      "Orientação: 'Crie antes de planejar. Faça antes de explicar.'",
    ],
    indicacao: {
      quandoUsar: "Quando há bloqueio criativo, perda de vitalidade ou busca de propósito.",
      cuidados: "Não confundir criatividade com produtividade. É expressão, não performance.",
      constelacao: "A carta pode representar o que quer nascer. Posicionar à frente da cliente.",
    },
    seguranca: "Risco baixo. Porta de vitalidade e expressão.",
  },

  // ─────────── PORTA 14 ───────────
  "A Heroína Integrada": {
    orientacaoGrupo: "Porta de encerramento e sabedoria incorporada. Ideal para último encontro de grupo ou ritual de formatura.",
    etapasGrupo: [
      { titulo: "Aterramento", descricao: "Meditação: 'Imagine a mulher que você se tornou de pé à sua frente.'", tempo: "15min" },
      { titulo: "Ativação coletiva", descricao: "'Quem sou agora — e como sustento isso no tempo?'", tempo: "5min" },
      { titulo: "Trabalho individual", descricao: "Linha do Tempo Integrada. Carta à mulher que começou.", tempo: "25min" },
      { titulo: "Partilha mediada", descricao: "Cada participante lê sua carta ou compartilha sua sabedoria.", tempo: "25min" },
      { titulo: "Ritual", descricao: "Consagração simbólica: símbolo (pedra, fita, vela) como marca da travessia.", tempo: "10min" },
      { titulo: "Fechamento", descricao: "Círculo final. Mãos dadas. Silêncio. Reverência mútua.", tempo: "10min" },
    ],
    roteiroClinico: [
      "Abertura com solenidade — este é um fechamento sagrado.",
      "Revelação como coroação — a cliente se reconhece como heroína integrada.",
      "Exercício: Linha do Tempo Integrada — marcar transformações-chave.",
      "Elaboração da sabedoria incorporada — não teoria, vivência.",
      "Integração: consagração simbólica do percurso.",
      "Micro-ação: sustentar quem se tornou nas próximas 7 dias.",
      "Orientação: 'Você agora é guardiã da sua própria jornada.'",
    ],
    indicacao: {
      quandoUsar: "Última sessão do ciclo. Fechamento definitivo.",
      cuidados: "Não usar antes do tempo. A heroína integrada nasce, não é imposta.",
      constelacao: "A carta é colocada atrás da cliente. Apoio e sabedoria incorporada.",
    },
    seguranca: "Risco baixo. Porta de sabedoria e encerramento. Sustentação natural.",
  },
};
