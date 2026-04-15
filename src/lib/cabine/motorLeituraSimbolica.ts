/**
 * MOTOR DE LEITURA SIMBÓLICA — Campo do Círculo de Mulheres
 * 
 * Diferenciação fundamental: Círculo NÃO é grupo terapêutico.
 * Círculo opera por rituais, arquétipos e condução simbólica.
 * 
 * Deriva sugestões de:
 * - Conto para abertura
 * - Pergunta de abertura
 * - Gesto ritual
 * - Estado simbólico do campo
 * 
 * Regras puramente determinísticas, sem IA.
 */

// ── Tipos ────────────────────────────────────────────────

export type EstadoSimbolico =
  | 'campo_aberto'
  | 'campo_denso'
  | 'campo_leve'
  | 'campo_em_gestacao'
  | 'campo_ritual_ativo'
  | 'campo_novo';

export interface SugestaoConducaoCirculo {
  conto_sugerido: string;
  pergunta_abertura: string;
  gesto_ritual: string;
}

export interface LeituraSimbolica {
  estado_simbolico: EstadoSimbolico;
  mensagem_campo: string;
  sugestoes: SugestaoConducaoCirculo;
  distritos_em_jogo: string[];
  frase_ritual: string | null;
}

interface CirculoInput {
  nome_circulo: string;
  ritual_base: string;
  distritos_ativados: string[];
  participantes_count: number;
}

// ── Banco de Contos ──────────────────────────────────────

const CONTOS_POR_DISTRITO: Record<string, string[]> = {
  'Torres da Identidade': [
    'A mulher que esqueceu seu nome e encontrou outro no espelho da floresta.',
    'A tecelã que desfez seu manto para descobrir os fios de que era feita.',
  ],
  'Portas do Corpo': [
    'A árvore que aprendeu a dançar quando parou de resistir ao vento.',
    'O rio que corria para dentro da terra e ali encontrou o mar.',
  ],
  'Labirinto Interior': [
    'O minotauro que guardava não um segredo, mas uma pergunta.',
    'A mulher que desceu ao poço e encontrou o céu refletido.',
  ],
  'Jardim dos Vínculos': [
    'As duas árvores que cresciam juntas sem tocar seus galhos.',
    'A ponte que só aparecia quando alguém ousava caminhar sem ver.',
  ],
  'Território da Sombra': [
    'A mãe-noite que carregava o dia escondido em seu manto.',
    'O espelho que mostrava não o rosto, mas aquilo que o rosto não dizia.',
  ],
};

const CONTOS_GENERICOS = [
  'A mulher que seguiu o fio até o centro do labirinto e ali encontrou outra mulher esperando.',
  'O círculo de pedras que sussurrava quando as mulheres se sentavam em silêncio.',
  'A fogueira que queimava sem lenha, alimentada apenas pelo que era dito ao redor.',
];

// ── Perguntas por Distrito ───────────────────────────────

const PERGUNTAS_POR_DISTRITO: Record<string, string[]> = {
  'Torres da Identidade': [
    'O que em você ainda não tem nome?',
    'Qual parte de quem você é permanece em silêncio?',
  ],
  'Portas do Corpo': [
    'Onde no corpo a experiência de hoje se acumula?',
    'Se o corpo pudesse falar primeiro, o que diria?',
  ],
  'Labirinto Interior': [
    'O que está no centro daquilo que você evita olhar?',
    'Que pergunta você carrega sem querer responder?',
  ],
  'Jardim dos Vínculos': [
    'Qual vínculo pede atenção neste momento?',
    'O que se repete entre você e o outro que está aqui?',
  ],
  'Território da Sombra': [
    'O que você não quer mostrar ao círculo?',
    'Que parte de você veio sem ser convidada?',
  ],
};

const PERGUNTAS_GENERICAS = [
  'Com que você chegou hoje — e o que gostaria de deixar aqui?',
  'Se este encontro fosse uma estação do ano, qual seria?',
  'O que precisa ser dito que ainda não foi dito?',
];

// ── Gestos Rituais ───────────────────────────────────────

const GESTOS_POR_RITUAL: Record<string, string[]> = {
  'Roda de Escuta': [
    'Cada mulher coloca as mãos sobre o coração antes de falar.',
    'Passar um objeto simbólico — quem segura, é ouvida.',
  ],
  'Roda de Espelho': [
    'Olhar nos olhos da mulher ao lado por 30 segundos em silêncio.',
    'Dizer uma palavra ao centro do círculo sem explicá-la.',
  ],
  'Fogueira Interna': [
    'Escrever em papel o que deseja soltar e colocar no centro.',
    'Fechar os olhos e respirar três vezes juntas, em sincronia.',
  ],
};

