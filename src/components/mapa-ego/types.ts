// ============================================
// MAPA DO EGO FEMININO - TYPES
// ============================================

export type MapaEgoEtapa = 
  | 'exploracao'      // Explorar as camadas
  | 'integracao'      // Integração simbólica (atual)
  | 'visualizacao'    // Visualização do mapa consolidado
  | 'sintese'         // Síntese narrativa
  | 'jardim';         // Registro no Jardim

export interface CamadaEgo {
  id: string;
  nome: string;
  cor: string;
  descricao: string;
  convites: string[]; // Antes: perguntas
}

export interface RespostaCamada {
  camadaId: string;
  respostas: string[];
  intensidade?: 'baixa' | 'media' | 'alta';
  observacao?: string;
}

export interface MapaEgoState {
  etapaAtual: MapaEgoEtapa;
  respostas: Record<string, RespostaCamada>;
  sinteseNarrativa?: string;
  reflexaoFinal?: string;
  dataInicio: string;
  dataConclusao?: string;
}

export const CAMADAS_EGO: CamadaEgo[] = [
  {
    id: 'fisico',
    nome: 'Corpo Físico',
    cor: 'hsl(0, 70%, 50%)',
    descricao: 'A morada da experiência sensível — onde a vida pulsa e se manifesta.',
    convites: [
      'Como habita seu corpo neste momento?',
      'Onde sente tensão, acolhimento ou silêncio?',
      'Que cuidado seu corpo pede hoje?',
    ],
  },
  {
    id: 'eterico',
    nome: 'Corpo Etérico',
    cor: 'hsl(30, 70%, 50%)',
    descricao: 'O campo vital que sustenta a forma — a energia que anima.',
    convites: [
      'Como está sua energia vital hoje?',
      'O que nutre ou drena sua vitalidade?',
      'Que ritmo seu corpo pede?',
    ],
  },
  {
    id: 'astral',
    nome: 'Corpo Astral',
    cor: 'hsl(50, 70%, 50%)',
    descricao: 'O oceano das emoções — onde sentimos, reagimos e nos conectamos.',
    convites: [
      'Quais emoções atravessam você agora?',
      'Há algum sentimento sendo evitado ou contido?',
      'Como você se relaciona com o que sente?',
    ],
  },
  {
    id: 'mental',
    nome: 'Eu Mental',
    cor: 'hsl(170, 50%, 45%)',
    descricao: 'A instância da clareza e do pensamento — onde nomeamos e organizamos.',
    convites: [
      'Como está sua clareza mental?',
      'Quais pensamentos predominam?',
      'Consegue sustentar foco ou dispersa?',
    ],
  },
  {
    id: 'espiritual',
    nome: 'Eu Espiritual',
    cor: 'hsl(270, 70%, 60%)',
    descricao: 'A dimensão do sentido e do propósito — conexão com algo maior.',
    convites: [
      'Sente conexão com algo maior que você?',
      'Está alinhada com seu propósito?',
      'Como anda sua vida interior?',
    ],
  },
];

export const ETAPAS_INFO: Record<MapaEgoEtapa, { titulo: string; subtitulo: string }> = {
  exploracao: {
    titulo: 'Exploração das Camadas',
    subtitulo: 'Atravesse cada dimensão do seu ser com presença',
  },
  integracao: {
    titulo: 'Integração Simbólica',
    subtitulo: 'Perceba as conexões entre as camadas',
  },
  visualizacao: {
    titulo: 'O Mapa Revelado',
    subtitulo: 'Contemple o desenho que emerge de suas respostas',
  },
  sintese: {
    titulo: 'Síntese Narrativa',
    subtitulo: 'Uma leitura simbólica do seu momento',
  },
  jardim: {
    titulo: 'Registro no Jardim',
    subtitulo: 'Guarde esta travessia no seu espaço privado',
  },
};
