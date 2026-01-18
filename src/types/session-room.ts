// Session Room Types

export type SessionCaseStatus = 'draft' | 'active' | 'archived';
export type OracleMode = 'symbolic_card' | 'tarot' | 'numerology' | 'radiesthesia';
export type InterventionType = 'short_story' | 'metaphor' | 'writing' | 'visualization';

export interface SessionCase {
  id: string;
  therapist_id: string;
  client_id: string;
  title: string;
  status: SessionCaseStatus;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    nome: string;
    email?: string;
  };
}

export interface NarrativeMap {
  id: string;
  case_id: string;
  therapist_id: string;
  client_id: string;
  // Layer 1: Fact
  layer1_fact_event: string | null;
  layer1_context: string | null;
  layer1_trigger: string | null;
  // Layer 2: Emotion
  layer2_emotion_main: string | null;
  layer2_intensity: number | null;
  layer2_emotion_secondary: string | null;
  // Layer 3: Image
  layer3_scene: string | null;
  layer3_central_element: string | null;
  layer3_climate: string | null;
  // Layer 4: Archetype
  layer4_archetype_main: string | null;
  layer4_archetype_conflict: string | null;
  layer4_protects: string | null;
  // Layer 5: Feminine Shadow
  layer5_prohibition: string | null;
  layer5_strategy: string | null;
  layer5_cost: string | null;
  // Layer 6: Repetition
  layer6_first_memory: string | null;
  layer6_pattern: string | null;
  layer6_current_repeat: string | null;
  // Layer 7: Soul Invitation
  layer7_invitation: string | null;
  layer7_ego_resistance: string | null;
  layer7_small_gesture: string | null;
  // Summaries
  summary_core: string | null;
  summary_archetype: string | null;
  summary_repetition: string | null;
  summary_invitation: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionScript {
  id: string;
  case_id: string;
  narrative_map_id: string | null;
  therapist_id: string;
  client_id: string;
  opening_question: string | null;
  opening_gesture: string | null;
  exploration_questions: string | null;
  intervention_type: InterventionType | null;
  intervention_prompt: string | null;
  closing_name: string | null;
  closing_seal: string | null;
  closing_leave_open: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostSessionClosure {
  id: string;
  case_id: string;
  therapist_id: string;
  client_id: string;
  moved: string | null;
  left_open: string | null;
  do_not_touch: string | null;
  created_at: string;
}

export interface SessionOracleDraw {
  id: string;
  therapist_id: string;
  client_id: string | null;
  case_id: string | null;
  mode: OracleMode;
  axis_narrative: string | null;
  axis_archetype: string | null;
  axis_movement: string | null;
  oracle_image: string | null;
  mediator_symbol: string | null;
  suggested_rite: string | null;
  notes: string | null;
  created_at: string;
}

// Layer configuration for the 7 Layers wizard
export const LAYER_CONFIG = [
  {
    number: 1,
    title: 'O Fato',
    subtitle: 'O que aconteceu?',
    fields: [
      { key: 'layer1_fact_event', label: 'Evento/Fato', placeholder: 'Descreva o evento principal...', maxLength: 200 },
      { key: 'layer1_context', label: 'Contexto', placeholder: 'Em que contexto isso ocorreu?', maxLength: 150 },
      { key: 'layer1_trigger', label: 'Gatilho (opcional)', placeholder: 'O que disparou essa situação?', maxLength: 100, optional: true },
    ],
  },
  {
    number: 2,
    title: 'A Emoção',
    subtitle: 'O que sentiu?',
    fields: [
      { key: 'layer2_emotion_main', label: 'Emoção Principal', placeholder: 'Qual a emoção dominante?', maxLength: 50 },
      { key: 'layer2_intensity', label: 'Intensidade (0-10)', type: 'slider' },
      { key: 'layer2_emotion_secondary', label: 'Emoção Secundária (opcional)', placeholder: 'Outra emoção presente?', maxLength: 50, optional: true },
    ],
  },
  {
    number: 3,
    title: 'A Imagem',
    subtitle: 'Se fosse uma cena, como seria?',
    fields: [
      { key: 'layer3_scene', label: 'Cena', placeholder: 'Descreva a cena que surge...', maxLength: 200 },
      { key: 'layer3_central_element', label: 'Elemento Central', placeholder: 'Qual o elemento mais importante?', maxLength: 100 },
      { key: 'layer3_climate', label: 'Clima', placeholder: 'Qual a atmosfera da cena?', maxLength: 100 },
    ],
  },
  {
    number: 4,
    title: 'O Arquétipo',
    subtitle: 'Qual figura está ativa?',
    fields: [
      { key: 'layer4_archetype_main', label: 'Arquétipo Ativo', placeholder: 'Ex: A Mãe, O Herói, A Sombra...', maxLength: 100 },
      { key: 'layer4_archetype_conflict', label: 'Conflito Arquetípico (opcional)', placeholder: 'Qual força oposta está presente?', maxLength: 100, optional: true },
      { key: 'layer4_protects', label: 'O que protege?', placeholder: 'O que esse arquétipo tenta proteger?', maxLength: 150 },
    ],
  },
  {
    number: 5,
    title: 'A Sombra Feminina',
    subtitle: 'O que foi silenciado?',
    fields: [
      { key: 'layer5_prohibition', label: 'Proibição', placeholder: 'O que foi proibido sentir/expressar?', maxLength: 150 },
      { key: 'layer5_strategy', label: 'Estratégia de Sobrevivência', placeholder: 'Como se adaptou a isso?', maxLength: 150 },
      { key: 'layer5_cost', label: 'Custo', placeholder: 'Qual o preço dessa adaptação?', maxLength: 150 },
    ],
  },
  {
    number: 6,
    title: 'A Repetição',
    subtitle: 'Onde isso já aconteceu?',
    fields: [
      { key: 'layer6_first_memory', label: 'Primeira Memória (opcional)', placeholder: 'Quando isso aconteceu pela primeira vez?', maxLength: 200, optional: true },
      { key: 'layer6_pattern', label: 'Padrão', placeholder: 'Qual padrão se repete?', maxLength: 150 },
      { key: 'layer6_current_repeat', label: 'Repetição Atual', placeholder: 'Como isso aparece agora?', maxLength: 150 },
    ],
  },
  {
    number: 7,
    title: 'O Convite da Alma',
    subtitle: 'O que quer nascer?',
    fields: [
      { key: 'layer7_invitation', label: 'Convite', placeholder: 'O que está sendo convidada a fazer/ser?', maxLength: 200 },
      { key: 'layer7_ego_resistance', label: 'Resistência do Ego', placeholder: 'O que o ego resiste?', maxLength: 150 },
      { key: 'layer7_small_gesture', label: 'Pequeno Gesto', placeholder: 'Um pequeno passo possível...', maxLength: 150 },
    ],
  },
] as const;

// Oracle templates (static dataset, no AI interpretation)
export const ORACLE_TEMPLATES = {
  symbolic_card: {
    narratives: [
      'A narrativa atual fala de transformação silenciosa.',
      'O momento presente pede atenção ao que está sendo gestado.',
      'Há um movimento de recolhimento necessário.',
      'A história atual convida a olhar para o que foi deixado de lado.',
      'O presente revela um ciclo em conclusão.',
    ],
    archetypes: [
      'A Grande Mãe observa em silêncio.',
      'A Donzela desperta com curiosidade.',
      'A Anciã compartilha sua sabedoria.',
      'A Guerreira afirma seus limites.',
      'A Curandeira toca as feridas com gentileza.',
    ],
    movements: [
      'O movimento pede pausa antes da ação.',
      'É hora de nomear o que foi silenciado.',
      'O convite é para um ritual de passagem.',
      'A travessia exige soltar o que pesa.',
      'O gesto pedido é pequeno, mas significativo.',
    ],
  },
  tarot: {
    narratives: [
      'As cartas revelam um momento de encruzilhada.',
      'O caminho atual pede coragem para mudar de direção.',
      'A energia presente é de regeneração após perda.',
      'O momento convida à integração de opostos.',
      'Há uma força oculta pronta para emergir.',
    ],
    archetypes: [
      'O Louco inaugura um novo ciclo.',
      'A Imperatriz nutre o que precisa crescer.',
      'A Lua ilumina o que estava escondido.',
      'A Estrela traz esperança renovada.',
      'A Torre derruba o que não serve mais.',
    ],
    movements: [
      'O movimento é de descida antes de subida.',
      'A travessia pede fé no desconhecido.',
      'O gesto necessário é de rendição.',
      'A ação pedida é de separar o essencial.',
      'O convite é para honrar a própria sombra.',
    ],
  },
  numerology: {
    narratives: [
      'O número revela um ciclo de início (1).',
      'A energia presente é de parceria e dualidade (2).',
      'O momento pede expressão criativa (3).',
      'A estrutura precisa ser revisada (4).',
      'A liberdade chama com força (5).',
    ],
    archetypes: [
      'O Pioneiro abre caminhos.',
      'O Mediador busca equilíbrio.',
      'A Artista expressa sua verdade.',
      'O Construtor estabelece bases.',
      'O Viajante busca novos horizontes.',
    ],
    movements: [
      'O movimento é de assertividade.',
      'O convite é para a escuta.',
      'A ação pedida é criar sem julgamento.',
      'O gesto necessário é de organização.',
      'A travessia exige flexibilidade.',
    ],
  },
  radiesthesia: {
    narratives: [
      'O pêndulo indica estagnação energética.',
      'Há movimento de liberação em curso.',
      'A energia vital está em recuperação.',
      'O campo pede limpeza e renovação.',
      'Existe resistência a ser trabalhada.',
    ],
    archetypes: [
      'A Guardiã protege o campo.',
      'A Tecelã reconecta os fios.',
      'A Alquimista transforma o denso.',
      'A Vidente percebe além do visível.',
      'A Sacerdotisa guarda o sagrado.',
    ],
    movements: [
      'O movimento pede aterramento.',
      'A ação necessária é de proteção.',
      'O convite é para ritual de limpeza.',
      'O gesto pedido é de reconexão.',
      'A travessia exige paciência.',
    ],
  },
};
