// ============================================
// CLUBE DO LIVRO — Mapeamento Livro → Portais Simbólicos
// Cada livro está vinculado à sua Jornada e a portais formativos relacionados
// ============================================

export interface PortalAssociado {
  nome: string;
  descricao: string;
  rota: string; // rota interna da plataforma
  icone?: string; // emoji simbólico
}

export type JornadaType = 'heroina' | 'sombra' | 'expressao' | 'instinto' | 'lideranca';

export interface LivroPortaisConfig {
  tituloLivro: string; // deve bater com o campo titulo em clube_livro_ciclos
  jornada: JornadaType;
  orientacaoCurta: string; // texto orientador do livro (aparece no card)
  portais: PortalAssociado[];
}

export const CLUBE_LIVRO_PORTAIS: LivroPortaisConfig[] = [
  // ── JORNADA DA HEROÍNA ──────────────────────────────────────
  {
    tituloLivro: 'Mulheres que Correm com os Lobos',
    jornada: 'heroina',
    orientacaoCurta:
      'Uma travessia pelo instinto feminino, pelo selvagem interior e pela reabilitação da psique ferida. Convida a recuperar a natureza instintiva antes domesticada.',
    portais: [
      {
        nome: 'Labirinto da Heroína Interna®',
        descricao: 'Portas 1–4: Chamado, Separação e Descida',
        rota: '/labirinto-heroina',
        icone: '◈',
      },
      {
        nome: 'Portal Junguiano — Encarnação',
        descricao: 'Força da presença e do instinto no corpo',
        rota: '/portal-junguiano',
        icone: '◉',
      },
      {
        nome: 'Atlas de Arquétipos',
        descricao: 'A Selvagem, a Guardiã, a Anciã',
        rota: '/atlas-arquetipos',
        icone: '◎',
      },
    ],
  },
  {
    tituloLivro: 'O Código do Ser',
    jornada: 'heroina',
    orientacaoCurta:
      'A teoria da alma (daimon) de Hillman: cada pessoa nasce com uma imagem que a chama. Este livro interroga destino, vocação e o que a psicologia esqueceu.',
    portais: [
      {
        nome: 'Portal Junguiano — Origem',
        descricao: 'Reconhecimento do chamado e da imagem interior',
        rota: '/portal-junguiano',
        icone: '◉',
      },
      {
        nome: 'Labirinto da Heroína Interna® — Porta 7',
        descricao: 'A Ferida como porta de chamado',
        rota: '/labirinto-heroina',
        icone: '◈',
      },
    ],
  },
  {
    tituloLivro: 'A Coruja Era Filha do Padeiro',
    jornada: 'heroina',
    orientacaoCurta:
      'Marion Woodman investiga o corpo e a sombra: como o perfeccionismo e o apagamento feminino se inscrevem na carne. Convida ao retorno ao corpo real.',
    portais: [
      {
        nome: 'Portal Junguiano — Sombra Lúcida',
        descricao: 'Reconhecimento e integração da sombra feminina',
        rota: '/portal-junguiano',
        icone: '◉',
      },
      {
        nome: 'Escala MAIA',
        descricao: 'Consciência interoceptiva e relação com o corpo',
        rota: '/ferramentas/escala-maia',
        icone: '◎',
      },
    ],
  },
  {
    tituloLivro: 'Água Viva',
    jornada: 'heroina',
    orientacaoCurta:
      'Clarice como método: uma linguagem que recusa o conceito e vive na sensação pura. Convida à presença radical e à escuta do próprio instante.',
    portais: [
      {
        nome: 'Portal Junguiano — Movimento Vivo',
        descricao: 'Presença, fluxo e linguagem do corpo',
        rota: '/portal-junguiano',
        icone: '◉',
      },
      {
        nome: 'Narroterapia Oracular™',
        descricao: 'Escrita como ferramenta de presença',
        rota: '/narroterapia',
        icone: '◎',
      },
    ],
  },

  // ── JORNADA DA SOMBRA ───────────────────────────────────────
  {
    tituloLivro: 'O Brincar e a Realidade',
    jornada: 'sombra',
    orientacaoCurta:
      'Winnicott e o espaço potencial: onde o brincar acontece é onde o self se revela. Fundamental para entender a sessão terapêutica como espaço transicional.',
    portais: [
      {
        nome: 'Sala de Sessão',
        descricao: 'Espaço transicional clínico e simbólico',
        rota: '/session-room',
        icone: '◉',
      },
      {
        nome: 'Portal Junguiano — Sustentação',
        descricao: 'Presença, holding e campo seguro',
        rota: '/portal-junguiano',
        icone: '◎',
      },
    ],
  },
  {
    tituloLivro: 'A Gravidade e a Graça',
    jornada: 'sombra',
    orientacaoCurta:
      'Simone Weil sobre atenção, limite e a graça que transforma o sofrimento. Uma ética do cuidado que começa pela própria esvaziamento.',
    portais: [
      {
        nome: 'Portal Junguiano — Lei Interna',
        descricao: 'Ética, limite e consciência de si',
        rota: '/portal-junguiano',
        icone: '◉',
      },
      {
        nome: 'Labirinto da Heroína Interna® — Porta 9',
        descricao: 'Encontro com o limite como iniciação',
        rota: '/labirinto-heroina',
        icone: '◈',
      },
    ],
  },
  {
    tituloLivro: 'O Acontecimento',
    jornada: 'sombra',
    orientacaoCurta:
      'Annie Ernaux narra o inenarrável com precisão cirúrgica. Um modelo de coragem narrativa e de dignidade no testemunho da própria queda.',
    portais: [
      {
        nome: 'Jardim da Heroína',
        descricao: 'Registro simbólico da travessia da cliente',
        rota: '/session-room',
        icone: '◈',
      },
      {
        nome: 'Narroterapia Oracular™',
        descricao: 'Testemunho, narrativa e cura pela escrita',
        rota: '/narroterapia',
        icone: '◎',
      },
    ],
  },
  {
    tituloLivro: 'Ficções que Curam',
    jornada: 'sombra',
    orientacaoCurta:
      'Hillman propõe que a psique pensa em imagens, não em conceitos. A história que a cliente conta de si mesma é a terapia em si.',
    portais: [
      {
        nome: 'Atlas de Arquétipos',
        descricao: 'As imagens que constroem a identidade',
        rota: '/atlas-arquetipos',
        icone: '◎',
      },
      {
        nome: 'Portal Junguiano — Trama',
        descricao: 'A psique como campo narrativo',
        rota: '/portal-junguiano',
        icone: '◉',
      },
    ],
  },

  // ── JORNADA DA EXPRESSÃO & MUNDO ───────────────────────────
  {
    tituloLivro: 'O Poder da Escrita',
    jornada: 'expressao',
    orientacaoCurta:
      'Christina Baldwin sobre diário como prática espiritual e profissional. A escrita regular como testemunha interna e dispositivo de clareza.',
    portais: [
      {
        nome: 'Narroterapia Oracular™',
        descricao: 'Escrita simbólica como prática contínua',
        rota: '/narroterapia',
        icone: '◎',
      },
      {
        nome: 'Jardim da Psique',
        descricao: 'Diário simbólico pessoal',
        rota: '/jardim-da-psique',
        icone: '◈',
      },
    ],
  },
  {
    tituloLivro: 'A Poética do Espaço',
    jornada: 'expressao',
    orientacaoCurta:
      'Bachelard e a casa interior: como os espaços físicos habitam a psique. Uma fenomenologia do refúgio, do canto e da vastidão interna.',
    portais: [
      {
        nome: 'Portal Junguiano — Sustentação',
        descricao: 'Casa psíquica e campo interno de morada',
        rota: '/portal-junguiano',
        icone: '◉',
      },
      {
        nome: 'Torre Viva™',
        descricao: 'Cartografia simbólica da psique',
        rota: '/torre-viva',
        icone: '◎',
      },
    ],
  },
  {
    tituloLivro: 'Inteligência Erótica',
    jornada: 'expressao',
    orientacaoCurta:
      'Esther Perel sobre desejo, ambivalência e o paradoxo entre segurança e liberdade. Amplia o conceito de erotismo para além do sexual.',
    portais: [
      {
        nome: 'Portal Junguiano — Valor',
        descricao: 'Desejo, escolha e presença encarnada',
        rota: '/portal-junguiano',
        icone: '◉',
      },
      {
        nome: 'Labirinto da Heroína Interna® — Porta 11',
        descricao: 'Integração do feminino e do desejo',
        rota: '/labirinto-heroina',
        icone: '◈',
      },
    ],
  },
  {
    tituloLivro: 'A Condição Humana',
    jornada: 'expressao',
    orientacaoCurta:
      'Hannah Arendt sobre ação, responsabilidade e presença pública. Como a terapeuta Orácula também é uma agente no mundo, não apenas um espelho.',
    portais: [
      {
        nome: 'Portal Junguiano — Consciência',
        descricao: 'Responsabilidade, mundo e ação ética',
        rota: '/portal-junguiano',
        icone: '◉',
      },
      {
        nome: 'Casa das Máquinas — Jardim do Ofício',
        descricao: 'Reflexão profissional e presença pública',
        rota: '/casa-das-maquinas/jardim-oficio',
        icone: '◎',
      },
    ],
  },
];

