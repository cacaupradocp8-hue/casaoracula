/**
 * MOTOR DE LEITURA SIMBÓLICA — Campo do Círculo de Mulheres
 * 
 * Círculo NÃO é grupo terapêutico.
 * Opera por rituais, arquétipos e condução simbólica.
 * 
 * Regras puramente determinísticas, sem IA.
 */

// ── Tipos ────────────────────────────────────────────────

export type EstadoCirculo =
  | 'circulo_em_abertura_ritual'
  | 'circulo_em_recolhimento'
  | 'circulo_em_ativacao_simbolica'
  | 'circulo_em_travessia'
  | 'circulo_em_integracao';

export type DirecaoCirculo =
  | 'abrir_narrativa'
  | 'sustentar_escuta'
  | 'ativar_simbolo'
  | 'conter_intensidade'
  | 'fechar_com_gesto_ritual';

export interface SugestaoConducaoCirculo {
  conto_sugerido: string;
  pergunta_abertura: string;
  gesto_ritual: string;
}

export interface LeituraSimbolica {
  estado_circulo: EstadoCirculo;
  direcao_ritual: DirecaoCirculo;
  mensagem_campo: string;
  mensagem_direcao: string;
  sugestoes: SugestaoConducaoCirculo;
  distritos_em_jogo: string[];
  frase_ritual: string | null;
  risco_coletivo: 'baixo' | 'moderado' | 'elevado';
  permanencia: string | null;
}

export interface CirculoInput {
  nome_circulo: string;
  ritual_base: string;
  distritos_ativados: string[];
  participantes_count: number;
  // Dados opcionais de encontros recentes
  encontros_recentes?: CirculoEncounterInput[];
}

