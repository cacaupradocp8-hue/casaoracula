// Session Room Types - 7-Layer Symbolic Decoding

export interface LayerResponse {
  layerId: string;
  value: string | number | Record<string, string>;
  timestamp: string;
}

export interface SessionData {
  id?: string;
  // Layer 1: The Fact
  fact: string;
  
  // Layer 2: Dominant Emotion
  emotion: string;
  emotionIntensity: number;
  
  // Layer 3: Image
  image: string;
  imageAtmosphere: string;
  
  // Layer 4: Active Archetype
  primaryArchetype: string;
  conflictArchetype: string;
  
  // Layer 5: Feminine Shadow
  learnedProhibition: string;
  survivalStrategy: string;
  currentCost: string;
  
  // Layer 6: Repetition
  repetitionPattern: string;
  
  // Layer 7: Soul's Invitation
  soulInvitation: string;
  egoResistance: string;
  smallGesture: string;
  
  // Post-Session
  whatMoved: string;
  whatRemainsOpen: string;
  whatNotToTouch: string;
  
  // Session Script
  sessionScript: SessionScript;
  
  // Metadata
  createdAt: string;
  completedAt?: string;
}

export interface SessionScript {
  symbolicOpening: string;
  coreExploration: string;
  narrativeIntervention: string;
  ritualClosing: string;
}

export interface NarrativeMap {
  core: {
    fact: string;
    emotion: string;
    emotionIntensity: number;
    image: string;
  };
  archetypeShadow: {
    archetype: string;
    whatProtects: string;
    whatSilences: string;
  };
  repetition: string;
  soulInvitation: {
    invitation: string;
    firstGesture: string;
  };
}

export const LAYERS = [
  {
    id: 'fact',
    number: 1,
    title: 'O Fato',
    subtitle: 'O que aconteceu',
    symbol: '◯',
    description: 'Descreva apenas o que aconteceu, sem interpretação ou julgamento.',
    prompt: 'O que de fato ocorreu?',
    color: 'from-slate-500/20 to-slate-600/10',
    borderColor: 'border-slate-500/30',
  },
  {
    id: 'emotion',
    number: 2,
    title: 'Emoção Dominante',
    subtitle: 'O que sente',
    symbol: '◐',
    description: 'Identifique a emoção principal e sua intensidade.',
    prompt: 'Qual emoção domina este momento?',
    color: 'from-rose-500/20 to-rose-600/10',
    borderColor: 'border-rose-500/30',
  },
  {
    id: 'image',
    number: 3,
    title: 'A Imagem',
    subtitle: 'O que vê',
    symbol: '◑',
    description: 'Que cena, elemento ou atmosfera surge quando você fecha os olhos?',
    prompt: 'Qual imagem aparece?',
    color: 'from-indigo-500/20 to-indigo-600/10',
    borderColor: 'border-indigo-500/30',
  },
  {
    id: 'archetype',
    number: 4,
    title: 'Arquétipo Ativo',
    subtitle: 'Quem atua',
    symbol: '◒',
    description: 'Qual figura arquetípica está presente? Há conflito entre duas forças?',
    prompt: 'Qual arquétipo está ativo?',
    color: 'from-purple-500/20 to-purple-600/10',
    borderColor: 'border-purple-500/30',
  },
  {
    id: 'shadow',
    number: 5,
    title: 'Sombra Feminina',
    subtitle: 'O que foi silenciado',
    symbol: '◓',
    description: 'Qual proibição foi aprendida? Qual estratégia de sobrevivência se formou? Qual o custo atual?',
    prompt: 'O que foi interditado?',
    color: 'from-amber-500/20 to-amber-600/10',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 'repetition',
    number: 6,
    title: 'A Repetição',
    subtitle: 'Onde isso se repete',
    symbol: '◔',
    description: 'Onde mais esse padrão aparece na sua vida?',
    prompt: 'Onde isso se repete?',
    color: 'from-teal-500/20 to-teal-600/10',
    borderColor: 'border-teal-500/30',
  },
  {
    id: 'invitation',
    number: 7,
    title: 'Convite da Alma',
    subtitle: 'O que pede passagem',
    symbol: '●',
    description: 'Qual o convite? O que o ego resiste? Qual pequeno gesto é possível agora?',
    prompt: 'O que a alma convida?',
    color: 'from-gold/20 to-gold-dark/10',
    borderColor: 'border-primary/30',
  },
] as const;

export const EMOTIONS = [
  'Medo', 'Raiva', 'Tristeza', 'Vergonha', 'Culpa',
  'Ansiedade', 'Solidão', 'Frustração', 'Desespero', 'Vazio',
  'Angústia', 'Impotência', 'Ciúme', 'Ressentimento', 'Nojo',
  'Confusão', 'Luto', 'Abandono', 'Rejeição', 'Inadequação'
];

export const ARCHETYPES = [
  'A Mãe', 'A Donzela', 'A Anciã', 'A Guerreira', 'A Amante',
  'A Sábia', 'A Selvagem', 'A Curadora', 'A Visionária', 'A Criadora',
  'A Protetora', 'A Destruidora', 'A Mediadora', 'A Eremita', 'A Sacerdotisa'
];