// Helper: encontra a config de portais para um ciclo pelo título
export function getPortaisDoLivro(titulo: string): LivroPortaisConfig | null {
  if (!titulo) return null;
  const t = titulo.toLowerCase();
  return (
    CLUBE_LIVRO_PORTAIS.find(
      (c) =>
        c.tituloLivro.toLowerCase().includes(t) ||
        t.includes(c.tituloLivro.toLowerCase())
    ) ?? null
  );
}

// Mapa de cor por jornada (para usar nos cards)
export const JORNADA_COR: Record<string, { label: string; corLabel: string; corBorda: string; corBg: string; simbolo: string }> = {
  heroina: {
    label: 'Jornada da Heroína',
    corLabel: 'text-amber-400',
    corBorda: 'border-amber-700/30',
    corBg: 'from-amber-950/30 to-card',
    simbolo: '◈',
  },
  sombra: {
    label: 'Jornada da Sombra',
    corLabel: 'text-violet-400',
    corBorda: 'border-violet-700/30',
    corBg: 'from-violet-950/30 to-card',
    simbolo: '◉',
  },
  expressao: {
    label: 'Jornada da Expressão & Mundo',
    corLabel: 'text-teal-400',
    corBorda: 'border-teal-700/30',
    corBg: 'from-teal-950/30 to-card',
    simbolo: '◎',
  },
  instinto: {
    label: 'Jornada do Instinto',
    corLabel: 'text-rose-400',
    corBorda: 'border-rose-700/30',
    corBg: 'from-rose-950/30 to-card',
    simbolo: '△',
  },
  lideranca: {
    label: 'Jornada da Liderança',
    corLabel: 'text-sky-400',
    corBorda: 'border-sky-700/30',
    corBg: 'from-sky-950/30 to-card',
    simbolo: '⬡',
  },
};