export interface CirculoEncounterInput {
  theme: string | null;
  archetype_worked: string | null;
  notes: string | null;
  date: string;
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

// ── Mensagens ────────────────────────────────────────────

const MENSAGENS_ESTADO: Record<EstadoCirculo, string> = {
  circulo_em_abertura_ritual: 'O círculo se abre. O campo pede inauguração com presença e ritual.',
  circulo_em_recolhimento: 'O círculo recolhe-se. Sustente a escuta sem preencher.',
  circulo_em_ativacao_simbolica: 'Símbolos emergem no campo. Momento de ativação e nomeação.',
  circulo_em_travessia: 'O círculo atravessa algo profundo. Acompanhar sem acelerar.',
  circulo_em_integracao: 'Integração em curso. O gesto de fechamento se aproxima.',
};

const MENSAGENS_DIRECAO: Record<DirecaoCirculo, string> = {
  abrir_narrativa: 'Abrir narrativa — usar conto ou pergunta para inaugurar o campo.',
  sustentar_escuta: 'Sustentar escuta — o círculo precisa de presença, não de interpretação.',
  ativar_simbolo: 'Ativar símbolo — trazer imagem, gesto ou objeto ao centro.',
  conter_intensidade: 'Conter intensidade — reduzir o ritmo, respirar antes de avançar.',
  fechar_com_gesto_ritual: 'Fechar com gesto ritual — o campo pede encerramento simbólico.',
};

// ── Motor Principal ──────────────────────────────────────

export function calcularLeituraSimbolica(circulo: CirculoInput): LeituraSimbolica {
  const { ritual_base, distritos_ativados, participantes_count, encontros_recentes } = circulo;

  // Estado simbólico
  const estado = derivarEstadoCirculo(distritos_ativados, participantes_count, encontros_recentes);

  // Direção
  const direcao = derivarDirecaoCirculo(estado, distritos_ativados);

  // Risco
  const risco = derivarRiscoCirculo(estado, distritos_ativados);

  // Permanência
  const permanencia = derivarPermanenciaCirculo(estado);

  // Sugestões
  const conto = escolherConto(distritos_ativados);
  const pergunta = escolherPergunta(distritos_ativados);
  const gesto = escolherGesto(ritual_base);

  // Frase ritual
  const frase = gerarFraseRitual(distritos_ativados);

  return {
    estado_circulo: estado,
    direcao_ritual: direcao,
    mensagem_campo: MENSAGENS_ESTADO[estado],
    mensagem_direcao: MENSAGENS_DIRECAO[direcao],
    sugestoes: {
      conto_sugerido: conto,
      pergunta_abertura: pergunta,
      gesto_ritual: gesto,
    },
    distritos_em_jogo: distritos_ativados,
    frase_ritual: frase,
    risco_coletivo: risco,
    permanencia,
  };
}

// ── Derivações ───────────────────────────────────────────

function derivarEstadoCirculo(
  distritos: string[],
  participantes: number,
  encontros?: CirculoEncounterInput[],
): EstadoCirculo {
  if (!encontros?.length && distritos.length === 0) return 'circulo_em_abertura_ritual';

  // Se temos encontros recentes, analisar notas
  if (encontros?.length) {
    const notasRecentes = encontros.slice(0, 3).map(e => e.notes).filter(Boolean).join(' ').toLowerCase();
    if (['intenso', 'choro', 'colapso', 'pesado', 'transbord'].some(k => notasRecentes.includes(k))) {
      return 'circulo_em_recolhimento';
    }
    if (['integr', 'síntese', 'fechamento', 'encerr'].some(k => notasRecentes.includes(k))) {
      return 'circulo_em_integracao';
    }
  }

  if (distritos.includes('Território da Sombra')) return 'circulo_em_travessia';
  if (distritos.length >= 3) return 'circulo_em_ativacao_simbolica';
  if (distritos.includes('Portas do Corpo') && participantes <= 5) return 'circulo_em_recolhimento';
  if (distritos.length === 0) return 'circulo_em_abertura_ritual';

  return 'circulo_em_ativacao_simbolica';
}

function derivarDirecaoCirculo(
  estado: EstadoCirculo,
  distritos: string[],
): DirecaoCirculo {
  const map: Record<EstadoCirculo, DirecaoCirculo> = {
    circulo_em_abertura_ritual: 'abrir_narrativa',
    circulo_em_recolhimento: 'sustentar_escuta',
    circulo_em_ativacao_simbolica: 'ativar_simbolo',
    circulo_em_travessia: 'sustentar_escuta',
    circulo_em_integracao: 'fechar_com_gesto_ritual',
  };
  // Override: sombra + travessia pode precisar de contenção
  if (estado === 'circulo_em_travessia' && distritos.includes('Território da Sombra')) {
    return 'conter_intensidade';
  }
  return map[estado];
}

function derivarRiscoCirculo(
  estado: EstadoCirculo,
  distritos: string[],
): 'baixo' | 'moderado' | 'elevado' {
  if (estado === 'circulo_em_travessia' && distritos.includes('Território da Sombra')) return 'elevado';
  if (estado === 'circulo_em_recolhimento') return 'moderado';
  if (estado === 'circulo_em_travessia') return 'moderado';
  return 'baixo';
}

function derivarPermanenciaCirculo(estado: EstadoCirculo): string | null {
  const map: Partial<Record<EstadoCirculo, string>> = {
    circulo_em_recolhimento: 'O círculo precisa de acolhimento antes de avançar.',
    circulo_em_travessia: 'A travessia está em curso. Não interrompa o processo.',
    circulo_em_integracao: 'A integração precisa de tempo. Não abra novo campo agora.',
  };
  return map[estado] ?? null;
}

function escolherConto(distritos: string[]): string {
  for (const d of distritos) {
    const contos = CONTOS_POR_DISTRITO[d];
    if (contos?.length) return contos[Math.floor(Math.random() * contos.length)];
  }
  return CONTOS_GENERICOS[Math.floor(Math.random() * CONTOS_GENERICOS.length)];
}

function escolherPergunta(distritos: string[]): string {
  for (const d of distritos) {
    const perguntas = PERGUNTAS_POR_DISTRITO[d];
    if (perguntas?.length) return perguntas[Math.floor(Math.random() * perguntas.length)];
  }
  return PERGUNTAS_GENERICAS[Math.floor(Math.random() * PERGUNTAS_GENERICAS.length)];
}

function escolherGesto(ritual_base: string): string {
  const gestos = GESTOS_POR_RITUAL[ritual_base];
  if (gestos?.length) return gestos[Math.floor(Math.random() * gestos.length)];
  return GESTOS_GENERICOS[Math.floor(Math.random() * GESTOS_GENERICOS.length)];
}

function gerarFraseRitual(distritos: string[]): string | null {
  if (distritos.length === 0) return null;
  if (distritos.includes('Território da Sombra')) return 'O que está no escuro pede não luz, mas presença.';
  if (distritos.includes('Torres da Identidade')) return 'Nomear-se é o primeiro ritual de quem decide existir.';
  if (distritos.includes('Portas do Corpo')) return 'O corpo lembra o que a mente ainda não formulou.';
  if (distritos.includes('Jardim dos Vínculos')) return 'O vínculo cresce quando a verdade pode ser dita.';
  if (distritos.includes('Labirinto Interior')) return 'No centro do labirinto, a pergunta é mais importante que a resposta.';
  return 'O círculo sustenta o que nenhuma mulher sustentaria sozinha.';
}
