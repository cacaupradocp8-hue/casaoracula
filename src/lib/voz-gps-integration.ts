/**
 * Voice-GPS Integration: Maps each Voz to preferred districts, tools, question styles, and posture.
 * Used by the GPS engine to adjust suggestions based on the therapist's active voice.
 */

export interface VozGPSProfile {
  id: string;
  nome: string;
  distritos_preferidos: string[];
  ferramentas_keywords: string[];
  estilo_pergunta: string;
  postura: { sustentar: string; evitar: string };
  perguntas_exemplo: string[];
}

const VOZ_GPS_PROFILES: Record<string, VozGPSProfile> = {
  'fogo-antigo': {
    id: 'fogo-antigo',
    nome: 'Fogo Antigo',
    distritos_preferidos: ['praça do fogo', 'arena da verdade', 'torre da ruptura'],
    ferramentas_keywords: ['ruptura', 'verdade', 'confronto', 'fogo', 'labirinto'],
    estilo_pergunta: 'perguntas de ruptura, confronto e verdade',
    postura: {
      sustentar: 'Permitir ruptura com cuidado e presença firme',
      evitar: 'Suavização excessiva ou evitação do confronto',
    },
    perguntas_exemplo: [
      'O que você está evitando olhar de frente?',
      'Que verdade precisa ser dita agora?',
      'Onde está a raiva que sustenta essa estrutura?',
    ],
  },
  'cura-pelo-contato': {
    id: 'cura-pelo-contato',
    nome: 'Cura pelo Contato',
    distritos_preferidos: ['jardim do corpo', 'fonte da regulação', 'torre do cuidado'],
    ferramentas_keywords: ['corpo', 'somático', 'regulação', 'contato', 'presença'],
    estilo_pergunta: 'perguntas corporais e de regulação somática',
    postura: {
      sustentar: 'Sustentar presença e ritmo lento, atenção ao corpo',
      evitar: 'Apressar o processo ou intelectualizar a experiência',
    },
    perguntas_exemplo: [
      'O que seu corpo está tentando sustentar neste momento?',
      'Onde no corpo essa emoção se manifesta?',
      'Se essa sensação pudesse falar, o que diria?',
    ],
  },
  'sopra-historias': {
    id: 'sopra-historias',
    nome: 'Sopra Histórias',
    distritos_preferidos: ['biblioteca das narrativas', 'praça da memória', 'torre da origem'],
    ferramentas_keywords: ['narrativa', 'história', 'mito', 'conto', 'narroterapia'],
    estilo_pergunta: 'perguntas narrativas e de ressignificação da história',
    postura: {
      sustentar: 'Manter o fio narrativo e honrar a história contada',
      evitar: 'Interromper a narrativa ou impor interpretação fechada',
    },
    perguntas_exemplo: [
      'Que história você conta a si mesma sobre isso?',
      'Se essa vivência fosse um capítulo, que título teria?',
      'Quem é a personagem que precisa ser ouvida agora?',
    ],
  },
  'sonha-para-o-coletivo': {
    id: 'sonha-para-o-coletivo',
    nome: 'Sonha para o Coletivo',
    distritos_preferidos: ['ágora do coletivo', 'torre do pertencimento', 'jardim das raízes'],
    ferramentas_keywords: ['coletivo', 'grupo', 'pertencimento', 'comunidade', 'círculo'],
    estilo_pergunta: 'perguntas sobre pertencimento e dimensão coletiva',
    postura: {
      sustentar: 'Ampliar a escuta para o campo coletivo e ancestral',
      evitar: 'Reduzir a experiência apenas à dimensão individual',
    },
    perguntas_exemplo: [
      'De quem você carrega essa dor que não é só sua?',
      'Que padrão familiar está ativo neste momento?',
      'O que o campo coletivo está pedindo através de você?',
    ],
  },
  'tece-o-invisivel': {
    id: 'tece-o-invisivel',
    nome: 'Tece o Invisível',
    distritos_preferidos: ['torre da estrutura', 'labirinto dos padrões', 'mapa da organização'],
    ferramentas_keywords: ['estrutura', 'padrão', 'organização', 'mapeamento', 'cartografia'],
    estilo_pergunta: 'perguntas estruturantes e organizadoras do campo',
    postura: {
      sustentar: 'Organizar o campo antes de aprofundar',
      evitar: 'Mergulhar no caos sem criar contorno seguro',
    },
    perguntas_exemplo: [
      'Que fios conectam essas experiências entre si?',
      'Qual padrão se repete aqui que você já viu antes?',
      'O que precisa de organização antes de seguir?',
    ],
  },
  'lembra-caminhos-antigos': {
    id: 'lembra-caminhos-antigos',
    nome: 'Lembra os Caminhos Antigos',
    distritos_preferidos: ['templo da ancestralidade', 'torre da sabedoria', 'jardim da memória'],
    ferramentas_keywords: ['ancestral', 'memória', 'sabedoria', 'tradição', 'raiz'],
    estilo_pergunta: 'perguntas sobre sabedoria ancestral e memória profunda',
    postura: {
      sustentar: 'Honrar a sabedoria que já existe na história pessoal',
      evitar: 'Desconsiderar o passado ou forçar novidade',
    },
    perguntas_exemplo: [
      'Que sabedoria antiga já mora em você sobre isso?',
      'O que suas ancestrais fariam diante deste momento?',
      'Que caminho já foi percorrido que pode ser lembrado?',
    ],
  },
  'escuta-as-sombras': {
    id: 'escuta-as-sombras',
    nome: 'Escuta as Sombras',
    distritos_preferidos: ['vale da sombra', 'torre do espelho', 'labirinto interior'],
    ferramentas_keywords: ['sombra', 'espelho', 'projeção', 'inconsciente', 'complexo'],
    estilo_pergunta: 'perguntas sobre sombra, projeção e material inconsciente',
    postura: {
      sustentar: 'Acolher o material sombrio com firmeza e sem julgamento',
      evitar: 'Iluminar a sombra prematuramente ou moralizar',
    },
    perguntas_exemplo: [
      'O que está na sombra que pede para ser visto?',
      'O que você rejeita no outro que também existe em você?',
      'Que parte sua está pedindo para ser integrada?',
    ],
  },
};

