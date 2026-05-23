export interface AtlasModule {
  id: string;
  name: string;
  function: string;
  observations: string[];
  status: 'em-integracao' | 'em-breve' | 'ativo';
  description: string;
}

export const atlasModules: AtlasModule[] = [
  {
    id: 'big-five',
    name: 'Big Five',
    function: 'Camada de traços e temperamento.',
    observations: [
      'Estabilidade emocional',
      'Abertura a experiências',
      'Organização e foco',
      'Sociabilidade',
      'Sensibilidade interpessoal'
    ],
    status: 'em-integracao',
    description: 'Oferece uma leitura sobre a estrutura de base da personalidade sem julgamento de valor ou termos deterministas.'
  },
  {
    id: 'cartografia',
    name: 'Cartografia Psíquica',
    function: 'Visão panorâmica do caso.',
    observations: [
      'História e contexto',
      'Forças e recursos',
      'Tensões principais',
      'Padrões centrais',
      'Geografia interna'
    ],
    status: 'em-integracao',
    description: 'Organiza os elementos dispersos da queixa em um mapa coerente que facilita a visualização do território psíquico.'
  },
  {
    id: 'crenças',
    name: 'R.O.T.A.I / Crenças',
    function: 'Camada de crenças nucleares.',
    observations: [
      'Frases internas',
      'Crenças de valor',
      'Crenças de pertença',
      'Crenças de segurança',
      'Crenças de merecimento'
    ],
    status: 'em-breve',
    description: 'Investiga os pilares cognitivos e emocionais que sustentam a visão de mundo e de si mesma.'
  },
  {
    id: 'torre-viva',
    name: 'Torre Viva',
    function: 'Camada de defesas psíquicas.',
    observations: [
      'Mecanismos de proteção',
      'Padrões de evitamento',
      'Hipercontrolo',
      'Retraimento',
      'Estratégias de sobrevivência'
    ],
    status: 'em-integracao',
    description: 'Observa como a psique se protege e quais os custos e ganhos dessas estratégias defensivas.'
  },
  {
    id: 'labirinto',
    name: 'Labirinto',
    function: 'Camada de padrões repetitivos.',
    observations: [
      'Ciclos relacionais',
      'Repetições emocionais',
      'Bloqueios recorrentes',
      'Caminhos de retorno',
      'Pontos de estagnação'
    ],
    status: 'em-integracao',
    description: 'Identifica os movimentos circulares que mantêm o caso em repetição, impedindo a travessia.'
  },
  {
    id: 'complexos',
    name: 'Complexos',
    function: 'Camada de núcleos emocionais ativados.',
    observations: [
      'Temas sensíveis',
      'Feridas recorrentes',
      'Imagens internas',
      'Reações desproporcionais',
      'Pontos de activação'
    ],
    status: 'em-breve',
    description: 'Mapeia os núcleos de alta carga emocional que perturbam a consciência e geram reatividade.'
  },
  {
    id: 'sonhos',
    name: 'Sonhos / Laboratório Onírico',
    function: 'Camada de material onírico e simbólico.',
    observations: [
      'Imagens recorrentes',
      'Atmosferas emocionais',
      'Símbolos centrais',
      'Narrativas inconscientes',
      'Movimentos da alma'
    ],
    status: 'em-integracao',
    description: 'Processa o material do inconsciente para encontrar pistas sobre o movimento de cura em curso.'
  },
  {
    id: '7-vozes',
    name: '7 Vozes',
    function: 'Camada de partes internas.',
    observations: [
      'Vozes internas',
      'Conflitos entre partes',
      'Polaridades',
      'Partes protetoras',
      'Partes vulneráveis'
    ],
    status: 'em-integracao',
    description: 'Diferencia os diversos "personagens" internos que compõem o diálogo mental e emocional.'
  },
  {
    id: 'portas',
    name: 'Portas',
    function: 'Camada de entradas simbólicas.',
    observations: [
      'Pontos de entrada no caso',
      'Prioridade temática',
      'Linguagem simbólica',
      'Chaves de abertura',
      'Resistências iniciais'
    ],
    status: 'em-breve',
    description: 'Ajuda a decidir por onde iniciar o trabalho clínico para que a comunicação seja mais fluida e segura.'
  },
  {
    id: 'mapa-vivo',
    name: 'Mapa Vivo',
    function: 'Camada de síntese e evolução.',
    observations: [
      'Movimento do caso',
      'Mudanças temporais',
      'Respostas a intervenções',
      'Próximos passos',
      'Nível de integração'
    ],
    status: 'em-integracao',
    description: 'Uma visão dinâmica que acompanha o processo de transformação e a eficácia da direção tomada.'
  },
  {
    id: 'intervencoes',
    name: 'Biblioteca de Intervenções',
    function: 'Camada de direção prática.',
    observations: [
      'Práticas sugeridas',
      'Protocolos adequados',
      'Perguntas terapêuticas',
      'Recursos de apoio',
      'Direcionamento de sessão'
    ],
    status: 'em-integracao',
    description: 'Conecta a formulação do Atlas com ações práticas e perguntas que aprofundam a sessão.'
  }
];