const GESTOS_GENERICOS = [
  'Dar as mãos em silêncio por um minuto. Sentir a presença antes das palavras.',
  'Cada participante escolhe uma palavra que carrega hoje e a deposita no centro.',
  'Respiração coletiva: três inspirações longas e compartilhadas.',
];

// ── Motor Principal ──────────────────────────────────────

export function calcularLeituraSimbolica(circulo: CirculoInput): LeituraSimbolica {
  const { ritual_base, distritos_ativados, participantes_count } = circulo;

  // Estado simbólico
  const estado = derivarEstadoSimbolico(distritos_ativados, participantes_count);

  // Sugestões
  const conto = escolherConto(distritos_ativados);
  const pergunta = escolherPergunta(distritos_ativados);
  const gesto = escolherGesto(ritual_base);

  // Mensagem
  const mensagem = gerarMensagemCampo(estado, distritos_ativados);

  // Frase ritual
  const frase = gerarFraseRitual(ritual_base, distritos_ativados);

  return {
    estado_simbolico: estado,
    mensagem_campo: mensagem,
    sugestoes: {
      conto_sugerido: conto,
      pergunta_abertura: pergunta,
      gesto_ritual: gesto,
    },
    distritos_em_jogo: distritos_ativados,
    frase_ritual: frase,
  };
}

// ── Derivações ───────────────────────────────────────────

function derivarEstadoSimbolico(
  distritos: string[],
  participantes: number,
): EstadoSimbolico {
  if (distritos.length === 0) return 'campo_novo';
  if (distritos.includes('Território da Sombra')) return 'campo_denso';
  if (distritos.includes('Portas do Corpo') && participantes <= 5) return 'campo_em_gestacao';
  if (distritos.length >= 3) return 'campo_ritual_ativo';
  if (distritos.includes('Jardim dos Vínculos')) return 'campo_leve';
  return 'campo_aberto';
}

function escolherConto(distritos: string[]): string {
  for (const d of distritos) {
    const contos = CONTOS_POR_DISTRITO[d];
    if (contos?.length) {
      return contos[Math.floor(Math.random() * contos.length)];
    }
  }
  return CONTOS_GENERICOS[Math.floor(Math.random() * CONTOS_GENERICOS.length)];
}

function escolherPergunta(distritos: string[]): string {
  for (const d of distritos) {
    const perguntas = PERGUNTAS_POR_DISTRITO[d];
    if (perguntas?.length) {
      return perguntas[Math.floor(Math.random() * perguntas.length)];
    }
  }
  return PERGUNTAS_GENERICAS[Math.floor(Math.random() * PERGUNTAS_GENERICAS.length)];
}

function escolherGesto(ritual_base: string): string {
  const gestos = GESTOS_POR_RITUAL[ritual_base];
  if (gestos?.length) {
    return gestos[Math.floor(Math.random() * gestos.length)];
  }
  return GESTOS_GENERICOS[Math.floor(Math.random() * GESTOS_GENERICOS.length)];
}

function gerarMensagemCampo(estado: EstadoSimbolico, distritos: string[]): string {
  const msgs: Record<EstadoSimbolico, string> = {
    campo_novo: 'O campo ainda não foi inaugurado. O primeiro encontro definirá o tom.',
    campo_aberto: 'O campo está aberto e receptivo. Espaço para emergência.',
    campo_denso: 'O campo carrega densidade. Cuidado com a profundidade — acolher sem forçar.',
    campo_leve: 'Leveza no campo. Bom momento para escuta e partilha.',
    campo_em_gestacao: 'Algo está se formando. O campo pede tempo antes de nomear.',
    campo_ritual_ativo: 'Múltiplos distritos ativados. O ritual ganha complexidade e profundidade.',
  };
  return msgs[estado];
}

function gerarFraseRitual(ritual: string, distritos: string[]): string | null {
  if (!ritual && distritos.length === 0) return null;
  if (distritos.includes('Território da Sombra')) {
    return 'O que está no escuro pede não luz, mas presença.';
  }
  if (distritos.includes('Torres da Identidade')) {
    return 'Nomear-se é o primeiro ritual de quem decide existir.';
  }
  if (distritos.includes('Portas do Corpo')) {
    return 'O corpo lembra o que a mente ainda não formulou.';
  }
  return 'O círculo sustenta o que nenhuma mulher sustentaria sozinha.';
}