/**
 * Get the GPS profile for a given voice ID
 */
export function getVozGPSProfile(vozId: string): VozGPSProfile | null {
  return VOZ_GPS_PROFILES[vozId] || null;
}

/**
 * Adjust a GPS suggestion's posture and question based on the active voice
 */
export function adjustSuggestionForVoz(
  suggestion: {
    postura: { sustentar: string; evitar: string };
    pergunta_clinica: string;
    distrito_sugerido: string;
    ferramenta_recomendada: string;
    confianca: number;
  },
  vozId: string,
): {
  postura: { sustentar: string; evitar: string };
  pergunta_clinica: string;
  confianca_boost: number;
  voz_influencia: string;
} {
  const profile = getVozGPSProfile(vozId);
  if (!profile) {
    return {
      postura: suggestion.postura,
      pergunta_clinica: suggestion.pergunta_clinica,
      confianca_boost: 0,
      voz_influencia: '',
    };
  }

  // Check if district aligns with voice
  const distritoLower = suggestion.distrito_sugerido.toLowerCase();
  const districtAligned = profile.distritos_preferidos.some(d => distritoLower.includes(d) || d.includes(distritoLower));

  // Check if tool aligns with voice
  const ferramentaLower = suggestion.ferramenta_recomendada.toLowerCase();
  const toolAligned = profile.ferramentas_keywords.some(k => ferramentaLower.includes(k));

  // Pick a contextual question from the voice profile
  const pergunta = profile.perguntas_exemplo[Math.floor(Math.random() * profile.perguntas_exemplo.length)];

  // Confidence boost when voice aligns with suggestion
  const confianca_boost = (districtAligned ? 5 : 0) + (toolAligned ? 5 : 0);

  return {
    postura: profile.postura,
    pergunta_clinica: pergunta,
    confianca_boost,
    voz_influencia: profile.nome,
  };
}

/**
 * Sort tool IDs by voice compatibility (compatible tools first)
 */
export function sortToolsByVozGPS(
  tools: Array<{ id: string; nome: string; slug?: string }>,
  vozId: string,
): Array<{ id: string; nome: string; slug?: string }> {
  const profile = getVozGPSProfile(vozId);
  if (!profile) return tools;

  return [...tools].sort((a, b) => {
    const aMatch = profile.ferramentas_keywords.some(k => a.nome.toLowerCase().includes(k));
    const bMatch = profile.ferramentas_keywords.some(k => b.nome.toLowerCase().includes(k));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });
}
