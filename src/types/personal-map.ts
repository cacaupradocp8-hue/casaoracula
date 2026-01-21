// ============================================
// PERSONAL SYMBOLIC MAPS - TYPES
// ============================================
// Private reflective space for therapists
// NOT clinical records - symbolic/reflective/formative only

export type PersonalMapTemplateKey = 
  | 'big5_reflective'
  | 'enneagram_symbolic'
  | 'anthroposophy_human_being'
  | 'systemic_constellation_reflection'
  | 'tarot_archetypal_map';

export interface PersonalMapSection {
  key: string;
  title: string;
  prompts: string[];
}

export interface PersonalMapTemplate {
  key: PersonalMapTemplateKey;
  title: string;
  description: string;
  icon: string;
  sections: PersonalMapSection[];
}

export interface PersonalSymbolicMap {
  id: string;
  user_id: string;
  template_key: PersonalMapTemplateKey;
  title: string;
  description: string | null;
  content: Record<string, string>;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// TEMPLATE DEFINITIONS
// ============================================

export const PERSONAL_MAP_TEMPLATES: PersonalMapTemplate[] = [
  {
    key: 'big5_reflective',
    title: 'Os Cinco Grandes (Reflexivo)',
    description: 'Observação reflexiva dos traços de personalidade em contexto simbólico',
    icon: 'Brain',
    sections: [
      {
        key: 'context',
        title: '1. Contexto de Observação',
        prompts: [
          'Sessão ou momento observado',
          'Clima emocional',
          'Sensações corporais'
        ]
      },
      {
        key: 'openness',
        title: '2. Abertura',
        prompts: [
          'Como surgiu a curiosidade?',
          'Resistência à novidade?',
          'Percebeu-se alguma expressão simbólica?'
        ]
      },
      {
        key: 'conscientiousness',
        title: '3. Conscienciosidade',
        prompts: [
          'Senso de estrutura ou rigidez?',
          'Disciplina interna versus controle?',
          'Reflexão do terapeuta'
        ]
      },
      {
        key: 'extraversion',
        title: '4. Extroversão',
        prompts: [
          'Fluxo de energia',
          'Presença versus retirada',
          'Tom relacional'
        ]
      },
      {
        key: 'agreeableness',
        title: '5. Agradabilidade',
        prompts: [
          'Fronteiras versus fusão',
          'Padrões de adaptação',
          'Evitar conflitos?'
        ]
      },
      {
        key: 'neuroticism',
        title: '6. Neuroticismo',
        prompts: [
          'Reatividade emocional',
          'Estratégias de regulamentação',
          'Autorregulação do terapeuta'
        ]
      },
      {
        key: 'integration',
        title: '7. Reflexão Integrativa',
        prompts: [
          'Padrões observados',
          'Hipótese (não diagnóstica)',
          'Intenção da próxima sessão'
        ]
      }
    ]
  },
  {
    key: 'enneagram_symbolic',
    title: 'Eneagrama (Simbólico)',
    description: 'Mapeamento da energia arquetípica e padrões emocionais',
    icon: 'Compass',
    sections: [
      {
        key: 'archetypal_energy',
        title: '1. Energia Arquetípica Observada',
        prompts: [
          'Tom dominante',
          'Mecanismo de defesa percebido',
          'Padrão emocional'
        ]
      },
      {
        key: 'fear_desire',
        title: '2. Medo/Desejo Essencial (Simbólico)',
        prompts: [
          'O que parece influenciar o comportamento?',
          'Padrões de evitação'
        ]
      },
      {
        key: 'fixation_passion',
        title: '3. Fixação e Paixão',
        prompts: [
          'Narrativas repetitivas',
          'Ciclos emocionais'
        ]
      },
      {
        key: 'virtue',
        title: '4. Virtude (Emergente)',
        prompts: [
          'Sinais de integração',
          'Momentos de expansão'
        ]
      },
      {
        key: 'somatic',
        title: '5. Sinais Somáticos',
        prompts: [
          'Reações corporais',
          'Tônus do sistema nervoso'
        ]
      },
      {
        key: 'therapist_position',
        title: '6. Posição do Terapeuta',
        prompts: [
          'Ressonância ou contratransferência',
          'Resposta interna'
        ]
      }
    ]
  },
  {
    key: 'anthroposophy_human_being',
    title: 'Visão Antroposófica',
    description: 'Observação constitucional e momento biográfico',
    icon: 'Flower2',
    sections: [
      {
        key: 'constitutional',
        title: '1. Observação Constitucional',
        prompts: [
          'Corpo físico',
          'Vitalidade etérica',
          'Ritmo emocional',
          'Clareza de pensamento'
        ]
      },
      {
        key: 'temperament',
        title: '2. Tendências Temperamentais',
        prompts: [
          'Temperamento dominante',
          'Desequilíbrios percebidos'
        ]
      },
      {
        key: 'biographical',
        title: '3. Momento Biográfico',
        prompts: [
          'Ressonância da fase da vida',
          'Limiares ou crises'
        ]
      },
      {
        key: 'ego_presence',
        title: '4. Presença do Ego',
        prompts: [
          'Sinais de autonomia',
          'Capacidade de escolha consciente'
        ]
      },
      {
        key: 'therapeutic_gesture',
        title: '5. Gesto Terapêutico',
        prompts: [
          'Gesto interior necessário',
          'Forças de apoio'
        ]
      }
    ]
  },
  {
    key: 'systemic_constellation_reflection',
    title: 'Constelação Sistêmica',
    description: 'Reflexão sobre dinâmicas sistêmicas e ordens do amor',
    icon: 'Users',
    sections: [
      {
        key: 'system_observed',
        title: '1. Sistema Observado',
        prompts: [
          'Sistema familiar/de trabalho/relacional',
          'Posicionamento de funções'
        ]
      },
      {
        key: 'belonging_exclusion',
        title: '2. Pertencimento e Exclusão',
        prompts: [
          'Quem está desaparecido?',
          'Lealdades invisíveis?'
        ]
      },
      {
        key: 'orders_of_love',
        title: '3. Ordens do Amor',
        prompts: [
          'Hierarquia',
          'Equilíbrio entre dar e receber'
        ]
      },
      {
        key: 'repetition_patterns',
        title: '4. Padrões de Repetição',
        prompts: [
          'Ecos transgeracionais',
          'Dinâmicas inconscientes'
        ]
      },
      {
        key: 'healing_movement',
        title: '5. Movimento de Cura',
        prompts: [
          'Reordenação simbólica',
          'Frase interna'
        ]
      }
    ]
  },
  {
    key: 'tarot_archetypal_map',
    title: 'Tarô (Leitura Arquetípica)',
    description: 'Mapeamento simbólico através dos arcanos',
    icon: 'Sparkles',
    sections: [
      {
        key: 'central_archetype',
        title: '1. Arquétipo Central',
        prompts: [
          'Carta sorteada',
          'Tema simbólico'
        ]
      },
      {
        key: 'shadow_expression',
        title: '2. Expressão Sombria',
        prompts: [
          'O que é inconsciente?',
          'Evitar ou projetar'
        ]
      },
      {
        key: 'conscious_invitation',
        title: '3. Convite Consciente',
        prompts: [
          'O que deseja ser integrado?',
          'Mudança de ação ou de atitude'
        ]
      },
      {
        key: 'relational_axis',
        title: '4. Eixo Relacional',
        prompts: [
          'Como os arquétipos influenciam os relacionamentos'
        ]
      },
      {
        key: 'initiatic_message',
        title: '5. Mensagem Iniciática',
        prompts: [
          'Limite',
          'Passagem',
          'Transformação'
        ]
      }
    ]
  }
];

export function getTemplateByKey(key: PersonalMapTemplateKey): PersonalMapTemplate | undefined {
  return PERSONAL_MAP_TEMPLATES.find(t => t.key === key);
}
